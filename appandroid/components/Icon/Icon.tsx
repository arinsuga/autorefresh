import React from 'react';
import {
    FontAwesome,
    Ionicons,
    MaterialIcons,
    Foundation,
    AntDesign,
    Fontisto,
    Entypo, 
} from '@expo/vector-icons';



import { Text, StyleProp, ViewStyle } from 'react-native';
import { Colors } from '@/constants/Colors';


const defaultSize = 32;
const defaultColor = Colors.orange;


interface IconProps {
    size?: number;
    color?: string;
    style?: StyleProp<ViewStyle>;
}

export const IconHome = ({size = defaultSize, color = defaultColor, style}: IconProps) => {
    return <Ionicons name="home" size={size} color={color} style={style} />;
}

export const IconHistory = ({size = defaultSize, color = defaultColor, style}: IconProps) => {
    return <MaterialIcons name="history" size={size} color={color} style={style} />;
}

export const IconLocation = ({size = defaultSize, color = defaultColor, style}: IconProps) => {
    return <Ionicons name="location-sharp" size={size} color={color} style={style} />;
}

export const IconPower = ({size = defaultSize, color = defaultColor, style}: IconProps) => {
    return <Ionicons name="power" size={size} color={color} style={style} />;
}

export const IconCamera = ({size = defaultSize, color = defaultColor, style}: IconProps) => {
    return <Ionicons name="camera" size={size} color={color} style={style} />;
}

export const IconCameraRotate = ({size = defaultSize, color=defaultColor, style}: IconProps) => {
    return <Ionicons name="camera-reverse" size={size} color={color} style={style} />
}

export const IconCapture = ({size = defaultSize, color=defaultColor, style}: IconProps) => {
    return <Foundation name="record" size={size} color={color} style={style} />
}

export const IconDashboard = ({size = defaultSize, color=defaultColor, style}: IconProps) => {
    return <FontAwesome name="dashboard" size={size} color={color} style={style} />
}

export const IconDetail = ({size = defaultSize, color=defaultColor, style}: IconProps) => {
    return <AntDesign name="bars" size={size} color={color} style={style} />
}

export const IconSearch = ({size = defaultSize, color=defaultColor, style}: IconProps) => {
    return <Ionicons name="search" size={size} color={color} style={style} />
}

export const IconImage = ({size = defaultSize, color=defaultColor, style}: IconProps) => {
    return <Ionicons name="image-outline" size={size} color={color} style={style} />
}

export const IconUser = ({size = defaultSize, color=defaultColor, style}: IconProps) => {
    return <FontAwesome name="user" size={size} color={color} style={style} />
}

export const IconKey = ({size = defaultSize, color=defaultColor, style}: IconProps) => {
    return <Ionicons name="key" size={size} color={color} style={style} />
}

export const IconDateRange = ({size = defaultSize, color=defaultColor, style}: IconProps) => {
    return <MaterialIcons name="date-range" size={size} color={color} style={style} />
}

export const IconDate = ({ size = defaultSize, color = defaultColor, style }: IconProps) => {
    return <Fontisto name="date" size={size} color={color} style={style} />
}

export const IconTime = ({ size = defaultSize, color = defaultColor, style }: IconProps) => {
    return <Ionicons name="time-outline" size={size} color={color} style={style} />
}

export const IconCheckin = ({ size = defaultSize, color = defaultColor, style }: IconProps) => {
    return <MaterialIcons name="file-download" size={size} color={color} style={style} />
}

export const IconCheckout = ({ size = defaultSize, color = defaultColor, style }: IconProps) => {
    return <MaterialIcons name="file-upload" size={size} color={color} style={style} />
}

export const IconNote = ({ size = defaultSize, color = defaultColor, style }: IconProps) => {
    return <MaterialIcons name="notes" size={size} color={color} style={style} />
}

export const IconArrowUp = ({ size = defaultSize, color = defaultColor, style }: IconProps) => {
    return <MaterialIcons name="keyboard-arrow-up" size={size} color={color} style={style} />
}

export const IconArrowDown = ({ size = defaultSize, color = defaultColor, style }: IconProps) => {
    return <MaterialIcons name="keyboard-arrow-down" size={size} color={color} style={style} />
}

export const IconArrowRight = ({ size = defaultSize, color = defaultColor, style }: IconProps) => {
    return <MaterialIcons name="keyboard-arrow-right" size={size} color={color} style={style} />
}

export const IconArrowLeft = ({ size = defaultSize, color = defaultColor, style }: IconProps) => {
    return <MaterialIcons name="keyboard-arrow-left" size={size} color={color} style={style} />
}

export const IconSync = ({ size = defaultSize, color = defaultColor, style }: IconProps) => {
    return <AntDesign name="sync" size={size} color={color} style={style} />
}

export const IconPDF = ({ size = defaultSize, color = defaultColor, style }: IconProps) => {
    return <MaterialIcons name="picture-as-pdf" size={size} color={color} style={style} />
}

export const IconShare = ({size = defaultSize, color=defaultColor, style}: IconProps) => {
    return <FontAwesome name="share" size={size} color={color} style={style} />
}

export const IconUpdateLocation = ({size = defaultSize, color=defaultColor, style}: IconProps) => {
    return <MaterialIcons name="edit-location" size={size} color={color} style={style} />
}

export const IconEye = ({ size = defaultSize, color = defaultColor, style }: IconProps) => {
    return <Ionicons name="eye" size={size} color={color} style={style} />
}

export const IconEyeOff = ({ size = defaultSize, color = defaultColor, style }: IconProps) => {
    return <Ionicons name="eye-off" size={size} color={color} style={style} />
}


const Icon = {
    Home: IconHome,
    History: IconHistory,
    Location: IconLocation,
    Power: IconPower,
    Camera: IconCamera,
    CameraRotate: IconCameraRotate,
    Capture: IconCapture,
    Dashboard: IconDashboard,
    Detail: IconDetail,
    Search: IconSearch,
    Image: IconImage,
    User: IconUser,
    Key: IconKey,
    DateRange: IconDateRange,
    Date: IconDate,
    Time: IconTime,
    Checkin: IconCheckin,
    Checkout: IconCheckout,
    Note: IconNote,
    ArrowUp: IconArrowUp,
    ArrowDown: IconArrowDown,
    ArrowRight: IconArrowRight,
    ArrowLeft: IconArrowLeft,
    Sync: IconSync,
    PDF: IconPDF,
    Share: IconShare,
    UpdateLocation: IconUpdateLocation,
    Eye: IconEye,
    EyeOff: IconEyeOff
}

export default Icon