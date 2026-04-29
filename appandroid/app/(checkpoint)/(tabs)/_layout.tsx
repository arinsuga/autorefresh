import React, { useState, useCallback } from "react";

//Packages
import { useNavigationState } from "@react-navigation/native";
import { useRouter, Tabs } from "expo-router";
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

    <Tabs
        screenOptions={{
          headerShown: false,
          title: "",
          headerStyle: {
            backgroundColor: Colors.orange,
          },
          headerLeft: () => (router.canGoBack() ?
            <Ionicons
            name="arrow-back"
            size={24}
            color={ Colors.orange }
            onPress={() => router.canGoBack() && router.back()}
            /> :
            <></>),
            tabBarActiveTintColor: Colors.orange,
            tabBarInactiveTintColor: Colors.grey,
            tabBarStyle: {
              height: 55,
              paddingTop: 10,
            },
            tabBarIconStyle: {
              zIndex: 99,
            },
          }}
    >
      
          <Tabs.Screen name="index"
            options={{
            tabBarIcon: ({focused, color, size}) => <Icon.Home color={color} size={size} />,
          }} />
          <Tabs.Screen name="tabpinloc"
                      options={{
                        href: null,
                        tabBarIcon: ({focused, color, size}) => <Icon.Camera color={color} size={size} />
                      }}
                      listeners={() => ({
                        tabPress: (e) => {
                          e.preventDefault();
                          router.push('/pinloc');
                        }
                      })}
          />
          <Tabs.Screen name="history" options={{
            tabBarIcon: ({focused, color, size}) => <Icon.History color={color} size={size} />
          }} />

          <Tabs.Screen name="dashboard" options={{
            href: null,
            tabBarIcon: ({focused, color, size}) => <Icon.Dashboard size={size} color={color} />
          }} />
          <Tabs.Screen name="historydetail" options={{
            href: null,
            tabBarIcon: ({focused, color, size}) => <Icon.Detail size={size} color={color} />
          }} />
          <Tabs.Screen name="historysearch" options={{
            href: null,
            tabBarIcon: ({focused, color, size}) => <Icon.Search size={size} color={color} />
          }} />

    </Tabs>
  )
}
