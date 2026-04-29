import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  RefreshControl,
} from "react-native";

//Packages
import { useRouter, Router } from "expo-router";
import { hideMessage } from 'react-native-flash-message';

//Components
import Logo from "@/components/Logo/Logo";
import Icon from "@/components/Icon/Icon";

//Services
import { getUsername } from "@/services/AuthService";
import { check } from '@/services/CheckpointService';

//Constants
import { Colors } from "@/constants/Colors";

export default function Home() {
    const [action, setAction] = useState<'checkin' | 'checkout' | ''>('');  
    const [isRefreshing, setRefreshing] = useState(false);

    const router: Router = useRouter();

    const getStyles = () => {

      const buttonContainerWidth = Dimensions.get('window').width;
      const buttonWidth = buttonContainerWidth*0.4;
      const buttonLeftPosition = (buttonContainerWidth - buttonWidth)/2;
      const styles = StyleSheet.create({

        checkButton: {
          flex: 1,
          flexDirection: 'row',
          position: "absolute",
          justifyContent: 'center',
          alignItems: 'center',
          width: buttonWidth,
          paddingVertical: 10,
          borderRadius: 10,
          bottom: 30,
          left: buttonLeftPosition,
          backgroundColor: Colors.orange,
        }

      });

      return styles
    }

    const fetchData = async () => {

      const userName = await getUsername();
      const checkResult = await check(userName as string)

      if (checkResult) {

        setAction(checkResult.action);

      }

    }

    useEffect(() => {

      fetchData();


    }, []);

    return (
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
        scrollEnabled={true}
        refreshControl={<RefreshControl refreshing={false} onRefresh={() => {
          setAction('');
          fetchData();
        }} colors={[Colors.orange]} />}
      >
              <View style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >

                  <Logo size="s" />
                  </View>
              </View>

              <TouchableOpacity
                  onPress={ async() => {
                    hideMessage();
                    router.push('/pinloc');
                  }} 
                  style={ getStyles().checkButton }
              >
                <Icon.Sync size={28} color={ Colors.white } />
                <Text style={{color: Colors.white, fontSize: 15, marginLeft: 10}}>
                  Check-in Check-out
                </Text>
              </TouchableOpacity>

      </ScrollView>
    );
}
