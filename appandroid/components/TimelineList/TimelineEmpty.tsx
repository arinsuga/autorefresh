import { View, Text } from 'react-native'
import React from 'react'

interface ITimelineEmptyProps {
    isRefreshing?: boolean
    emptyText?: string
}

const TimelineEmpty = ({ isRefreshing = false, emptyText = 'No Data Found...' }: ITimelineEmptyProps) => {

  return (

        isRefreshing ? null :
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>{ emptyText }</Text>
        </View>
    )
}

export default TimelineEmpty