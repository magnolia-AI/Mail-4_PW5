'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { formatPrice } from '@/lib/products'
import { useToast } from '@/hooks/use-toast'

export default function CartPage() {
  const { state, dispatch } = useCart()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const updateQuantity = (productId: string, quantity: number, size?: string, color?: string) => {
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { productId, quantity, size, color }
    })
  }

  const removeItem = (productId: string, size?: string, color?: string) => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: { productId, size, color }
    })
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart.",
    })
  }

  const proceedToCheckout = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: state.items.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
            size: item.selectedSize,
            color: item.selectedColor
          }))
        }),
      })

      const { url } = await response.json()
      
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (state.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <ShoppingCart className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link href="/">
            <Button size="lg" className="rounded-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" />
          Continue Shopping
        </Link>
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <p className="text-muted-foreground">
          {state.items.length} {state.items.length === 1 ? 'item' : 'items'} in your cart
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {state.items.map((item, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-24 w-24 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg">{item.product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {item.selectedColor} • {item.selectedSize}
                    </p>
                    <p className="text-lg font-bold text-primary">
                      {formatPrice(item.product.price)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.product.id, item.selectedSize, item.selectedColor)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedSize, item.selectedColor)}
                        disabled={item.quantity <= 1}
                        className="h-8 w-8"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedSize, item.selectedColor)}
                        className="h-8 w-8"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {state.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="truncate mr-2">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span>{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(state.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatPrice(Math.round(state.total * 0.08))}</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatPrice(state.total + Math.round(state.total * 0.08))}</span>
              </div>
              
              <Button 
                className="w-full text-lg py-6 rounded-full hover:scale-105 transition-transform"
                onClick={proceedToCheckout}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Proceed to Checkout'}
              </Button>
              
              <div className="text-center text-sm text-muted-foreground">
                <p>Secure checkout powered by Stripe</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
