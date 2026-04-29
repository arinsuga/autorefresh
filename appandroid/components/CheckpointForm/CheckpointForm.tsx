
import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    Image,
    Platform,
    Dimensions,
    StatusBar,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';

//Packages
import moment from 'moment';
import * as localization from 'expo-localization';
import * as momentTZ from 'moment-timezone';
import { useRouter } from 'expo-router';
import {PhotoFile} from 'react-native-vision-camera';
import * as Location from 'expo-location';
import { showMessage, MessageOptions } from 'react-native-flash-message';

//Components
import FieldMultilineTextInput from '../FieldMultilineTextInput/FieldMultilineTextInput';
import WaitingIndicator from '@/components/WaitingIndicator/WaitingIndicator';

//Constants
import { Colors } from '@/constants/Colors';

//Interfaces
import ICheckpoint from '@/interfaces/ICheckpoint';

//Services
import { checkin, checkout } from '@/services/CheckpointService';
import { timeout } from 'rxjs';

interface IChekPointFormProps {
  action: 'checkin' | 'checkout'; 
  actionButton: 'Checkin' | 'Checkout' | '';
  file?: PhotoFile | undefined;
  attendId?: string;
}

const CheckpointForm = ({action, actionButton, file, attendId}: IChekPointFormProps) => {
    const [isWaiting, setIsWaiting] = useState(false);
    const [displaycamera, setDisplaycamera] = useState(true);
    const [checkpoint, setCheckpoint] = useState<ICheckpoint>({
      file: file,
      checkType: action,
      attend_id: attendId,
      latitude: '',
      longitude: '',
      utc_tz: '',
      utc_millis: '',
      utc_offset: '',
      title: '',
      subtitle: '',
      description: '',
      client: Platform.OS === 'android' ? 'android' : 'ios',
    });

    const uri = `file://${file?.path}`;
    const localInputRef = useRef<TextInput>(null);



useEffect(() => {

  (async () => {

    const currentPosition = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest});
    setCheckpoint({
      ...checkpoint,
      latitude: currentPosition.coords.latitude.toString(),
      longitude: currentPosition.coords.longitude.toString()
    });

  })();

  const timeout = setTimeout(() => localInputRef.current?.focus(), 100);

  return () => clearTimeout(timeout);

}, []);

      let messageOptionSuccess: MessageOptions = {
          message: '',
          description: '',
          type: 'success',
          duration: 5,
          floating: true,
          icon: 'success',
          backgroundColor: Colors.success,
          color: Colors.white,
      };
      let messageOptionDanger: MessageOptions = {
          message: '',
          description: '',
          type: 'danger',
          duration: 5000,
          floating: true,
          icon: 'success',
          backgroundColor: Colors.danger,
          color: Colors.white,
      };
      let messageOptionFailed: MessageOptions = {
          message: '',
          description: '',
          type: 'default',
          duration: 1500,
          floating: true,
          icon: 'danger',
          backgroundColor: Colors.grey,
          color: Colors.white,
      };
      let messageOption: MessageOptions = { ...messageOptionSuccess };

    const router = useRouter();

    const handleFocus = () => localInputRef.current?.focus();

    const hideCaptured = () => setDisplaycamera(false);

    //#TODO
    const showCaptured = () => setDisplaycamera(true);

    const handleSave = useCallback(async (checkpointData: ICheckpoint) => {

        let result = null;
        try {

          setIsWaiting(true);

          const checkpointCurrentData = {...checkpointData};

          const now = moment();
          checkpointCurrentData.utc_tz = localization.getCalendars()[0].timeZone as string;
          checkpointCurrentData.utc_millis = now.utc().valueOf().toString();
          checkpointCurrentData.utc_offset = (momentTZ.tz( checkpointCurrentData.utc_tz ).utcOffset() / 60).toString(); 

          if (checkpointData.checkType == 'checkin') {
        
              result = await checkin(checkpointCurrentData);

              messageOption = {
                ...messageOptionSuccess,
                message: 'CHECKIN',
                description: 'Checkin berhasil...',
              }

          } else if (checkpointData.checkType == 'checkout') {

              result = await checkout(checkpointCurrentData);

              messageOption = {
                ...messageOptionDanger,
                message: 'CHECKOUT',
                description: 'Checkout berhasil...',
              }

          } else {

              messageOption = {
                ...messageOptionFailed,
                description: 'Data gagal tersimpan...',
              };

          }
          
          if (result.status == 500) {

              messageOption = {
                ...messageOptionFailed,
                message: `ERROR: ${result.status}`,
                description: result.data.message,
              };
            
          }

          showMessage(messageOption);


          return true;
  
        } catch (error) {

            messageOption = {
              ...messageOptionFailed,
              description: 'Data gagal tersimpan...',
            };
            showMessage(messageOption);
            return true;

        }
    }, []);

  return (
        <View style={{
          flex: 1,
          justifyContent: 'flex-start',
          alignItems: 'center',
          paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, 
        }}>
            <Image
              source={{ uri: uri }}
              style={{
                width: Dimensions.get('window').width,
                height: displaycamera ? Dimensions.get('window').height/2.5 : 0,
                marginBottom: 50,
              }}
            />

            <FieldMultilineTextInput
              placeholder='Description'
              onFocus={hideCaptured}
              onChangeText={(nextText) => setCheckpoint({ ...checkpoint, description: nextText })}
              inputRef={ localInputRef }
              style={{
                width: Dimensions.get('window').width-50,
              }}
            />

            {

              checkpoint.checkType == 'checkin' || checkpoint.checkType == 'checkout' ?
              <TouchableOpacity
                  onPress={ async() => {
                    const success = await handleSave(checkpoint);
                    if (success) router.replace('/')
                  }}
                  style={[styles.checkButton, {
                    backgroundColor: checkpoint.checkType == 'checkin' ? Colors.success : action == 'checkout' ? Colors.danger : Colors.grey,
                  }]}
              >
                <Text style={{color: Colors.white}}>
                  { checkpoint.checkType == 'checkin' ? 'Save Checkin' : 'Save Checkout' }
                </Text>
              </TouchableOpacity> :
              <View
                  style={[
                    styles.checkButton,
                    {
                      paddingTop: 5,
                      paddingBottom: 5,
                    }
                  ]}
              >
                <ActivityIndicator  size={30} color={ Colors.white } />
              </View>

            }

            <WaitingIndicator isWaiting={isWaiting} />

        </View>
  )
}

export default CheckpointForm

const styles = StyleSheet.create({
  checkButton: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    width: Dimensions.get('window').width-100,
  }
});