
import { PhotoFile } from 'react-native-vision-camera';
import * as ImageManipulator from 'expo-image-manipulator';

export const compressPhotoFileToJPEG = async (photo: PhotoFile | undefined, widthValue: number = 1024, compressPercent: number = 0.5):
    Promise<ImageManipulator.ImageResult | null> => {

      // console.log('Inside compressPhotoFileToJPEG...');
      // console.log({ widthValue, compressPercent });
        
    try {

      // console.log('Inside compressPhotoFileToJPEG...');
      // console.log(`file://${photo?.path}`);

      const result = await ImageManipulator.manipulateAsync(
        `file://${photo?.path}`,
        [
          { resize: { width: widthValue } }
        ],
        {
          compress: compressPercent, format: ImageManipulator.SaveFormat.JPEG
        }
      );

      return result;

    } catch(e) {

      console.log(e);
      return null;

    }

}

const Compressutils = {

    photoFileToJPEG: compressPhotoFileToJPEG

}

export default Compressutils;