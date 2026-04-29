import { Image, StyleSheet } from 'react-native'
import React from 'react'


type propType = {
    size: string,
}

type typeSize = {
    width?: number,
    height?: number,

};

const Logo = ({ size }: propType) => {

    return (

        <Image
        style={ styles[size] }
        source={require('../../assets/images/logo.png')}
        />

    )
}

const styles: { [key: string]: typeSize } = StyleSheet.create({

    xs: {
        width: 50,
        height: 50,
    },
    s: {
        width: 150,
        height: 150,
    },
    m: {
        width: 200,
        height: 200,
    },
    l: {
        width: 250,
        height: 250,
    },
    xl: {
        width: 300,
        height: 300,
    },
});



export default Logo