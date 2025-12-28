
import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const createPaymentIntent = async (req, res) => {
  const { amount, currency = 'mxn' } = req.body
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
    automatic_payment_methods: { enabled: true },
  })
  res.json({ clientSecret: paymentIntent.client_secret })
}