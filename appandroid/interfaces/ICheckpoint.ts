import {PhotoFile} from 'react-native-vision-camera';

export default interface ICheckpoint {
    file?: PhotoFile | undefined;
    checkType: 'checkin' | 'checkout';
    attend_id?: string;
    latitude?: string;
    longitude?: string;
    utc_tz?: string;
    utc_millis?: string;
    utc_offset?: string;
    imageTemp?: string;
    title?: string;
    subtitle?: string;
    description?: string;
    client?: string;
}
