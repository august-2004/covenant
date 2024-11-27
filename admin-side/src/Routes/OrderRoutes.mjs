import { Order } from "../Schemas/OrderSchema.mjs";
import { Item } from "../Schemas/ItemSchema.mjs";
import { Router } from "express";
import { timeValidator } from "../Validators/timeValidator.mjs";
import {
	validateOrder,
	validateOrderID,
} from "../Validators/validationSchema.mjs";
import { validationResult } from "express-validator";
import { cancellationTimeValidator } from "../Validators/cancellationTimeValidator.mjs";
import passport from "passport";
import appendDataToQueue from "../OrderStorage.mjs";

const orderRouter = new Router();

orderRouter.post(
	"/orders",
	passport.authenticate("jwt", { session: false }),
	validateOrder,

	async (request, response) => {
		try {
			const errors = validationResult(request);
			if (!errors.isEmpty()) {
				return response.status(400).json({ errors: errors.array() });
			}
			const { body: orders } = request;
			let savedOrders = [];
			let unsavedOrders = [];
			for (const order of orders) {
				const { itemName, mealTime, quantity: incrementBy } = order;
				if (await timeValidator(mealTime)) {
					const itemPresent = await Item.findOneAndUpdate(
						{ itemName, mealTime },
						{ $inc: { quantity: incrementBy } },
						{ new: true }
					);
					if (itemPresent) {
						order.userID = request.user.username;
						const newOrder = new Order(order);
						const savedOrder=await newOrder.save();
						savedOrders.push(savedOrder);
					} else {
						unsavedOrders.push({
							order: order,
							error: `Item ${itemName} for mealtime ${mealTime} not found`,
						});
						continue;
					}
				} else {
					unsavedOrders.push({ order: order, error: "Time limit exceeded" });
					continue;
				}
			}
			if(savedOrders!==0){
				appendDataToQueue(savedOrders)
			}
			if (unsavedOrders.length === 0) {
				return response.status(200).send({ savedOrders: savedOrders });
			}
			if (savedOrders.length === 0) {
				return response.status(400).send({ unsavedOrders: unsavedOrders });
			}
			return response
				.status(207)
				.send({ savedOrders: savedOrders, unsavedOrders: unsavedOrders });
		} catch (err) {
			response.status(500).send(err);
			console.log(err);
		}
	}
);

orderRouter.get(
	"/orders/user",
	passport.authenticate("jwt", { session: false }),
	async (request, response) => {
		try {
			if (request.user) {
				const orders = await Order.find({ userID: request.user.username });
				response.status(200).send(orders);
			}
		} catch (err) {
			response.status(500).send(err);
		}
	}
);

orderRouter.get("/orders", async (request, response) => {
	try {
		const {
			query: { filter, value },
		} = request;
		if (!filter || !value) {
			const allOrders = await Order.find({});
			return response.status(200).send(allOrders);
		}
		if (filter && value) {
			const orders = await Order.find({ [filter]: value });
			response.status(200).json({ orders });
		}
	} catch (err) {
		response.status(500).send(err);
	}
});

const deleteOrder = async (request, response, next) => {
	try {
		const { id } = request.params;
		let orderToDelete = await Order.findById(id);
		if (!orderToDelete) {
			return response.status(404).send({ status: "Order not found" });
		}
		const { itemName, mealTime, quantity: decrementBy } = orderToDelete;
		const itemUpdation = await Item.findOneAndUpdate(
			{ itemName, mealTime },
			{ $inc: { quantity: -decrementBy } },
			{ new: true }
		);
		if (!itemUpdation) {
			return response
				.status(422)
				.send({ status: "Failed to update item quantity" });
		}
		const deletedOrder = await Order.findByIdAndDelete(id);
		if (deletedOrder) {
			return response.status(200).send({
				deletedOrder: deletedOrder,
				status: "Order deletion successful",
			});
		}
		return response.status(422).send({ status: "Order deletion unsuccessful" });
	} catch (err) {
		console.log(err);
		response.status(500).send(err);
	}
};

orderRouter.delete(
	"/orders/cancel/:id",
	validateOrderID,
	async (request, response, next) => {
		try {
			const { id } = request.params;
			const isValid = await cancellationTimeValidator(id);
			if (isValid) {
				next();
			} else {
				return response.status(400).send("Cancellation Time Limit exceeded");
			}
		} catch (err) {
			console.log(err);
			response.status(500).send(err);
		}
	},
	deleteOrder
);

orderRouter.delete("/orders/:id", validateOrderID, deleteOrder);

export default orderRouter;
