const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
require('dotenv').config();
const stripe = require("stripe")(process.env.STRIPE_SECRET);

// route imports
const bookRoutes = require("./src/books/book.route")
const orderRoutes = require("./src/orders/order.route")
const userRoutes = require("./src/users/user.route")

const app = express();
const port = 3000

// middleware
app.use(express.json())
app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true
}))

app.use("/api/books", bookRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/users", userRoutes)

// stripe payment checkout api
app.post("/api/create-checkout-session", async (req, res) => {
  const { products } = req.body;

  try {
    const lineItems = products.map((product) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: product.title,
        },
        unit_amount: Math.round(product.newPrice * 100),
      },
      quantity: 1 // currently we allow only one quantity per item
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['US', 'IN'],
      },
      success_url: `${process.env.FRONTEND_URL}/order_history`,
      cancel_url: `${process.env.FRONTEND_URL}/payment_failed`,
    });

    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
})


async function main() {
  await mongoose.connect(process.env.DB_URL);


  app.get('/', (req, res) => {
    res.send("Welcome to backend server")
  })
}

main().then(() => console.log("MongoDB connected Successfully!")).catch(err => console.log(err));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})