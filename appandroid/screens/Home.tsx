import { useFocusEffect, useRouter } from "expo-router";
import { Text, View } from "react-native";
import { useAuth } from "@/contexts/Authcontext";

export default function Home() {

  const { authState } = useAuth();
  const router = useRouter()

  // useFocusEffect(() => {


  //   if (!authState?.authenticated) {
  //     // router.replace('/login');
  //   } else {

  //     console.log('=============');
  //     console.log('INDEX');
  //     console.log('=============');
  //     console.log('current');
  //     console.log(authState);
  //     console.log('=============');
  
  //   }

   
  // });

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.XXXX</Text>
    </View>
  );
}
