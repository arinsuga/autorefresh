import { Image, StyleSheet } from 'react-native'
import React from 'react'


type propType = {
    size: string,
}

type typeSize = {
    width?: number,
    height?: number,

};

const LogoIcon = ({ size }: propType) => {

    return (

        <Image
        style={ styles[size] }
        source={require('../../assets/images/logo_icon.png')}
        />

    )
}

const styles: { [key: string]: typeSize } = StyleSheet.create({

    xs: {
        width: 50,
        height: 50,
    },
    s: {
        width: 100,
        height: 100,
    },
    m: {
        width: 300,
        height: 300,
    },
    l: {
        width: 600,
        height: 600,
    },
    xl: {
        width: 700,
        height: 700,
    },
});



export default LogoIcon