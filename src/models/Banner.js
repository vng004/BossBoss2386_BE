import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
    images: [{ type: String }]
})
export default mongoose.model("Banner", bannerSchema)