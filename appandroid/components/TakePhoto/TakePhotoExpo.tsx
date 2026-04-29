
import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { CameraView, CameraType, CameraCapturedPicture } from "expo-camera";

import Icon from '@/components/Icon/Icon';
import { Colors } from '@/constants/Colors';

const TakePhotoExpo = () => {
    const [facing, setFacing] = useState<CameraType>('front');
    const [photo, setPhoto] = useState<CameraCapturedPicture | undefined>(undefined);
    const cameraRef = useRef<CameraView | null>(null);

  const capture = async () => {
      
        const options = {};
        setPhoto(await cameraRef.current?.takePictureAsync(options));

  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const viewCapturedImage = () => {

    alert('TODO : Image Viewer');

  }


  return (

      <CameraView
          style={styles.camera}
          facing={facing}
          ref={cameraRef}
      >
        <View style={styles.buttonContainer}>

            <TouchableOpacity style={styles.button} onPress={viewCapturedImage}>
              <Icon.Image color={Colors.white} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={capture}>
              <Icon.Capture color={Colors.white} size={98} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
              <Icon.CameraRotate color={Colors.white} />
            </TouchableOpacity>

        </View>
      </CameraView>


  )
}

export default TakePhotoExpo

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
    },
    message: {
      textAlign: 'center',
      paddingBottom: 10,
    },
    camera: {
      flex: 1,
    },
    buttonContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      backgroundColor: 'transparent',
      margin: 50,
    },
    button: {
    },
    text: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'white',
    },
  });