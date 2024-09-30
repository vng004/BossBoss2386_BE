import { sendEmail } from "../utils/email.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Tìm người dùng với email đã cho
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "Người dùng không tồn tại với email này.",
      });
    }

    // Tạo mật khẩu mới ngẫu nhiên
    const newPassword = Math.random().toString(36).slice(-8);

    // Mã hóa mật khẩu mới
    const salt = bcrypt.genSaltSync(12);
    const hashPass = bcrypt.hashSync(newPassword, salt);
    if (!hashPass) {
      return res.status(500).json({
        message: "Lỗi khi mã hóa mật khẩu mới.",
      });
    }

    // Cập nhật mật khẩu mới cho người dùng
    user.password = hashPass;
    await user.save();

    // Gửi email chứa mật khẩu mới
    const emailSubject = "Cập nhật mật khẩu cho ứng dụng Node.js";
    const emailText = `Mật khẩu mới của bạn là: ${newPassword}`;
    await sendEmail(email, emailSubject, emailText);

    return res.status(200).json({
      message: "Mật khẩu mới đã được gửi đến email của bạn.",
    });
  } catch (error) {
    // Xử lý lỗi
    next({
      status: 500,
      message: "Có lỗi xảy ra trong quá trình đặt lại mật khẩu.",
      error: error.message,
    });
  }
};
