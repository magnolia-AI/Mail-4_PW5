'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, Star, Filter } from 'lucide-react';
import { products, categories, formatPrice, getProductsByCategory } from '@/lib/products';
import { useCart } from '@/lib/cart-context';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [isLoading, setIsLoading] = useState(true);
  const { dispatch } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    setFilteredProducts(getProductsByCategory(selectedCategory));
  }, [selectedCategory]);

  useEffect(() => {
    // Simulate loading for smooth animations
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const addToCart = (product: any, size?: string, color?: string) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        product,
        size: size || product.sizes[0],
        color: color || product.colors[0]
      }
    });
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>);

  }

  return (
    <div className="min-h-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        <div className="container mx-auto px-4 pt-24 pb-20 relative">
          <div className="max-w-[800px] mx-auto text-center">
            <div className="animate-fade-in-up">
              <Badge variant="outline" className="mb-4 text-sm px-3 py-1">
                Premium Hat Collection
              </Badge>
              <h1 className="text-5xl font-bold tracking-tight lg:text-7xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Elevate
              </h1>
              <p className="mt-6 text-xl text-muted-foreground max-w-[600px] mx-auto leading-relaxed">
                Discover our curated collection of premium hats. From classic baseball caps to elegant fedoras, find the perfect hat for every occasion.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-6 rounded-full hover:scale-105 transition-transform">
                  Shop Collection
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 rounded-full hover:scale-105 transition-transform">
                  View Lookbook
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">Filter by category:</span>
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) =>
              <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product, index) =>
          <Card
            key={product.id}
            className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-card/50 backdrop-blur-sm"
            style={{
              animationDelay: `${index * 100}ms`,
              animation: 'fade-in-up 0.6s ease-out forwards'
            }}>

              <div className="relative overflow-hidden">
                <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110" />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Badge
                variant="secondary"
                className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm">

                  {product.category}
                </Badge>
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-background/90 backdrop-blur-sm rounded-full px-2 py-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium">4.8</span>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(product.price)}
                    </span>
                    <div className="flex gap-1">
                      {product.colors.slice(0, 3).map((color, i) =>
                    <div
                      key={i}
                      className="w-4 h-4 rounded-full border-2 border-background shadow-sm"
                      style={{
                        backgroundColor: color.toLowerCase() === 'white' ? '#ffffff' :
                        color.toLowerCase() === 'black' ? '#000000' :
                        color.toLowerCase() === 'navy' ? '#1e3a8a' :
                        color.toLowerCase() === 'red' ? '#dc2626' :
                        color.toLowerCase() === 'gray' ? '#6b7280' :
                        color.toLowerCase() === 'brown' ? '#92400e' :
                        color.toLowerCase() === 'olive' ? '#65a30d' :
                        color.toLowerCase() === 'khaki' ? '#a3a3a3' :
                        color.toLowerCase() === 'burgundy' ? '#7c2d12' :
                        color.toLowerCase() === 'cream' ? '#fef3c7' : '#6b7280'
                      }} />

                    )}
                      {product.colors.length > 3 &&
                    <span className="text-xs text-muted-foreground ml-1">
                          +{product.colors.length - 3}
                        </span>
                    }
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                    className="flex-1 rounded-full hover:scale-105 transition-transform"
                    onClick={() => addToCart(product)}>

                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Link href={`/product/${product.id}`}>
                      <Button variant="outline" className="rounded-full hover:scale-105 transition-transform">
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay in Style</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Subscribe to our newsletter for the latest hat trends and exclusive offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-full border border-border bg-background" />

            <Button className="rounded-full px-8 hover:scale-105 transition-transform">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>);

}
