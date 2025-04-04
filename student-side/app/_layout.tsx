import {AuthProvider} from '../src/AuthContext'
import HomeStack from "@/src/components/HomeStack";
import LoginPage from '@/src/components/LoginPage';

export default function RootLayout() {
  const IsLoggedIn = true;


  // if(IsLoggedIn){
  //   return (

    
  //     <Stack>
  //       <Stack.Screen name="(tabs)" options={{headerShown:false}} />
  //       <Stack.Screen name="+not-found" options={{title: "Page Not Found", headerBackButtonMenuEnabled:false, headerTitleAlign:"center"}}/>
  //     </Stack>
  //   );
  // }
  // else {
  //   return(
  //     <View>
  //       <Text>
  //         Hello
  //       </Text>
  //     </View>
  //   )
  // }
  return(
    <AuthProvider>
      <HomeStack></HomeStack>
    </AuthProvider>
  )

  
  
}
