import { useCallback, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import QRCode from "react-native-qrcode-svg";
import {
	Text,
	View,
	FlatList,
	StyleSheet,
	Pressable,
	Modal,
	RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

function OrderHistory(props) {
	const [orders, setOrders] = useState([]);
	const { decrementOrderCount } = props;
	const [refreshing, setRefreshing] = useState(false);

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		await fetchOrders();
		setRefreshing(false);
	}, []);

	const fetchOrders = async () => {
		const jwtToken = await SecureStore.getItemAsync("jwtToken");
		if (jwtToken) {
			try {
				const response = await fetch(`http://192.168.99.127:3000/orders/user`, {
					method: "GET",
					headers: {
						Authorization: jwtToken,
					},
				});
				const fetchedOrders = await response.json();
				setOrders(fetchedOrders.reverse());
			} catch (err) {
				console.error(err);
			}
		} else {
			setOrders([]);
			alert("Try logging in again");
		}
	};
	useEffect(() => {
		fetchOrders();
	}, []);

	const [selectedQr, setSelectedQr] = useState("");
	const [qrCardVisibility, setQrCardVisibility] = useState(false);

	const onPressEventHandler = (item) => {
		setSelectedQr(item._id);
		setQrCardVisibility(true);
	};
	return (
		<View>
			{Array.isArray(orders) && orders.length > 0 ? (
				<FlatList
					refreshControl={
						<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
					}
					data={orders}
					keyExtractor={(order) => order._id}
					renderItem={({ item }) => (
						<Pressable
							style={styles.order}
							onPress={() => onPressEventHandler(item)}
						>
							<View style={styles.qr}>
								<QRCode size={120} value={item._id} />
							</View>
							<View style={styles.info}>
								<Text>User ID: {item.userID}</Text>
								<Text>Item Name: {item.itemName}</Text>
								<Text>Mealtime: {item.mealTime}</Text>
								<Text>Quantity: {item.quantity}</Text>
								<Text>Created At: {item.createdAt}</Text>
								<Text>Date: {item.date}</Text>
							</View>
						</Pressable>
					)}
				/>
			) : (
				<View style={styles.noOrder}>
					<Text style={{ fontWeight: 600, padding: 20, fontSize: 20 }}>
						No Active Orders
					</Text>
					<Pressable onPress={fetchOrders} style={styles.refresh}>
						<Text>Refresh</Text>
					</Pressable>
				</View>
			)}

			<Modal
				visible={qrCardVisibility}
				onRequestClose={() => setQrCardVisibility(false)}
				animationType="slide"
				presentationStyle="pageSheet"
			>
				<View style={styles.modal}>
					<View style={styles.content}>
						<QRCode size={200} value={selectedQr} />
						<Pressable
							style={styles.close}
							onPress={() => setQrCardVisibility(false)}
						>
							<Text style={{ color: "white", fontWeight: "bold" }}>Close</Text>
						</Pressable>
					</View>
				</View>
			</Modal>
		</View>
	);
}

export default OrderHistory;

const styles = StyleSheet.create({
	order: {
		margin: 20,
		borderColor: "black",
		borderWidth: 1,
		padding: 10,
		borderRadius: 20,
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "khaki",
	},
	info: {
		margin: 5,
		overflow: "hidden",
		alignContent: "space-around",
	},
	qr: {
		padding: 10,
	},
	modal: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	content: {
		alignItems: "center",
	},
	close: {
		width: 100,
		justifyContent: "center",
		alignItems: "center",
		margin: 40,
		backgroundColor: "black",
		padding: 10,
		borderRadius: 20,
	},
	refresh: {
		position: "relative",
		borderRadius: 15,
		padding: 10,
		width: 100,
		alignItems: "center",
		backgroundColor: "lightcoral",
	},
	noOrder: {
		marginTop: 200,
		alignItems: "center",
	},
});
