//systems
import React, { MutableRefObject, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
//packages
import { Camera, CameraDevice } from 'react-native-vision-camera';
//components
import Icon from '@/components/Icon/Icon';
//constants
import { Colors } from '@/constants/Colors';
import Styles from '@/constants/Styles';
import WaitingIndicator from '../WaitingIndicator/WaitingIndicator';

interface ICameraInfoProps {

  cameraRef: MutableRefObject<Camera | null>;
  photo: boolean;
  device: CameraDevice;
  isActive: boolean;
  enableLocation: boolean;
}

interface CheckpointCameraProps {

  viewCapturedImage: () => void;
  capturePhoto: () => Promise<void>;
  abortCapturePhoto: () => void;
  toggleCameraFacing: () => void;
  cameraInfo: ICameraInfoProps
  isWaiting: boolean;

}

const CheckpointCamera = (props: CheckpointCameraProps) => {

  return (

        <>
            <Camera
                style={{ flex: 1 }}
                ref={props.cameraInfo.cameraRef}
                photo={props.cameraInfo.photo}
                device={props.cameraInfo.device}
                isActive={props.cameraInfo.isActive}
                enableLocation={props.cameraInfo.enableLocation}
                photoQualityBalance='speed'
            />


            <View style={Styles.buttonCameraContainer}>

                <TouchableOpacity onPress={props.capturePhoto}>
                  <Icon.Capture color={Colors.whiteDark} size={98} />
                </TouchableOpacity>

            </View>

            <View style={[Styles.buttonCameraContainer, { justifyContent: 'space-between', paddingLeft: 50, paddingRight: 50 }]}>

                <TouchableOpacity onPress={props.abortCapturePhoto}>
                  <Text style={[ Styles.btnText, { color: Colors.red }]}>Skip</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={props.toggleCameraFacing}>
                  <Icon.CameraRotate color={Colors.whiteDark} />
                </TouchableOpacity>

            </View>

            <WaitingIndicator isWaiting={props.isWaiting} />

        </>
    
  )
}

export default CheckpointCamera

