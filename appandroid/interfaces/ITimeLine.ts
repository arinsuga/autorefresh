export default interface ITimeLine {
    id: string;
    type: 'Checkin' | 'Checkout';
    date: string;
    time: string;
    datetime: string;
    latitude: string;
    longitude: string;
    milliseconds: string;
    title: string;
    subtitle: string;
    address: string;
    description: string;
    image: string;
    client: string;
}
