import { useEffect, useState } from "react";
import OrderMenu from "./OrderMenu";
import { StyleSheet, View, FlatList } from "react-native";

export default function OrderManager() {
	const [orderCount, setOrderCount] = useState(0);
	const [mealTimes, setMealTimes] = useState([]);

	const incrementOrderCount = () => {
		setOrderCount((prevOrderCount) => prevOrderCount + 1);
	};

	const decrementOrderCount = () => {
		setOrderCount((prevOrderCount) => prevOrderCount - 1);
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch("http://192.168.99.127:3000/opentime");
				if (!response.ok) {
					return alert("Error in fetching times");
				}
				data = await response.json();
				setMealTimes(data);
			} catch (err) {
				alert("Error in fetching times");
			}
		};
		fetchData();
	}, []);
	return (
		<View style={styles.container}>
			{mealTimes.map((item) => (
				<OrderMenu
					key={item._id}
					value={item.mealtime}
					incrementOrderCount={incrementOrderCount}
					decrementOrderCount={decrementOrderCount}
					isClosed={item.isClosed}
					openingTime={item.openingTime}
					closingTime={item.closingTime}
				/>
			))}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		overflow: "scroll",
	},
});
