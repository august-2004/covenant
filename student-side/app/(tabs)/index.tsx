import { Text, View, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import OrderManager from "@/src/components/OrderManager";
export default function Index() {
	return (
		<SafeAreaView>
			<ScrollView>
				<OrderManager />
			</ScrollView>
		</SafeAreaView>
	);
}
