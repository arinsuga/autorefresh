
//Packages
import moment from 'moment';

//Interfaces
import ICheckpoint from '../interfaces/ICheckpoint';
import ICheckpointHistory from '@/interfaces/ICheckpointHistory';

//Providers
import CheckpointProvider from '@/providers/CheckpointProvider';

const compressPercent = 0.5;
const compressWidth = 400;
export const check = async (username: string): Promise<any> => {

  try {    

    const response = await CheckpointProvider.check(username);

    if (!response.data) return '';
  
    return response.data;

  } catch (error) {

    console.log(error);
    return error;

  }

};

export const checkin = async (checkinData: ICheckpoint): Promise<any> => {

  try {    

    const response = await CheckpointProvider.checkin(checkinData);

    return response;

  } catch (error) {

    console.log(error);  
    console.log('Checkin ERROR mas bro...');  

    return error;

  }

};

export const checkout = async (checkoutData: ICheckpoint): Promise<any> => {

  try {    

      const response = await CheckpointProvider.checkout(checkoutData);

      return response;

  } catch (error) {

    console.error(error);
    console.log('Checkin ERROR mas bro...');  

    return error;

  }

};

export const historyByUserIdCheckpointPeriod = async (
  userName: string,
  startdt: string,
  enddt: string,
  history_media: string,
): Promise<ICheckpointHistory[]> => {

  try {    

    const response = await CheckpointProvider.historyByUserIdCheckpointPeriod(userName, startdt, enddt, history_media);

    if (response.status == 200) {

      if (response.data.data.attend_list) {

        return Object.values(response.data.data.attend_list);

      }

    } else {

      return [];

    }

    
    return [];

  } catch (error) {

    console.error("Error fetching checkpoint history by period:", error);
    return [];

  }

};

export const historyByUserIdCheckpointDate = async (
  userName: string, checkpointDate: moment.Moment, history_media: string
):Promise<ICheckpointHistory[]> => {

  try {    

    const response = await CheckpointProvider.historyByUserIdCheckpointDate(userName, checkpointDate, history_media);
    if (response.status == 200) {

      if (response.data.data.attend_list) {

        return Object.values(response.data.data.attend_list);

      }

    } else {

      return [];

    }

    return [];

  } catch (error: any) {

    console.error("Error fetching checkpoint history:", error);
    return [];

  }

};
