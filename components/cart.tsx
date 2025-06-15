'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ShoppingCart, Plus, Minus, X, CreditCard } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { formatPrice } from '@/lib/products'
import { useToast } from '@/hooks/use-toast'

export function CartSheet() {
  const { state, dispatch } = useCart()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)

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

      if (response.ok) {
        const { url } = await response.json()
        window.location.href = url
      } else {
        throw new Error('Failed to create checkout session')
      }
    } catch (error) {
      toast({
        title: "Checkout Error",
        description: "There was an error processing your checkout. Please try again.",
        variant: "destructive"
      })
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-4 w-4" />
          {state.items.length > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {state.items.reduce((total, item) => total + item.quantity, 0)}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Shopping Cart ({state.items.length})
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col h-full">
          {state.items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Your cart is empty</p>
                <Button 
                  className="mt-4" 
                  onClick={() => setIsOpen(false)}
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {state.items.map((item, index) => (
                  <Card key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${index}`}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium text-sm">{item.product.name}</h4>
                              <div className="flex gap-2 text-xs text-muted-foreground">
                                {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                                {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => removeItem(item.product.id, item.selectedSize, item.selectedColor)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => updateQuantity(
                                  item.product.id, 
                                  item.quantity - 1, 
                                  item.selectedSize, 
                                  item.selectedColor
                                )}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-sm font-medium w-8 text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => updateQuantity(
                                  item.product.id, 
                                  item.quantity + 1, 
                                  item.selectedSize, 
                                  item.selectedColor
                                )}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <span className="font-medium text-sm">
                              {formatPrice(item.product.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="border-t pt-4 space-y-4">
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>{formatPrice(state.total)}</span>
                </div>
                
                <Button 
                  className="w-full text-lg py-6 rounded-full hover:scale-105 transition-transform"
                  onClick={proceedToCheckout}
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  Checkout - {formatPrice(state.total)}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setIsOpen(false)}
                >
                  Continue Shopping
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
