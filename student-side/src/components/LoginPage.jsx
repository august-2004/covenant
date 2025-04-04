import {
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
	ActivityIndicator,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useState, useEffect } from "react";

export default function LoginPage() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [token, setToken] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isLogging, setIsLogging] = useState(false);

	useEffect(() => {
		const checkToken = async () => {
			const storedToken = await SecureStore.getItemAsync("jwtToken");
			if (storedToken) {
				setToken(storedToken);
			}
			setIsLoading(false);
		};
		checkToken();
	}, []);

	const handleLogin = async () => {
		setIsLogging(true);
		try {
			const response = await fetch("http://192.168.99.127:3000/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ username, password }),
			});

			if (!response.ok) {
				throw new Error("Error in logging in");
			}

			const data = await response.json();
			if (data.success) {
				const token = data.token;

				await SecureStore.setItemAsync("jwtToken", token);
				setToken(token);
				setName(data.message);
				alert("Login successful");
			} else {
				alert(data.message);
			}
		} catch (error) {
			alert("There was a error in logging in");
		}
		setIsLogging(false);
	};

	const handleLogout = async () => {
		await SecureStore.deleteItemAsync("jwtToken");
		setToken(null);
		alert("Logged out successfully");
	};

	if (isLoading) {
		return (
			<View style={styles.container}>
				<ActivityIndicator size="large" color="#0000ff" />
				<Text>Loading...</Text>
			</View>
		);
	} else {
		return (
			<View style={styles.container}>
				{token ? (
					<View style={styles.container}>
						<Text style={styles.title}>Welcome {name}</Text>
						<Pressable
							onPress={handleLogout}
							style={[styles.login, { backgroundColor: "lightcoral" }]}
						>
							<Text>Logout</Text>
						</Pressable>
					</View>
				) : (
					<View style={styles.container}>
						<TextInput
							style={styles.input}
							placeholderTextColor="black"
							placeholder="Enter your ID"
							value={username}
							onChangeText={setUsername}
						></TextInput>
						<TextInput
							style={styles.input}
							placeholderTextColor="black"
							placeholder="Password"
							value={password}
							onChangeText={setPassword}
							secureTextEntry
						></TextInput>
						<Pressable
							style={[styles.login, { backgroundColor: "#8fc02ea0" }]}
							onPress={handleLogin}
							disabled={isLogging}
						>
							{isLogging ? (
								<ActivityIndicator size="small" color="#FFFFFF" />
							) : (
								<Text style={{ fontSize: 15, fontWeight: "600" }}>Login</Text>
							)}
						</Pressable>
					</View>
				)}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	title: {
		fontSize: 20,
		padding: 20,
	},
	input: {
		width: 200,
		height: 40,
		borderColor: "black",
		borderRadius: 15,
		borderWidth: 1,
		marginBottom: 12,
		paddingHorizontal: 10,
		paddingLeft: 10,
	},
	login: {
		position: "relative",
		borderRadius: 15,
		padding: 10,
		width: 100,
		alignItems: "center",
	},
});
