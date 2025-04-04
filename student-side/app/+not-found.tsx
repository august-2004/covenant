import {View } from "react-native";
import { Link } from "expo-router";
export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
     <Link href='/' style={{textDecorationLine: "underline"}}>Go Back To Home Screen</Link> 
    </View>
  );
}
