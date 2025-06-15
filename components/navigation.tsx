'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { formatPrice } from '@/lib/products'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { state } = useCart()
  
  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">H</span>
            </div>
            <span className="font-bold text-xl">HatCo</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Shop
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
              Contact
            </Link>
          </div>

          {/* Cart */}
          <div className="flex items-center space-x-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <ShoppingCart className="h-4 w-4" />
                  {totalItems > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg">
                <SheetHeader>
                  <SheetTitle>Shopping Cart ({totalItems} items)</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {state.items.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Your cart is empty</p>
                      <Link href="/">
                        <Button className="mt-4">Continue Shopping</Button>
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {state.items.map((item, index) => (
                          <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="h-16 w-16 object-cover rounded"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium truncate">{item.product.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {item.selectedColor} • {item.selectedSize}
                              </p>
                              <p className="text-sm font-medium">
                                {formatPrice(item.product.price)} × {item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="border-t pt-4 space-y-4">
                        <div className="flex justify-between text-lg font-semibold">
                          <span>Total: {formatPrice(state.total)}</span>
                        </div>
                        <div className="space-y-2">
                          <Link href="/cart" className="w-full">
                            <Button className="w-full">View Cart</Button>
                          </Link>
                          <Link href="/checkout" className="w-full">
                            <Button variant="outline" className="w-full">Checkout</Button>
                          </Link>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <Link 
                    href="/" 
                    className="block text-lg font-medium hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Shop
                  </Link>
                  <Link 
                    href="/about" 
                    className="block text-lg font-medium hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    About
                  </Link>
                  <Link 
                    href="/contact" 
                    className="block text-lg font-medium hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Contact
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
