'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { ShoppingCart, Star, Heart, Share2, ArrowLeft, Truck, Shield, RotateCcw } from 'lucide-react'
import { getProductById, formatPrice } from '@/lib/products'
import { useCart } from '@/lib/cart-context'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

export default function ProductPage() {
  const params = useParams()
  const productId = params.id as string
  const product = getProductById(productId)
  
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  
  const { dispatch } = useCart()
  const { toast } = useToast()

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0])
      setSelectedColor(product.colors[0])
      setIsLoading(false)
    }
  }, [product])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Link href="/">
            <Button>Back to Shop</Button>
          </Link>
        </div>
      </div>
    )
  }

  const addToCart = () => {
    dispatch({ 
      type: 'ADD_ITEM', 
      payload: { 
        product, 
        size: selectedSize, 
        color: selectedColor 
      } 
    })
    toast({
      title: "Added to cart!",
      description: `${product.name} (${selectedColor}, ${selectedSize}) has been added to your cart.`,
    })
  }

  const getColorStyle = (color: string) => {
    const colorMap: { [key: string]: string } = {
      'white': '#ffffff',
      'black': '#000000',
      'navy': '#1e3a8a',
      'red': '#dc2626',
      'gray': '#6b7280',
      'brown': '#92400e',
      'olive': '#65a30d',
      'khaki': '#a3a3a3',
      'burgundy': '#7c2d12',
      'cream': '#fef3c7'
    }
    return colorMap[color.toLowerCase()] || '#6b7280'
  }

  return (
    <div className="min-h-full">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Shop
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <Card className="overflow-hidden border-0 shadow-lg">
              <div className="relative group">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-96 lg:h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full bg-background/90 backdrop-blur-sm hover:bg-background"
                    onClick={() => setIsFavorite(!isFavorite)}
                  >
                    <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full bg-background/90 backdrop-blur-sm hover:bg-background"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <Badge variant="outline" className="mb-2">
                {product.category}
              </Badge>
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">(4.8) • 127 reviews</span>
              </div>
              <p className="text-3xl font-bold text-primary mb-4">
                {formatPrice(product.price)}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <Separator />

            {/* Size Selection */}
            {product.sizes.length > 1 && (
              <div className="space-y-3">
                <label className="text-sm font-medium">Size</label>
                <div className="flex gap-2">
                  {product.sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSize(size)}
                      className="min-w-[60px]"
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Color: {selectedColor}</label>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === color 
                        ? 'border-primary ring-2 ring-primary/20' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    style={{ backgroundColor: getColorStyle(color) }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Quantity</label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            <Separator />

            {/* Add to Cart */}
            <div className="space-y-4">
              <Button 
                size="lg" 
                className="w-full text-lg py-6 rounded-full hover:scale-105 transition-transform"
                onClick={addToCart}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart - {formatPrice(product.price * quantity)}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full text-lg py-6 rounded-full hover:scale-105 transition-transform"
              >
                Buy Now
              </Button>
            </div>

            <Separator />

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Truck className="h-5 w-5 text-muted-foreground" />
                <span>Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <RotateCcw className="h-5 w-5 text-muted-foreground" />
                <span>30-day return policy</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <span>2-year warranty included</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Card>
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold mb-4">Product Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium mb-2">Materials</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Premium cotton blend with reinforced stitching for durability and comfort.
                  </p>
                  
                  <h4 className="font-medium mb-2">Care Instructions</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Hand wash in cold water</li>
                    <li>• Air dry only</li>
                    <li>• Do not bleach</li>
                    <li>• Store in a cool, dry place</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Specifications</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Available sizes: {product.sizes.join(', ')}</li>
                    <li>• Available colors: {product.colors.join(', ')}</li>
                    <li>• Weight: 150g</li>
                    <li>• Made in USA</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
