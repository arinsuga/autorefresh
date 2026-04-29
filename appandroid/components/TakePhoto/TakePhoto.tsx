
//packages
import React, { useState, useRef, useEffect, } from 'react';
import { View, } from 'react-native';
import { Camera, useCameraDevice, PhotoFile, CameraDevice, } from 'react-native-vision-camera';

//components
import CheckpointForm from '@/components/CheckpointForm/CheckpointForm';
import CheckpointCamera from '@/components/CheckpointCamera/CheckpointCamera';

//services
import { check } from '@/services/CheckpointService';
import { getUsername } from '@/services/AuthService';

const TakePhoto = () => {
    const [isCaptureWaiting, setIsCaptureWaiting] = useState(false);
    const [showCamera, setShowCamera] = useState(true);


    const [action, setAction] = useState<'checkin' | 'checkout'>('checkin');  
    const [actionButton, setActionButton] = useState<'Checkin' | 'Checkout' | ''>('');
    const [attendId, setAttendId] = useState<string>('');
    const [cameraPosition, setCameraPosition] = useState<'front' | 'back'>('front');
    const [photo, setPhoto] = useState<PhotoFile | undefined>(undefined);

    const cameraRef = useRef<Camera>(null);
    const phoneDevice = useCameraDevice(cameraPosition);
    const cameraDevice = phoneDevice as CameraDevice;

    const cameraInfo = {
      cameraRef: cameraRef,
      photo: true,
      device: cameraDevice,
      isActive: true,
      enableLocation: true,
    }

    useEffect(() => {
        const fetchData = async () => {

            try {

              const username = await getUsername();
              const checkResult = await check(username as string); 

              if (checkResult) {

                setAction(checkResult.action);
                setActionButton(checkResult.action_button);
                setAttendId(checkResult.user.attend_id);

              }

            } catch (error) {

              console.error(error);

            }


        }
        fetchData();

    }, [actionButton]);

    const capturePhoto = async () => {
        
        try {

          setIsCaptureWaiting(true);
          const photoResult = await cameraRef.current?.takePhoto({
            enableShutterSound: false,
          });
          setPhoto(photoResult);
          setShowCamera(false);
          setIsCaptureWaiting(false);

        } catch(e) {

          console.error(e);

        }

    }

    const abortCapturePhoto = async () => {

      console.log('TODO : Abort photo capture');
      setIsCaptureWaiting(true);
      setShowCamera(false);
      setIsCaptureWaiting(false);

    }
    
    const toggleCameraFacing = () => {

      setCameraPosition(current => current ==='front' ? 'back' : 'front');

    }

    const viewCapturedImage = () => {

      alert('TODO : Image Viewer');

    }

    return (

          showCamera ? 
          <View style={{ flex: 1, justifyContent: 'center' }}>

            <CheckpointCamera
              viewCapturedImage={viewCapturedImage}
              capturePhoto={capturePhoto}
              abortCapturePhoto={abortCapturePhoto}
              toggleCameraFacing={toggleCameraFacing}
              cameraInfo={cameraInfo}
              isWaiting={isCaptureWaiting}
            />

          </View> :
          <CheckpointForm
          action={action}
          actionButton={actionButton}
          file={photo}
          attendId={attendId}
          />

    )
}

export default TakePhoto
