import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
    title: { type: String, required: true }, // Đảm bảo tên thương hiệu là bắt buộc
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        // required: true,  // Đảm bảo thương hiệu phải liên kết với một danh mục
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    }],
    slug: { type: String, unique: true },  // Đảm bảo slug là duy nhất cho thương hiệu
}, {
    timestamps: true,  // Tự động thêm createdAt và updatedAt
    versionKey: false,  // Ẩn trường __v
});

export default mongoose.model("Brand", brandSchema);
