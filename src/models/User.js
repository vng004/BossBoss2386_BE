import mongoose, { Schema } from "mongoose";

const shemaUser = new mongoose.Schema(
	{
		userName: {
			type: String,
		},
		password: {
			type: String,
		},
		email: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			default: "member",
			enum: ["member", "admin"],
		},
		isActive: {
			type: Boolean,
			default: false,
		},
		cart: {
			type: Schema.Types.ObjectId,
			ref: "Cart",
		},
		thumbnail: String
	},
	{ timestamps: true, versionKey: false }
);

export default mongoose.model("User", shemaUser); 