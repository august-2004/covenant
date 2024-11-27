import { Router } from "express";
import { Item } from "../Schemas/ItemSchema.mjs";
import { validateItem } from "../Validators/validationSchema.mjs";
import { validationResult } from "express-validator";

const itemRouter = new Router();

itemRouter.post("/items/array", validateItem, async (request, response) => {
	try {
		const errors = validationResult(request);
		if (!errors.isEmpty()) {
			return response.status(400).json({ errors: errors.array() });
		}
		const { body: items } = request;
		let savedItems = [];
		let unsavedItems = [];
		for (const item of items) {
			const itemPresent = await Item.findOne({
				itemName: item.itemName,
				mealTime: item.mealTime,
			});
			if (itemPresent) {
				unsavedItems.push({ item: item, message: "Item already present" });
				continue;
			}
			const newItem = new Item(item);
			await newItem.save();
			savedItems.push(newItem);
		}
		return response
			.status(200)
			.send({ savedItems: savedItems, unsavedItems: unsavedItems });
	} catch (err) {
		response.status(500).send(err);
		console.log(err);
	}
});

//GET ITEMS
itemRouter.get("/items", async (request, response) => {
	try {
		const {
			query: { filter, value },
		} = request;
		if (!filter || !value) {
			const allItems = await Item.find({});
			return response.status(200).send(allItems);
		}
		if (filter && value) {
			const items = await Item.find({ [filter]: value });
			response.status(200).send(items);
		}
	} catch (err) {
		response.status(500).send(err);
	}
});

//POST ITEMS

itemRouter.post("/items", async (request, response) => {
	try {
		const { itemName, mealTime } = request.body;
		const itemPresent = await Item.findOne({ itemName, mealTime });
		if (itemPresent) {
			return response.status(404).json({ err: "Item already exists" });
		}
		const newItem = new Item({ itemName, mealTime });
		const savedItem = await newItem.save();
		response.status(200).json({ savedItem });
	} catch (err) {
		response.status(404).json({ err });
	}
});

//UPDATE ITEMS
itemRouter.put("/items/update", async (request, response) => {
	try {
		const { itemName, itemId } = request.body;
		const updatedMeal = await Item.findByIdAndUpdate(
			itemId,
			{ itemName },
			{ new: true }
		);
		response.status(200).json({ updatedMeal });
	} catch (err) {
		response.status(404).send(err);
	}
});

//DELETE ITEMS
itemRouter.delete("/items", async (request, response) => {
	try {
		const { mealTime, itemName } = request.body;
		if (!mealTime || !itemName) {
			return response
				.status(400)
				.json({ err: "ItemName and/or Mealtime fields empty" });
		}
		if (mealTime && itemName) {
			const deletedItem = await Item.findOneAndDelete({
				itemName: itemName,
				mealTime: mealTime,
			});
			if (deletedItem) {
				return response
					.status(200)
					.json({ item: deletedItem, status: "Item deleted successfully" });
			}
			return response.status(422).json({ err: "Item deletion unsuccessful" });
		}
	} catch (err) {
		console.log(err);
		response.status(500).json({ err });
	}
});

export default itemRouter;
