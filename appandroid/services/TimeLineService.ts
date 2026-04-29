
//Packages
import { v4 as uuidv4 } from 'uuid';

//Interfaces
import ITimeLine from "@/interfaces/ITimeLine";
import ICheckpointHistory from "@/interfaces/ICheckpointHistory";

export const fillTimeLine = (timeLineList: ICheckpointHistory[]): ITimeLine[] => {
    let data: ITimeLine[] = [];

    if ((timeLineList) && (timeLineList.length > 0)) {
        timeLineList.map((item) => {
            data.push({ 
                id: uuidv4(),
                type: 'Checkin',
                date: item.checkin_date,
                time: item.checkin_time,
                datetime: item.checkin_datetime,
                latitude: item.checkin_latitude,
                longitude: item.checkin_longitude,
                milliseconds: item.checkin_milliseconds,
                title: item.checkin_title,
                subtitle: item.checkin_subtitle,
                address: item.checkin_address,
                description: item.checkin_description,
                image: item.checkin_image,
            });
    
            if (item.checkout_time) {

                data.push({
                    id: uuidv4(),
                    type: 'Checkout',
                    date: item.checkout_date,
                    time: item.checkout_time,
                    datetime: item.checkout_datetime,
                    latitude: item.checkout_latitude,
                    longitude: item.checkout_longitude,
                    milliseconds: item.checkout_milliseconds,
                    title: item.checkout_title,
                    subtitle: item.checkout_subtitle,
                    address: item.checkout_address,
                    description: item.checkout_description,
                    image: item.checkout_image,
                });

            }
    
        });

    }

    return data;
}

const TimeLineService = {

    fillTimeLine

};


export default TimeLineService;