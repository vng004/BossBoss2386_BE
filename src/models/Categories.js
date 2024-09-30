import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    title: { type: String, required: true },
    brands: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand",
    }],
    slug: { type: String, unique: true },
}, {
    timestamps: true,
    versionKey: false,
});

export default mongoose.model("Category", categorySchema);
