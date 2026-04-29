import React, { useEffect } from "react";
import { Text, View } from "react-native";

import { Link } from "expo-router";

export default function Historydetail() {

    React.useEffect(() => {
        
        console.log('Historydetail');

    });

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>HISTORY DETAILS</Text>

    </View>
  );
}

