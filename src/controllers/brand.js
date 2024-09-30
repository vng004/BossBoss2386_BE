import Brand from "../models/Brand.js";
import slugify from "slugify";
import Category from "../models/Categories.js";

export const getBrand = async (req, res, next) => {
    try {
        const data = await Brand.find({}).populate('category').populate('products');
        if (data) {
            res.status(200).json({
                success: true,
                message: "Lấy danh mục thành công!",
                data,
            });
        }
    } catch (error) {
        next({
            status: 500,
            success: false,
            message: "Lấy danh mục thất bại!",
            error: error.message,
        });
    }
};

export const getBrandById = async (req, res, next) => {
    try {
        const data = await Brand.findById(req.params.id).populate("category", "title").populate("products", "title");
        if (data) {
            res.status(200).json({
                success: true,
                message: "Lấy danh mục thành công!",
                data,
            });
        }
    } catch (error) {
        next({
            status: 500,
            success: false,
            message: "Lấy danh mục thất bại!",
            error: error.message,
        });
    }
};

export const createBrand = async (req, res, next) => {
    try {
        const slug = slugify(req.body.title, {
            replacement: "-",
            lower: true, // Chuyển toàn bộ ký tự thành chữ thường
            strict: true, // Loại bỏ các ký tự không hợp lệ
            locale: true, // Hỗ trợ định dạng địa phương 
            trim: true // Loại bỏ các ký tự khoảng trắng ở đầu và cuối
        });
        const data = await Brand.create({ ...req.body, slug });
        const categoryToUpdate = await Category.findByIdAndUpdate(
            req.body.category,
            {
                $push: { brands: data._id },
            },
            { new: true }  // Trả về tài liệu đã cập nhật
        );
        if (data && categoryToUpdate) {
            res.status(201).json({
                success: true,
                message: "Thêm danh mục thành công!",
                data: data,
            });
        }
    } catch (error) {
        next({
            status: 500,
            success: false,
            message: "Thêm danh mục thất bại!",
            error: error.message,
        });
    }
};

export const editBrand = async (req, res, next) => {
    try {
        const { title } = req.body;

        // Generate slug from title
        const updatedData = {
            ...req.body,
            slug: slugify(title, {
                replacement: "-",
                lower: true,
                strict: true,
                locale: 'vi', // Specify the locale if needed
                trim: true
            })
        };

        // Update the brand with the new data
        const data = await Brand.findByIdAndUpdate(req.params.id, updatedData, { new: true });

        if (data) {
            res.status(200).json({
                success: true,
                message: "Cập nhật danh mục thành công!",
                data,
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Danh mục không tìm thấy!",
            });
        }
    } catch (error) {
        next({
            status: 500,
            success: false,
            message: "Cập nhật danh mục thất bại!",
            error: error.message,
        });
    }
};

export const removeBrand = async (req, res, next) => {
    try {
        // if (req.params.id === "66d6f0daf5355096cf4b1aaa") {
        //     return next({
        //         status: 400,
        //         success: false,
        //         message: "Không xóa được danh mục mặc định!"
        //     });
        // }
        const data = await Brand.findByIdAndDelete(req.params.id);
        // const productsToUpdate = await Product.find({ category: req.params.id });
        // await Promise.all(
        //     productsToUpdate.map(async (product) => {
        //         product.category = "66d6f0daf5355096cf4b1aaa";
        //         await product.save();
        //     })
        // );
        if (data) {
            res.status(200).json({
                success: true,
                message: "Xóa danh mục thành công!",
            });
        }
    } catch (error) {
        next({
            status: 500,
            success: false,
            message: "Xóa danh mục thất bại!",
            error: error.message,
        });
    }
};
