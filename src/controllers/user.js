import User from "../models/User.js";

export const showProfile = async (req, res) => {
	try {
		const userId = req.userId;
		const user = await User.findById(userId).populate('cart');
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		res.status(200).json(user);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const updateProfile = async (req, res) => {
	try {
		const userId = req.userId;
		const updateData = req.body;

		const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
			new: true, // return the updated document
			runValidators: true, // run schema validations
		});

		if (!updatedUser) {
			return res.status(404).json({ message: 'User not found' });
		}
		res.status(200).json(updatedUser);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};