const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    amount_subtotal: { type: Number, required: true },
    amount_total: { type: Number, required: true },
    created: { type: Number, required: true },
    currency: { type: String, required: true },
    customer_details: {
        address: {
            city: { type: String, required: true },
            country: { type: String, required: true },
            line1: { type: String, required: true },
            line2: { type: String, required: false },
            postal_code: { type: String, required: true },
            state: { type: String, required: true }
        },
        email: { type: String, required: true },
        name: { type: String, required: true },
        phone: { type: String, required: false },
        tax_exempt: { type: String, required: true },
        tax_ids: { type: [String], required: true }
    },
    product_ids: { type: [String], required: true },
    mode: { type: String, required: true },
    payment_intent: { type: String, required: true },
    payment_status: { type: String, required: true },
    shipping_cost: { type: mongoose.Schema.Types.Mixed, required: false }, // Null or object
    shipping_details: {
        address: {
            city: { type: String, required: true },
            country: { type: String, required: true },
            line1: { type: String, required: true },
            line2: { type: String, required: false },
            postal_code: { type: String, required: true },
            state: { type: String, required: true }
        },
        name: { type: String, required: true }
    },
    shipping_options: { type: [mongoose.Schema.Types.Mixed], required: true },
    status: { type: String, required: true }
}, {
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;