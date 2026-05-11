const { withDangerousMod, withAppBuildGradle, withAndroidManifest } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const withAndroidTextRecognition = (config) => {
  // 1. Fix top-level build.gradle and patch library files
  config = withDangerousMod(config, [
    'android',
    async (config) => {
      // Fix top-level build.gradle for SDK versions
      const rootGradle = path.join(config.modRequest.projectRoot, 'android', 'build.gradle');
      if (fs.existsSync(rootGradle)) {
        let contents = fs.readFileSync(rootGradle, 'utf-8');
        contents = fixTopLevelBuildGradle(contents);
        fs.writeFileSync(rootGradle, contents);
      }

      const libraryRoot = path.join(config.modRequest.projectRoot, 'node_modules', 'react-native-text-recognition', 'android');

      // PATCH 1: Fix the library's build.gradle dependencies
      const libraryGradle = path.join(libraryRoot, 'build.gradle');
      if (fs.existsSync(libraryGradle)) {
        let contents = fs.readFileSync(libraryGradle, 'utf-8');
        const oldDepPattern = /implementation 'com\.google\.android\.gms:play-services-mlkit-text-recognition:.*'/;
        const newDep = "implementation 'com.google.mlkit:text-recognition:16.0.0'\n    implementation 'com.google.mlkit:vision-common:17.3.0'";
        
        if (contents.match(oldDepPattern)) {
          contents = contents.replace(oldDepPattern, newDep);
          fs.writeFileSync(libraryGradle, contents);
        }
      }

      // PATCH 2: Fix the library's Java source code to use the bundled ML Kit Latin model
      const javaFile = path.join(
        libraryRoot,
        'src',
        'main',
        'java',
        'com',
        'reactnativetextrecognition',
        'TextRecognitionModule.java'
      );

      if (fs.existsSync(javaFile)) {
        let contents = fs.readFileSync(javaFile, 'utf-8');
        // Ensure the correct import for bundled Latin model
        contents = contents.replace(
          /import com\.google\.mlkit\.vision\.text\.TextRecognizerOptions;/g,
          'import com.google.mlkit.vision.text.latin.TextRecognizerOptions;'
        );
        // Ensure the usage is also correct
        contents = contents.replace(
          /com\.google\.mlkit\.vision\.text\.latin\.TextRecognizerOptions\.DEFAULT_OPTIONS/g,
          'TextRecognizerOptions.DEFAULT_OPTIONS'
        );
        fs.writeFileSync(javaFile, contents);
      }
      return config;
    },
  ]);

  // 2. Fix app/build.gradle to ensure bundled ML Kit is present in the final APK
  config = withAppBuildGradle(config, (config) => {
    if (config.modResults.contents) {
      config.modResults.contents = fixAppBuildGradle(config.modResults.contents);
    }
    return config;
  });

  // 3. Add meta-data to AndroidManifest.xml
  config = withAndroidManifest(config, (config) => {
    const mainApplication = config.modResults.manifest.application[0];
    
    if (!mainApplication['meta-data']) {
      mainApplication['meta-data'] = [];
    }

    const hasOcrMeta = mainApplication['meta-data'].some(
      (m) => m.$['android:name'] === 'com.google.mlkit.vision.DEPENDENCIES'
    );

    if (!hasOcrMeta) {
      mainApplication['meta-data'].push({
        $: {
          'android:name': 'com.google.mlkit.vision.DEPENDENCIES',
          'android:value': 'ocr',
        },
      });
    }

    return config;
  });

  return config;
};

function fixTopLevelBuildGradle(contents) {
  // Add SDK version variables
  const sdkFix = `
        TextRecognition_compileSdkVersion = 34
        TextRecognition_targetSdkVersion = 34
        TextRecognition_buildToolsVersion = "34.0.0"
        TextRecognition_minSdkVersion = 21`;

  if (!contents.includes('TextRecognition_compileSdkVersion')) {
    contents = contents.replace(/ext \{/, `ext {${sdkFix}`);
  }

  // CLEANUP: Remove ANY previous allprojects or subprojects blocks related to ML Kit
  contents = contents.replace(/\nallprojects \{\n    configurations\.all \{\n[\s\S]*?\}\n\}\n/g, '');
  contents = contents.replace(/\nallprojects \{\n    afterEvaluate [\s\S]*?\}\n\}\n/g, '');
  contents = contents.replace(/\nsubprojects \{\n    afterEvaluate [\s\S]*?\}\n\}\n/g, '');
  contents = contents.replace(/\nsubprojects \{\n    configurations\.all \{\n[\s\S]*?\}\n\}\n/g, '');
  
  return contents;
}

function fixAppBuildGradle(contents) {
  const dependencies = `
    implementation 'com.google.mlkit:text-recognition:16.0.0'
    implementation 'com.google.mlkit:vision-common:17.3.0'
`;

  // Remove any previous attempts
  contents = contents.replace(/\n    implementation 'com\.google\.mlkit:text-recognition:16\.0\.0'/g, '');
  contents = contents.replace(/\n    implementation 'com\.google\.mlkit:vision-common:17\.3\.0'/g, '');
  contents = contents.replace(/\n    implementation 'com\.google\.mlkit:vision-common:17\.0\.0'/g, '');
  contents = contents.replace(/\n    implementation 'com\.google\.mlkit:vision-common:16\.7\.0'/g, '');
  contents = contents.replace(/\n    implementation 'com\.google\.android\.gms:play-services-mlkit-text-recognition:19\.0\.0'/g, '');
  contents = contents.replace(/\n    implementation 'com\.google\.android\.gms:play-services-mlkit-text-recognition:18\.0\.0'/g, '');
  contents = contents.replace(/\n    implementation 'com\.google\.android\.gms:play-services-mlkit-text-recognition:18\.0\.2'/g, '');
  contents = contents.replace(/\n    implementation 'com\.google\.android\.gms:play-services-mlkit-text-recognition:17\.0\.0'/g, '');
  contents = contents.replace(/\n    implementation 'com\.google\.android\.gms:play-services-base:18\.5\.0'/g, '');
  contents = contents.replace(/\n    implementation 'com\.google\.android\.gms:play-services-base:18\.1\.0'/g, '');

  if (contents.includes('implementation("com.facebook.react:react-android")')) {
    return contents.replace('implementation("com.facebook.react:react-android")', `implementation("com.facebook.react:react-android")\n${dependencies}`);
  }

  return contents.replace(/dependencies \{/, `dependencies {${dependencies}`);
}

module.exports = withAndroidTextRecognition;
