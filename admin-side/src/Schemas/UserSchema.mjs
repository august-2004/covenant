import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
		},
		password: { type: String, required: true },
	},
	{ timestamps: true }
);

const UserModel = mongoose.model("Students", userSchema);

export default UserModel;
