const Order = require('./order.model')

const createOrder = async (req, res) => {
    try {

        const isOrderExists = await Order.findOne({ id: req.body.id });

        if (!isOrderExists) {
            console.log("----------------Creating Order---------------------");
            const newOrder = await Order({ ...req.body });
            await newOrder.save();

            res.status(201).send({ message: "Order created successfully", order: newOrder })
        }
        else {
            console.log("Order already present")
            return res.status(409).send({ message: "Order already present" });
        }
    } catch (error) {
        console.error("Error creating order", error);
        res.status(500).send({ message: "Failed to create a order. You might be missing some fields that are actually required!" })
    }
}

const getOrderUsingEmail = async (req, res) => {
    const { email } = req.params;
    try {
        const order = await Order.find({'customer_details.email': email})

        if (!order) {
            res.status(404).send(`Order with email ${email} not found!`)
        }

        res.status(200).send({order: order})


    } catch (error) {
        console.error("Error fetching order", error);
        res.status(418).send({ message: `Failed to fetch order.` })
    }
}

module.exports = { createOrder, getOrderUsingEmail }