
import { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  Dimensions,
  Keyboard,
} from "react-native";

import Styles from "@/constants/Styles";
import { Colors } from "../constants/Colors";
import LogoIcon from "@/components/LogoIcon/LogoIcon";
import Logo from "@/components/Logo/Logo";
import { useAuth } from "@/contexts/Authcontext";

//Interface
import IAuth from "@/interfaces/IAuth";

import FieldUserName from "@/components/FieldUserName/FieldUserName";
import FieldPassword from "@/components/FieldPassword/FieldPassword";
import WaitingIndicator from "@/components/WaitingIndicator/WaitingIndicator";
import BranchSelector from "@/components/BranchSelector";
import { IBranch } from "@/interfaces/IBranch";

import { useRouter } from "expo-router";
import Roles from "@/constants/Roles";

export default function Login() {
    const { authState, Login: handleLogin, SetBranch } = useAuth();
    const router = useRouter();
    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ selectedBranch, setSelectedBranch ] = useState<IBranch | null>(null);
    const [ isWaiting, setIsWaiting ] = useState(false);
    const [ displayLogo, setDisplayLogo ] = useState(true);
    const [ step, setStep ] = useState(1); // 1: Credentials, 2: Branch Selection
  

    const onLogin = async (username: string, password: string) => {
      
      setIsWaiting(true);
      const auth = await (handleLogin && handleLogin(username, password));
      setIsWaiting(false);
      
      if (auth) {
        const roles = auth.user?.roles || [];
        const isSuperOrMaster = roles.some(r => r.code === Roles.super || r.code === Roles.master);
        
        if (isSuperOrMaster) {
          router.replace('/');
        } else {
          setStep(2);
        }
      } else {
        alert('Invalid username or password');
      }

    }

    const onBranchSelect = (branch: IBranch) => {
      setSelectedBranch(branch);
    }

    const handleContinue = () => {
      if (selectedBranch && SetBranch) {
        SetBranch(selectedBranch);
        router.replace('/');
      } else {
        alert('Please select a branch');
      }
    }

    const usernamedOnChange = (nextText: string) => {

      setUsername(nextText);

    }

    const passwordOnChange = (nextText: string) => {

      setPassword(nextText);

    }


    useEffect(() => {

        const keyboardShowListener = Keyboard.addListener("keyboardDidShow", () => {
          setDisplayLogo(false);
        });
        const keyboardHideListener = Keyboard.addListener("keyboardDidHide", () => {
          setDisplayLogo(true);
        }); 

        return () => {
          keyboardShowListener.remove();
          keyboardHideListener.remove();
        }


    }, []);

    return (

      (authState?.authenticated === undefined) ?
      <SafeAreaView style={ [ Styles.activityContainer, { backgroundColor: Colors.whiteLight } ] }>
        <WaitingIndicator isWaiting={true} />
      </SafeAreaView> :
      <SafeAreaView style={ [ Styles.loginContainer, { backgroundColor: Colors.whiteLight } ] } >

        <StatusBar barStyle={ "dark-content" }  />
        <View style={{
          flex: 1,
          alignItems: "center",
          position: 'absolute',
          top: 100,
          alignSelf: "center",
          width: '100%'
        }}>
          { displayLogo ? <Logo size="s" /> : null }
        </View> 

        <View style={{
          display: authState?.firstLogin ? 'none' : 'flex',
          flex: 1,
          alignItems: "center",
          position: 'absolute',
          top: (Dimensions.get('screen').height - 100) / 2,
          alignSelf: "center",
          width: '100%'
        }}>
          <Text> Autentikasi berakhir </Text>
          <Text> Silahkan login kembali </Text>
        </View>

        <View style={ Styles.container }>

          { step === 1 ? (
            <>
              <FieldUserName onChangeText={ usernamedOnChange } />
              <FieldPassword onChangeText={ passwordOnChange } />

              <View>
                <TouchableOpacity
                    style={ [Styles.btn, Styles.btnLogin] }
                    onPress={ () => onLogin(username, password) }
                >
                  <Text style={ Styles.btnText }>Login</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={{ width: '100%', paddingHorizontal: 20 }}>
              <Text style={{ 
                fontSize: 20, 
                fontWeight: 'bold', 
                color: Colors.bgOrange, 
                textAlign: 'center',
                marginBottom: 20 
              }}>
                Pilih Cabang
              </Text>
              <BranchSelector 
                onSelect={onBranchSelect} 
                selectedBranch={selectedBranch} 
              />

              <View style={{ marginTop: 20 }}>
                <TouchableOpacity
                    style={ [Styles.btn, Styles.btnLogin] }
                    onPress={ handleContinue }
                >
                  <Text style={ Styles.btnText }>Lanjut ke Dashboard</Text>
                </TouchableOpacity>
              </View>

              <Text style={{ 
                textAlign: 'center', 
                color: Colors.grey, 
                marginTop: 20 
              }}>
                Silahkan pilih cabang untuk lanjut ke dashboard
              </Text>
            </View>
          )}
        </View>

        <WaitingIndicator isWaiting={isWaiting} />

      </SafeAreaView>
    );

}

