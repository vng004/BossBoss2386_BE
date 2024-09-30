import mongoose from "mongoose";

const { Schema, model } = mongoose;

const orderSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth', default: null },
    sessionId: { type: String, default: null },

    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, required: true },
        color: { type: String, required: true },
        size: { type: String, required: true }
    }],
    totalPrice: { type: Number, required: true },
    shippingDetails: {
        name: { type: String, required: true, trim: true }, // Có thể yêu cầu
        address: {
            province: { type: String, required: true, trim: true }, // Yêu cầu
            district: { type: String, required: true, trim: true }, // Yêu cầu
            ward: { type: String, required: true, trim: true }, // Yêu cầu
            streetAddress: { type: String, required: true, trim: true } // Yêu cầu
        },
        phone: { type: String, required: true, trim: true }, // Yêu cầu
    },
    description: String,
    orderStatus: { type: Number, enum: [0, 1, 2], default: 0 },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

export default model('Order', orderSchema);
