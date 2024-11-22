const stripe = require("stripe")(process.env.STRIPE_SECRET);

const createCheckSession = async (req, res) => {
  const { products } = req.body;
  console.log(req.body.customer_email)
  try {
    const taxRate = 0.18;
    
    const lineItems = products.map((product) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: product.title,
          description: product.description
        },
        unit_amount: Math.round(product.newPrice * 100),
      },
      quantity: 1, // currently we allow only one quantity per item
    }));

    const metadata = {
      product_ids: JSON.stringify(products.map((product) => product._id))
    };



    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: `${req.body.customer_email}`,
      line_items: lineItems,
      mode: 'payment',
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['US', 'IN'],
      },
      success_url: `${process.env.FRONTEND_URL}/order_history/{CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment_failed`,
      metadata,
      phone_number_collection: {
        enabled: true,
      },
    });

    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
}

const retriveSession = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    res.status(200).json(session);
  } catch (error) {
    console.error('Error retrieving session:', error);
    res.status(500).send('Internal Server Error');
  }
}

const webhookSession = (req, res) => {
  const endpointSecret = 'whsec_0b2a14899d4d5d48716776ee936f45d27236cf64eebfec897e7436603e592edf';
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
}

module.exports = { createCheckSession, retriveSession, webhookSession }