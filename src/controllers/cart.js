import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import Product from "../models/Product.js";
import { v4 as uuidv4 } from 'uuid';

export const addToCart = async (req, res, next) => {
    try {
        const { productId, quantity, color, size } = req.body;
        let sessionId = req.cookies.sessionId;

        // Nếu chưa có sessionId, tạo mới và lưu vào cookie
        if (!sessionId) {
            sessionId = uuidv4();
            res.cookie('sessionId', sessionId, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }); // Cookie trong 1 ngày
        }

        // Tìm giỏ hàng dựa trên sessionId
        let cart = await Cart.findOne({ sessionId });
        if (!cart) {
            cart = new Cart({ sessionId, products: [], totalPrice: 0 });
        }

        // Tìm thông tin sản phẩm
        const productDetails = await Product.findById(productId);
        if (!productDetails) {
            return res.status(404).json({ message: "Sản phẩm không tìm thấy" });
        }

        // Kiểm tra xem sản phẩm có màu yêu cầu hay không
        const colorDetails = productDetails.colors.find(c => c.color === color);
        if (!colorDetails) {
            return res.status(400).json({ message: "Màu sắc không có sẵn cho sản phẩm này" });
        }

        // Kiểm tra xem sản phẩm có kích thước yêu cầu hay không
        if (!productDetails.sizes.includes(size)) {
            return res.status(400).json({ message: "Kích thước không có sẵn cho sản phẩm này" });
        }

        // Tìm sản phẩm trong giỏ hàng với cùng ID và màu sắc
        const productIndex = cart.products.findIndex(p =>
            p.product.toString() === productId && p.color === color && p.size === size
        );

        const productImage = colorDetails.image;
        if (productIndex === -1) {
            // Nếu sản phẩm chưa có trong giỏ, thêm sản phẩm mới
            cart.products.push({ product: productId, quantity, color, size, image: productImage });
        } else {
            // Nếu sản phẩm đã tồn tại với cùng màu, cập nhật số lượng
            cart.products[productIndex].quantity += quantity;
        }

        // Tính tổng giá
        let totalPrice = 0;
        for (let item of cart.products) {
            const product = await Product.findById(item.product);
            if (product) {
                const colorDetails = product.colors.find(c => c.color === item.color);
                if (colorDetails) {
                    const price = colorDetails.discountPrice || colorDetails.price;
                    totalPrice += price * item.quantity;
                }
            }
        }

        // Cập nhật tổng giá vào giỏ hàng
        cart.totalPrice = totalPrice;

        // Lưu giỏ hàng
        await cart.save();

        return res.status(200).json({
            message: "Thêm sản phẩm vào giỏ hàng thành công",
            cart,
        });
    } catch (error) {
        console.log(error)
        next({
            status: 500,
            success: false,
            message: "Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng",
        });
    }
};

export const checkout = async (req, res, next) => {
    try {
        const userId = req.userId;
        let sessionId = req.cookies.sessionId;
        const { id: cartId } = req.params;
        const { shippingDetails } = req.body;
        let cart
        if (userId) {
            cart = await Cart.findOne({ userId, _id: cartId }).populate("products.product", "user");
            if (!cart) return res.status(400).json({ message: "Giỏ hàng rỗng" });
        }
        else if (sessionId) {
            cart = await Cart.findOne({ sessionId, _id: cartId }).populate("products.product", "user");
            if (!cart) return res.status(400).json({ message: "Giỏ hàng rỗng" });
        } else {
            return res.status(400).json({ message: "Không tìm thấy giỏ hàng" });
        }

        const order = new Order({
            user: userId,
            sessionId: sessionId,
            products: cart.products,
            totalPrice: cart.totalPrice,
            shippingDetails,
            description:cart.description
        });

        await order.save();

        cart.products = [];
        cart.totalPrice = 0;
        await cart.save();

        return res.status(200).json({ message: "Thanh toán thành công", order });
    } catch (error) {
        next(error);
    }
};

export const updateQuantity = async (req, res, next) => {
    try {
        const { productId, size, color, newQuantity } = req.body;
        const sessionId = req.cookies.sessionId;
        const userId = req.body.userId; // Đảm bảo userId được gửi từ client nếu người dùng đã đăng nhập

        let cart;

        if (userId) {
            // Trường hợp người dùng đã đăng nhập
            cart = await Cart.findOne({ userId });
        } else if (sessionId) {
            // Trường hợp người dùng chưa đăng nhập
            cart = await Cart.findOne({ sessionId });
        } else {
            return res.status(400).json({ message: "Thiếu thông tin xác thực" });
        }

        if (!cart) {
            return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
        }


        const productIndex = cart.products.findIndex(
            item => item.product.toString() === productId && item.color === color && item.size === size

        );
        console.log(cart)

        if (productIndex === -1) {
            return res.status(404).json({ message: "Sản phẩm không tồn tại trong giỏ hàng" });
        }

        cart.products[productIndex].quantity = newQuantity;

        let totalPrice = 0;
        for (const item of cart.products) {
            const product = await Product.findById(item.product);
            if (product) {
                const colorDetails = product.colors.find(c => c.color === item.color);
                if (colorDetails) {
                    const price = colorDetails.discountPrice || colorDetails.price;
                    totalPrice += price * item.quantity;
                }
            }
        }

        cart.totalPrice = totalPrice;
        await cart.save();

        return res.status(200).json({
            message: "Cập nhật số lượng thành công",
            cart,
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Đã xảy ra lỗi khi cập nhật số lượng sản phẩm",
        });
    }
};

export const getCart = async (req, res, next) => {
    try {
        const userId = req.userId;
        let sessionId = req.cookies.sessionId;
        let cart;

        if (userId) {
            cart = await Cart.findOne({ userId })
                .populate({
                    path: 'products.product',
                    select: 'title slug colors',
                    populate: {
                        path: 'colors.color',
                        select: 'color price image discountPrice discountPercentage'
                    }
                })
                .exec();
        } else if (sessionId) {
            cart = await Cart.findOne({ sessionId })
                .populate({
                    path: 'products.product',
                    select: 'title slug colors',
                    populate: {
                        path: 'colors.color',
                        select: 'color price image discountPrice discountPercentage'
                    }
                })
                .exec();
        }

        return res.status(200).json({
            status: 200,
            success: true,
            cart
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            success: false,
            message: "Đã xảy ra lỗi khi lấy giỏ hàng.",
        });
    }
};


export const removeFromCart = async (req, res, next) => {
    try {
        const userId = req.userId; // userId được truyền từ middleware
        const sessionId = req.cookies.sessionId;
        const { productId } = req.params;

        // Tìm giỏ hàng theo userId hoặc sessionId
        let cart;
        if (userId) {
            cart = await Cart.findOne({ userId });
        } else if (sessionId) {
            cart = await Cart.findOne({ sessionId });
        }

        // Nếu không tìm thấy giỏ hàng
        if (!cart) {
            return res.status(404).json({ message: "Giỏ hàng không tìm thấy" });
        }

        // Tìm sản phẩm trong giỏ hàng
        const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
        if (productIndex === -1) {
            return res.status(404).json({ message: "Sản phẩm không có trong giỏ hàng" });
        }

        // Lấy thông tin chi tiết của sản phẩm để tính toán lại tổng giá
        const product = cart.products[productIndex];
        const productDetails = await Product.findById(product.product);

        if (!productDetails) {
            return res.status(404).json({ message: "Sản phẩm không tìm thấy" });
        }

        // Kiểm tra thông tin màu sắc và giá của sản phẩm
        const colorDetails = productDetails.colors.find(c => c.color === product.color);
        if (!colorDetails) {
            return res.status(404).json({ message: "Màu sắc của sản phẩm không tìm thấy" });
        }

        // Đảm bảo discountPrice và price có giá trị hợp lệ
        const discountPrice = colorDetails.discountPrice || colorDetails.price;
        if (discountPrice === undefined) {
            return res.status(500).json({ message: "Không tìm thấy giá của sản phẩm" });
        }

        const totalPriceToRemove = product.quantity * discountPrice;

        // Cập nhật tổng giá
        cart.totalPrice -= totalPriceToRemove;

        // Đảm bảo tổng giá không bị âm
        if (cart.totalPrice < 0) {
            cart.totalPrice = 0;
        }

        // Xóa sản phẩm khỏi giỏ hàng
        cart.products.splice(productIndex, 1);

        // Lưu giỏ hàng sau khi cập nhật
        await cart.save();

        return res.status(200).json({
            message: "Xóa sản phẩm khỏi giỏ hàng thành công",
            cart,
        });

    } catch (error) {
        console.error("Lỗi:", error); // Log lỗi chi tiết
        next({
            status: 500,
            success: false,
            message: "Đã xảy ra lỗi khi xóa sản phẩm khỏi giỏ hàng",
        });
    }
};




