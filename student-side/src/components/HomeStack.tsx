import { Stack } from "expo-router";


export default function HomeStack() {
    return (
      <Stack>
        <Stack.Screen name="(tabs)" options={{headerShown:false}} />
        <Stack.Screen name="+not-found" options={{title: "Page Not Found", headerBackButtonMenuEnabled:false, headerTitleAlign:"center"}}/>
      </Stack>
    );
}