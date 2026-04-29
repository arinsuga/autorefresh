import { StyleSheet, Text, View } from "react-native";

export default function Historydetail() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={style.contain}>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}

const style = StyleSheet.create({
  contain: {
    fontWeight: "bold"
  }
});