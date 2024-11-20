const stripe = require("stripe")(process.env.STRIPE_SECRET);

const createCheckSession = async (req, res) => {
  const { products } = req.body;

  try {
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
      product_ids: products.map((product) => product._id).join(','), // Join product IDs as a string
    };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['US', 'IN'],
      },
      success_url: `${process.env.FRONTEND_URL}/order_history?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment_failed`,
      metadata
    });

    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
}

module.exports = { createCheckSession }