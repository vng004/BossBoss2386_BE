import jwt from 'jsonwebtoken';
import Auth from "../models/auth.js";

export const checkAuth = async (req, res, next) => {
	try {
		const token = req.headers?.authorization?.split(" ")[1];
		if (!token) {
			return res.status(401).json({
				message: "Bạn không có quyền truy cập!",
			});
		}

		const decode = jwt.verify(token, process.env.JWT_SECRET);
		if (!decode) {
			return res.status(401).json({
				message: "Token không hợp lệ hoặc đã hết hạn",
			});
		}

		const user = await Auth.findById(decode.user);
		if (!user) {
			return res.status(401).json({
				message: "Người dùng không tồn tại",
			});
		}

		req.user = user;
		next();
	} catch (error) {
		return res.status(401).json({
            message: "Bạn không có quyền truy cập!",
        });
	}
};
