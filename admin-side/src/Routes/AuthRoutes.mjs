import { Router } from "express";
import UserModel from "../Schemas/UserSchema.mjs";
import { hashSync, compareSync } from "bcrypt";
import passport from "passport";
import "../config/passport.mjs";
import jwt from "jsonwebtoken";

const authRouter = new Router();

authRouter.post("/register", (req, res) => {
	const user = new UserModel({
		username: req.body.username,
		password: hashSync(req.body.password, 10),
	});

	user
		.save()
		.then((user) => {
			res.send({
				success: true,
				message: "user created successfully",
				user: {
					id: user._id,
					username: user.username,
				},
			});
		})
		.catch((err) => {
			res.send({
				success: false,
				message: "An error occured in creating user",
				error: err,
			});
		});
});

authRouter.post("/login", (req, res) => {
	UserModel.findOne({ username: req.body.username }).then((user) => {
		if (!user) {
			return res.status(200).send({
				success: false,
				message: "User does not exist",
			});
		}

		if (!compareSync(req.body.password, user.password)) {
			return res.status(200).send({
				success: false,
				message: "Incorrect password",
			});
		}

		const payload = {
			username: user.username,
			id: user._id,
		};
		const token = jwt.sign(payload, process.env.sec, { expiresIn: "1d" });

		return res.status(200).send({
			success: true,
			message: user.username,
			token: "Bearer " + token,
		});
	});
});

export default authRouter;
