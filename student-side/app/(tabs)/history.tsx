import QRCode from "react-native-qrcode-svg";
import { View, Text, StyleSheet, SafeAreaView} from "react-native";
import OrderHistory from '../../src/components/OrderHistory'

export default function History(){

const value = "Hello"
    return(
        <SafeAreaView style={styles.container}>
            <OrderHistory/>
            
        </SafeAreaView>
        
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
    }
})