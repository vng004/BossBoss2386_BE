import mongoose from "mongoose";
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'Auth', default: null },
    sessionId: { type: String, default: null },
    products: [
        {
            product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true },
            size: { type: String, required: true },
            color: { type: String, required: true },

        }
    ],
    totalPrice: { type: Number, required: true }
}, {
    timestamps: true
});

export default mongoose.model('Cart', cartSchema);
