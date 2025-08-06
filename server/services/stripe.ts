// Payment service using real Stripe API key
import Stripe from 'stripe'

// Initialize Stripe with real API key
const stripeApiKey = process.env.STRIPE_SECRET_KEY
const stripe = stripeApiKey ? new Stripe(stripeApiKey, {
  apiVersion: '2023-10-16',
}) : null

export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  interval: 'month' | 'year'
  features: string[]
  stripePriceId?: string
}

export const PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free Explorer',
    price: 0,
    interval: 'month',
    features: ['Basic destination access', 'Limited TripKits', 'Community support']
  },
  {
    id: 'insider',
    name: 'Utah Insider',
    price: 9,
    interval: 'month',
    features: [
      'All Free Explorer features',
      'Download all curated collections',
      '20% discount on planning kits',
      'Monthly insider newsletter',
      'Early access to Olympic updates'
    ],
    stripePriceId: 'price_insider_monthly'
  },
  {
    id: 'olympic-vip',
    name: 'Olympic VIP',
    price: 29,
    interval: 'month',
    features: [
      'All Utah Insider features',
      'Exclusive Olympic venue access',
      '50% discount on all planning kits',
      'VIP newsletter with insider tips',
      'Priority Olympic ticket access',
      'Affiliate partnership opportunities'
    ],
    stripePriceId: 'price_olympic_vip_monthly'
  }
]

export const stripeService = {
  async createCustomer(email: string, name: string, metadata?: Record<string, string>) {
    if (!stripe) {
      console.log(`Would create Stripe customer: ${email} (${name}) (Stripe not configured)`)
      return { 
        success: true, 
        customer: { id: 'mock_customer_id', email, name },
        message: 'Customer logged (Stripe not configured)'
      }
    }

    try {
      const customer = await stripe.customers.create({
        email,
        name,
        metadata: {
          source: 'slctrips',
          ...metadata
        }
      })
      return { success: true, customer }
    } catch (error) {
      console.error('Stripe customer creation error:', error)
      return { success: false, error }
    }
  },

  async createSubscription(customerId: string, priceId: string) {
    if (!stripe) {
      console.log(`Would create Stripe subscription: ${customerId} -> ${priceId} (Stripe not configured)`)
      return { 
        success: true, 
        subscription: { id: 'mock_subscription_id', status: 'active' },
        message: 'Subscription logged (Stripe not configured)'
      }
    }

    try {
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
      })
      return { success: true, subscription }
    } catch (error) {
      console.error('Stripe subscription creation error:', error)
      return { success: false, error }
    }
  },

  async createCheckoutSession(priceId: string, customerEmail: string, successUrl?: string, cancelUrl?: string) {
    if (!stripe) {
      console.log(`Would create Stripe checkout session for ${customerEmail} (Stripe not configured)`)
      return { 
        success: true, 
        session: { 
          id: 'mock_session_id', 
          url: 'https://checkout.stripe.com/mock' 
        },
        message: 'Checkout session logged (Stripe not configured)'
      }
    }

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: successUrl || 'https://slctrips.com/success?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: cancelUrl || 'https://slctrips.com/cancel',
        customer_email: customerEmail,
        metadata: {
          source: 'slctrips'
        }
      })
      return { success: true, session }
    } catch (error) {
      console.error('Stripe checkout session error:', error)
      return { success: false, error }
    }
  },

  async createOneTimePayment(priceId: string, customerEmail: string, productName: string) {
    if (!stripe) {
      console.log(`Would create one-time payment for ${productName} (Stripe not configured)`)
      return { 
        success: true, 
        session: { 
          id: 'mock_payment_id', 
          url: 'https://checkout.stripe.com/mock' 
        },
        message: 'Payment logged (Stripe not configured)'
      }
    }

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: 'https://slctrips.com/success?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: 'https://slctrips.com/cancel',
        customer_email: customerEmail,
        metadata: {
          source: 'slctrips',
          product: productName
        }
      })
      return { success: true, session }
    } catch (error) {
      console.error('Stripe one-time payment error:', error)
      return { success: false, error }
    }
  },

  async cancelSubscription(subscriptionId: string) {
    if (!stripe) {
      console.log(`Would cancel subscription: ${subscriptionId} (Stripe not configured)`)
      return { 
        success: true, 
        subscription: { id: subscriptionId, status: 'canceled' },
        message: 'Cancellation logged (Stripe not configured)'
      }
    }

    try {
      const subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true
      })
      return { success: true, subscription }
    } catch (error) {
      console.error('Stripe subscription cancellation error:', error)
      return { success: false, error }
    }
  },

  async reactivateSubscription(subscriptionId: string) {
    if (!stripe) {
      console.log(`Would reactivate subscription: ${subscriptionId} (Stripe not configured)`)
      return { 
        success: true, 
        subscription: { id: subscriptionId, status: 'active' },
        message: 'Reactivation logged (Stripe not configured)'
      }
    }

    try {
      const subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: false
      })
      return { success: true, subscription }
    } catch (error) {
      console.error('Stripe subscription reactivation error:', error)
      return { success: false, error }
    }
  },

  async getCustomerSubscriptions(customerId: string) {
    if (!stripe) {
      console.log(`Would get subscriptions for customer: ${customerId} (Stripe not configured)`)
      return { 
        success: true, 
        subscriptions: [],
        message: 'Subscriptions logged (Stripe not configured)'
      }
    }

    try {
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: 'all'
      })
      return { success: true, subscriptions: subscriptions.data }
    } catch (error) {
      console.error('Stripe get subscriptions error:', error)
      return { success: false, error }
    }
  },

  async createPaymentIntent(amount: number, currency: string = 'usd', customerId?: string) {
    if (!stripe) {
      console.log(`Would create payment intent: ${amount} ${currency} (Stripe not configured)`)
      return { 
        success: true, 
        paymentIntent: { 
          id: 'mock_payment_intent_id', 
          client_secret: 'mock_client_secret' 
        },
        message: 'Payment intent logged (Stripe not configured)'
      }
    }

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        customer: customerId,
        metadata: {
          source: 'slctrips'
        }
      })
      return { success: true, paymentIntent }
    } catch (error) {
      console.error('Stripe payment intent error:', error)
      return { success: false, error }
    }
  },

  async handleWebhook(payload: string, signature: string) {
    if (!stripe) {
      console.log(`Would handle Stripe webhook (Stripe not configured)`)
      return { 
        success: true, 
        event: { type: 'mock_event' },
        message: 'Webhook logged (Stripe not configured)'
      }
    }

    try {
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      )
      return { success: true, event }
    } catch (error) {
      console.error('Stripe webhook verification error:', error)
      return { success: false, error }
    }
  }
}

export { PLANS } 