import {
  useState,
  useEffect,
  useCallback,
} from 'react';
import { SafeAreaView } from 'react-native';
import { Camera } from 'react-native-vision-camera';
import * as Location from 'expo-location';

import RequestPermission from '@/components/RequestPermission/RequestPermission';
import TakePhoto from '@/components/TakePhoto/TakePhoto';

export default function Pinloc() {
  const [allowCamera, setAllowCamera] = useState(Camera.getCameraPermissionStatus());
  const [allowLocation, setAllowLocation] = useState<Location.PermissionStatus>(Location.PermissionStatus.UNDETERMINED);
  const [isWaiting, setIsWaiting] = useState(true);

  //Request Camera and Location
  const handleAllPermission = useCallback(async () => {
    
    // const LocationPermissionStatus = await Camera.requestLocationPermission();
    const {status} = await Location.requestForegroundPermissionsAsync();
    const cameraPermissionStatus = await Camera.requestCameraPermission();

    setAllowLocation(status);
    setAllowCamera(cameraPermissionStatus);
    setIsWaiting(false);

  }, []);

  useEffect(() => {

    handleAllPermission();

  }, []);

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>

      {

        (allowLocation === Location.PermissionStatus.GRANTED) && (allowCamera === 'granted') ?

        <TakePhoto /> : <RequestPermission isWaiting={isWaiting} permissions={{allowLocation, allowCamera}} askPermission={handleAllPermission} />

      }

    </SafeAreaView>
  );

}
