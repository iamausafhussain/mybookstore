const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
require('dotenv').config();
const stripe = require("stripe")(process.env.STRIPE_SECRET);

// route imports
const bookRoutes = require("./src/books/book.route")
const orderRoutes = require("./src/orders/order.route")
const userRoutes = require("./src/users/user.route")
const stripeRoutes = require("./src/stripe/stripe.route")

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
app.use("/api/stripe", stripeRoutes)

app.get('/api/retrieve-session/:sessionId', async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    res.status(200).json(session);
  } catch (error) {
    console.error('Error retrieving session:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const endpointSecret = 'whsec_your_webhook_secret';
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Process the session data (e.g., save order to the database)
    console.log('Payment successful:', session);
  }

  res.status(200).send('Received webhook');
});


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