import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

//Contexts
import { useAuth } from "@/contexts/Authcontext";

//Constants
import Styles from "@/constants/Styles";

const Relogin = ({ display = false, message = 'You are not authorized!!' }:
                 { display: boolean, message?: string}) => {

    const { Logout } = useAuth();

    return (
        <View style={ {
                    alignItems: 'center',
                    display: display ? 'flex' : 'none'
        } }>

            <Text>{ message }</Text>
            <TouchableOpacity style={[ Styles.btn, Styles.btnLogin ]} onPress={() => Logout && Logout()}>

                <Text style={ Styles.btnText }>Re-Login</Text>

            </TouchableOpacity>
            
        </View>
    );
}

export default Relogin;
