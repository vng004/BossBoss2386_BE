import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

export const Register = async (req, res, next) => {
    try {
        const { email, password, userName } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email đã tồn tại!',
            });
        }

        const salt = bcrypt.genSaltSync(12);
        const hash = bcrypt.hashSync(password, salt);

        const data = {
            email: email,
            password: hash,
            userName: userName
        };

        const newUser = await User.create(data);

        const user = {
            id: newUser._id,
            userName: newUser.userName,
            email: newUser.email,
            role: newUser.role,
        };

        const token = jwt.sign({ user: user }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            success: true,
            message: 'Đăng ký tài khoản thành công!',
            token,
            user,
        });
    } catch (error) {
        next({
            status: 500,
            message: 'Đăng ký tài khoản thất bại!',
            error: error.message,
        });
    }
};

export const Login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Tài khoản chưa được đăng ký!',
            });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({
                success: false,
                message: 'Mật khẩu không đúng!',
            });
        }

        const token = jwt.sign({ user: user._id }, process.env.JWT_SECRET, { expiresIn: '100d' });

        res.status(200).json({
            success: true,
            message: 'Đăng nhập tài khoản thành công!',
            token,
            user: {
                id: user._id,
                userName: user.userName,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        next({
            status: 500,
            message: 'Đăng nhập tài khoản thất bại!',
            error: error.message,
        });
    }
};
export const getUser = async (req, res, next) => {
    try {
        const users = await User.find({});
        if (!users || users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng!',
            });
        }

        res.status(200).json({
            success: true,
            users,
        });
    } catch (error) {
        next({
            status: 500,
            message: 'Lấy thông tin người dùng thất bại!',
            error: error.message,
        });
    }
};

export const getUserById = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng!',
            });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                userName: user.userName,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        next({
            status: 500,
            message: 'Lấy thông tin người dùng thất bại!',
            error: error.message,
        });
    }
};

export const getUserInfo = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng!',
            });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                userName: user.userName,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        next({
            status: 500,
            message: 'Lấy thông tin người dùng thất bại!',
            error: error.message,
        });
    }
};

export const updateUserRole = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const { role } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng!',
            });
        }

        user.role = role;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Cập nhật vai trò người dùng thành công!',
            user: {
                id: user._id,
                userName: user.userName,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        next({
            status: 500,
            message: 'Cập nhật vai trò người dùng thất bại!',
            error: error.message,
        });
    }
};
