import { useState, useEffect } from "react";
import {
	StyleSheet,
	View,
	Text,
	FlatList,
	Pressable,
	Alert,
	ActivityIndicator,
} from "react-native";

import * as SecureStore from "expo-secure-store";
import OrderItem from "./OrderItem";

export default function OrderMenu({
	value,
	incrementOrderCount,
	isClosed,
	openingTime,
	closingTime,
}) {
	const [menu, setMenu] = useState([]);
	const [order, setOrder] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const fetchMenu = async () => {
		try {
			const response = await fetch(
				`http://192.168.99.127:3000/items?filter=mealTime&value=${value}`
			);
			if (!response.ok) {
				alert("Cannot Fetch Menu, Please Check Your Connection!");
				throw new Error("Response not OK");
			}
			const data = await response.json();
			const items = data.map((item) => ({
				id: item._id,
				itemName: item.itemName,
				mealTime: item.mealTime,
				quantity: 0,
			}));
			setMenu(items);
		} catch (err) {
			console.log(`Error : ${err}`);
		}
	};

	useEffect(() => {
		fetchMenu();
	}, [value]);

	const incrementCount = (id) => {
		setMenu((prevMenu) => {
			return prevMenu.map((item) => {
				if (item.id === id) {
					const updatedMenu = { ...item, quantity: item.quantity + 1 };

					return updatedMenu;
				}
				return item;
			});
		});
	};

	const decrementCount = (id) => {
		setMenu((prevMenu) => {
			return prevMenu.map((item) => {
				if (item.id === id && item.quantity > 0) {
					const updatedMenu = { ...item, quantity: item.quantity - 1 };
					console.log("Item count incremented", updatedMenu);
					return updatedMenu;
				}
				return item;
			});
		});
	};

	const handleSubmit = async () => {
		setIsLoading(true);
		const newOrder = menu
			.filter((item) => item.quantity > 0)
			.map((item) => ({
				itemName: item.itemName,
				mealTime: item.mealTime,
				quantity: item.quantity,
			}));
		setOrder(newOrder);
		try {
			const jwtToken = await SecureStore.getItemAsync("jwtToken");
			if (jwtToken) {
				const response = await fetch("http://192.168.99.127:3000/orders", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: jwtToken,
					},
					body: JSON.stringify(newOrder),
				});
				if (response.ok) {
					console.log("Order posted", response);
					incrementOrderCount();
					alert("Order Posted Successfully");
				} else {
					alert("An error occured while ordering.");
					console.log("Order failed", response);
				}
				setMenu((prevMenu) => {
					return prevMenu.map((item) => ({ ...item, quantity: 0 }));
				});
				setOrder([]);
			} else {
				alert("Please Login Before Placing an Order");
			}
		} catch (err) {
			console.log(`Error: ${err}`);
		}
		setIsLoading(false);
	};

	return (
		<View style={styles.container}>
			<Text style={styles.mealTime}>{value}</Text>
			{Array.isArray(menu) && menu.length > 0 ? (
				<FlatList
					scrollEnabled={false}
					style={styles.flatList}
					showsVerticalScrollIndicator={false}
					data={menu}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => (
						<OrderItem
							key={item.id}
							item={item}
							incrementCount={incrementCount}
							decrementCount={decrementCount}
						/>
					)}
				/>
			) : (
				<Text>No items available!</Text>
			)}
			<View style={styles.bottomContainer}>
				<View style={styles.closes}>
					{isClosed ? (
						<Text style={{ fontSize: 15, fontWeight: "600" }}>
							{`Opens at ${openingTime}`}
						</Text>
					) : (
						<Text style={{ fontSize: 15, fontWeight: "600" }}>
							{`Closes at ${closingTime}`}
						</Text>
					)}
				</View>

				<Pressable
					style={[
						styles.submit,
						{ backgroundColor: isClosed ? "#B0B0B0" : "orange" },
					]}
					onPress={handleSubmit}
					disabled={isClosed || isLoading}
				>
					{isLoading ? (
						<ActivityIndicator size="small" color="#FFFFFF" />
					) : (
						<Text style={{ fontSize: 15, fontWeight: "600" }}>
							{isClosed ? "Closed" : "Order"}
						</Text>
					)}
				</Pressable>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	flatList: {
		backgroundColor: "khaki",
		borderRadius: 20,
		paddingHorizontal: 10,
		paddingVertical: 20,
	},
	mealTime: {
		fontSize: 30,
		textTransform: "capitalize",
		fontFamily: "Inter, Helvetica",
		fontWeight: "bold",
	},
	container: {
		margin: 20,
		borderColor: "black",
		borderWidth: 1,
		padding: 10,
		borderRadius: 20,
	},
	bottomContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingHorizontal: 3,
		paddingTop: 10,
	},
	closes: {
		backgroundColor: "lightsalmon",
		position: "relative",
		borderRadius: 15,
		padding: 10,

		alignItems: "center",
	},
	submit: {
		position: "relative",
		borderRadius: 15,
		padding: 10,
		width: 100,
		alignItems: "center",
	},
});
