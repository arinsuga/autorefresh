import React, { useEffect } from 'react'
import { Text, View } from 'react-native'
import { CameraPermissionStatus } from 'react-native-vision-camera';
import { PermissionStatus } from 'expo-location';
import WaitingIndicator from '../WaitingIndicator/WaitingIndicator';

interface IRequestPermissionProps {
  isWaiting: boolean;
  permissions: { allowLocation: PermissionStatus, allowCamera: CameraPermissionStatus;  };
  askPermission: () => Promise<void>;
}
const RequestPermission = ({ isWaiting, permissions, askPermission }: IRequestPermissionProps) => {

  // CameraPermissionStatus = "granted" | "not-determined" | "denied" | "restricted"
  // LocationPermissionStatus = GRANTED = 'granted' | UNDETERMINED = 'undetermined' | DENIED = 'denied'
  

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    }}>

      {
          (permissions.allowCamera === 'not-determined' || permissions.allowLocation === 'undetermined') ?
          <WaitingIndicator isWaiting={isWaiting} /> :

          <Text>
            {permissions.allowCamera === 'denied' ? 'Camera' : ''}
            { (permissions.allowCamera === 'denied' && permissions.allowLocation === 'denied') ? ' and ' : '' }
            {permissions.allowLocation === 'denied' ? 'Location' : ''} Permission Denied
          </Text>
      }
      
    </View>
  );
}

export default RequestPermission
