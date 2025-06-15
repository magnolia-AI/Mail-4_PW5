import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { getProductById } from '@/lib/products'

export async function POST(request: NextRequest) {
  try {
    const { items } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 })
    }

    // Create line items for Stripe
    const lineItems = items.map((item: any) => {
      const product = getProductById(item.productId)
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`)
      }

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            description: `${product.description} - ${item.color} - ${item.size}`,
            images: [product.image],
            metadata: {
              productId: product.id,
              size: item.size,
              color: item.color,
            },
          },
          unit_amount: product.price,
        },
        quantity: item.quantity,
      }
    })

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${request.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/cart`,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 0,
              currency: 'usd',
            },
            display_name: 'Free shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 5,
              },
              maximum: {
                unit: 'business_day',
                value: 7,
              },
            },
          },
        },
      ],
      automatic_tax: {
        enabled: true,
      },
      metadata: {
        orderItems: JSON.stringify(items),
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    )
  }
}
