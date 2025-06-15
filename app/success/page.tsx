'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Package, Truck, Mail } from 'lucide-react'
import { useCart } from '@/lib/cart-context'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const { dispatch } = useCart()
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Clear the cart after successful payment
    dispatch({ type: 'CLEAR_CART' })

    // In a real app, you would fetch order details from your backend
    // For now, we'll simulate this
    const timer = setTimeout(() => {
      setOrderDetails({
        orderNumber: `ORD-${Date.now()}`,
        email: 'customer@example.com',
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
      })
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [dispatch])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
        </div>

        {/* Order Details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Order Number</p>
                <p className="font-semibold">{orderDetails?.orderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-semibold">{orderDetails?.email}</p>
              </div>
            </div>
            {sessionId && (
              <div>
                <p className="text-sm text-muted-foreground">Payment ID</p>
                <p className="font-mono text-sm">{sessionId}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* What's Next */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold">Order Confirmation Email</h3>
                <p className="text-sm text-muted-foreground">
                  You'll receive an email confirmation with your order details shortly.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Package className="h-4 w-4 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold">Order Processing</h3>
                <p className="text-sm text-muted-foreground">
                  We'll start processing your order within 1-2 business days.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Truck className="h-4 w-4 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold">Shipping & Delivery</h3>
                <p className="text-sm text-muted-foreground">
                  Estimated delivery: {orderDetails?.estimatedDelivery}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Continue Shopping
            </Button>
          </Link>
          <Button size="lg" className="w-full sm:w-auto">
            Track Your Order
          </Button>
        </div>

        {/* Support */}
        <div className="text-center mt-8 p-6 bg-muted/30 rounded-lg">
          <h3 className="font-semibold mb-2">Need Help?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            If you have any questions about your order, feel free to contact our support team.
          </p>
          <Button variant="outline" size="sm">
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  )
}
