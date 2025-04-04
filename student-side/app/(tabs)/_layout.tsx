import { Tabs } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

export default function TabsLayout(){
    return(
        <Tabs
    screenOptions={{
      tabBarActiveTintColor: '#ffd33d',
      headerStyle: {
        backgroundColor: '#25292e',
      },
      headerShadowVisible: false,
      headerTintColor: '#fff',
      tabBarStyle: {
      backgroundColor: '#000000',
      height: 100
      },
    }}>
      <Tabs.Screen name='index' options={{title : "Home", tabBarLabel: "", tabBarIcon: ({color, focused})=>(
       <Ionicons name={focused ? "home-sharp" :"home-outline"} color={color} size={24} /> 
      )}}/>
      <Tabs.Screen name='history' options={{title : "Active Orders",tabBarLabel: "", tabBarIcon: ({color, focused})=>(
       <Ionicons name={focused ? "time" :"time-outline"} color={color} size={24} /> 
      )}}/>
      <Tabs.Screen name='profile' options={{title : "Profile", tabBarLabel:"", tabBarIcon: ({color, focused})=>(
       <Ionicons name={focused ? "person" :"person-outline"} color={color} size={24} /> 
      )}}/>
    </Tabs>
     )
}