const Order = require('./order.model')

const createOrder = async (req, res) => {
    try {
        const newOrder = await Order({ ...req.body });
        await newOrder.save();
        res.status(201).send({ message: "Order created successfully", order: newOrder })
    } catch (error) {
        console.error("Error creating order");
        res.status(418).send({ message: "Failed to create a order. You might be missing some fields that are actually required!" })
    }
}

module.exports = { createOrder }