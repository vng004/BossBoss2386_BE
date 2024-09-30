import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const colorSchema = new mongoose.Schema({
    color: { type: String },
    price: { type: Number },
    image: { type: String },
    discountPrice: { type: Number },
    discountPercentage: { type: String },
});

const productSchema = new mongoose.Schema({
    title: { type: String },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand",
    },
    description: { type: String },
    colors: [colorSchema],
    images: [{ type: String }],
    salesCount: { type: Number, default: 0 },
    slug: {
        type: String,
    },
    hot: { type: Boolean, default: false },
    sizes: [{ type: String }]
}, {
    timestamps: true,
    versionKey: false,
});

productSchema.plugin(mongoosePaginate);

export default mongoose.model("Product", productSchema);
