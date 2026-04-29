export default interface ICheckpointHistory {
    id: string;
    user_id: string;
    name: string;
    attend_dt: string;

    checkin_latitude: string;
    checkin_longitude: string;
    checkin_milliseconds: string;
    checkin_datetime: string;
    checkin_date: string;
    checkin_time: string;
    checkin_title: string;
    checkin_subtitle: string;
    checkin_address: string;
    checkin_description: string;
    checkin_image: string;
    checkin_client: string;

    checkout_latitude: string;
    checkout_longitude: string;
    checkout_milliseconds: string;
    checkout_datetime: string;
    checkout_date: string;
    checkout_time: string;
    checkout_title: string;
    checkout_subtitle: string;
    checkout_address: string;
    checkout_description: string;
    checkout_image: string;
    checkout_client: string;

    time_elapse: string;

}
