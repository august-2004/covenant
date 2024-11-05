import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import itemRouter from "./Routes/ItemRoutes.mjs";
import orderRouter from "./Routes/OrderRoutes.mjs";
import authRouter from "./Routes/AuthRoutes.mjs";
import cors from "cors";
import timeRouter from "./Routes/TimeRoutes.mjs";
import { Server } from "socket.io";
import http from "http";
import { Mealtime } from "./Schemas/MealtimeSchema.mjs";
import os from "os";
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});
app.use(cors());

const port = process.env.port || 3000;

app.use(express.json());
app.use(itemRouter);
app.use(orderRouter);
app.use(timeRouter);
app.use(authRouter);

mongoose
	.connect(
		"mongodb+srv://thesevenstarscompany:6gCP3UgjzmaDK7Mj@meals.fgv99.mongodb.net/CanteenDB?retryWrites=true&w=majority&appName=meals"
	)
	.then(() => {
		console.log("Database connected");
	})
	.catch((err) => {
		console.log(`Error : ${err}`);
	});

io.on("connection", (socket) => {
	console.log("an user connected");
	socket.on("message", (msg) => {
		console.log(msg);
	});

	socket.on("disconnect", () => {
		console.log("user disconnected");
	});
});

const timeChangeStream = Mealtime.watch();

timeChangeStream.on("change", (change) => {
	console.log("Meal timings modified");
	console.log("Operation Type:", change.operationType);
	console.log("updated field:", change.updateDescription.updatedFields);

	io.emit("changes happened", change);
});

function getLocalIPAddress() {
	const interfaces = os.networkInterfaces();
	for (const interfaceName in interfaces) {
		for (const iface of interfaces[interfaceName]) {
			if (iface.family === "IPv4" && !iface.internal) {
				return iface.address;
			}
		}
	}
	return "127.0.0.1";
}

server.listen(port, () => {
	console.log(getLocalIPAddress());
	console.log(`Running on port ${port}`);
});
