import React, { useState, useCallback } from "react";

//Packages
import { useNavigationState } from "@react-navigation/native";
import { useRouter, Tabs, Stack } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';

//Contexts
import { useAuth } from "@/contexts/Authcontext";

//Constants
import { Colors } from "@/constants/Colors";

//Components
import Icon from "@/components/Icon/Icon";

export default function AppLayout() {
  const { Authenticate } = useAuth();

  const router = useRouter();

  const activeTabName = useNavigationState((state) => {

    const tabName = state.routes[state.index].name;

    //Check Authentication
    Authenticate  && Authenticate();

    return tabName;
  });

  

  return (

    <Stack>

        <Stack.Screen name="index" options={{
          headerShown: false,
        }} />
    </Stack>

  )
}
