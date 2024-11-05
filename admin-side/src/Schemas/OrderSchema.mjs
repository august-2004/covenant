import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
	userID: {
		type: mongoose.Schema.Types.String,
		required: true,
	},
	itemName: {
		type: mongoose.Schema.Types.String,
		required: true,
		lowercase: true,
	},
	mealTime: {
		type: mongoose.Schema.Types.String,
		enum: ["breakfast", "lunch", "dinner"],
		required: true,
		lowercase: true,
	},
	quantity: {
		type: mongoose.Schema.Types.Number,
		required: true,
		min: 1,
	},
	createdAt: {
		type: mongoose.Schema.Types.String,
		default: () => {
			const now = new Date();
			const minutes =
				now.getMinutes() < 10 ? `0${now.getMinutes()}` : `${now.getMinutes()}`;
			const hours =
				now.getHours() < 10 ? `0${now.getHours()}` : `${now.getHours()}`;
			return `${hours}:${minutes}`;
		},
	},
	date: {
		type: mongoose.Schema.Types.String,
		default: () => {
			const today = new Date();
			const day = today.toDateString();
			return `${day}`;
		},
	},
});

export const Order = mongoose.model("Order", orderSchema);
