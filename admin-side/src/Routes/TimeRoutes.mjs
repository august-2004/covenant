import { Mealtime } from "../Schemas/MealtimeSchema.mjs";
import { Router } from "express";
import { timeValidator } from "../Validators/timeValidator.mjs";

const timeRouter = new Router();

timeRouter.get("/time", async (req, res) => {
	const meal = req.query.meal;
	const timings = await Mealtime.find({ mealtime: meal });
	res.status(200).send(timings);
});

timeRouter.post("/time", async (req, res) => {
	const { opening, closing, meal } = req.body;
	console.log(opening, closing, meal);
	const filter = { mealtime: meal };
	const update = { openingTime: opening, closingTime: closing };
	const doc = await Mealtime.findOneAndUpdate(filter, update);
	res.status(200).send({ json: "updated succesfully" });
});
timeRouter.get("/opentime", async (req, res) => {
	try {
		const mealtimes = await Mealtime.find({});
		const updatedMealtimes = await Promise.all(
			mealtimes.map(async (meal) => {
				const isClosed = !(await timeValidator(meal.mealtime));
				return {
					...meal._doc,
					isClosed,
				};
			})
		);
		res.send(updatedMealtimes);
	} catch {
		res.status(404).send({ message: "error" });
	}
});
export default timeRouter;
