export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  sizes: string[]
  colors: string[]
  stripeProductId?: string
  stripePriceId?: string
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Classic Baseball Cap',
    description: 'A timeless baseball cap made from premium cotton with an adjustable strap. Perfect for everyday wear and outdoor activities.',
    price: 2999, // Price in cents
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&h=500&fit=crop',
    category: 'Baseball Caps',
    sizes: ['One Size'],
    colors: ['Black', 'Navy', 'White', 'Red'],
    stripeProductId: 'prod_classic_baseball_cap',
    stripePriceId: 'price_classic_baseball_cap'
  },
  {
    id: '2',
    name: 'Premium Snapback',
    description: 'High-quality snapback hat with embroidered logo. Features a flat brim and structured crown for a modern streetwear look.',
    price: 3499,
    image: 'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=500&h=500&fit=crop',
    category: 'Snapbacks',
    sizes: ['One Size'],
    colors: ['Black', 'Gray', 'Navy', 'Olive'],
    stripeProductId: 'prod_premium_snapback',
    stripePriceId: 'price_premium_snapback'
  },
  {
    id: '3',
    name: 'Wool Fedora',
    description: 'Elegant wool fedora hat perfect for formal occasions. Handcrafted with attention to detail and a classic silhouette.',
    price: 7999,
    image: 'https://images.unsplash.com/photo-1514327605112-b887c0e61c4a?w=500&h=500&fit=crop',
    category: 'Fedoras',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Brown', 'Gray'],
    stripeProductId: 'prod_wool_fedora',
    stripePriceId: 'price_wool_fedora'
  },
  {
    id: '4',
    name: 'Summer Bucket Hat',
    description: 'Lightweight bucket hat perfect for summer adventures. UV protection and breathable fabric keep you cool and protected.',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=500&h=500&fit=crop',
    category: 'Bucket Hats',
    sizes: ['S', 'M', 'L'],
    colors: ['Khaki', 'Navy', 'Olive', 'White'],
    stripeProductId: 'prod_summer_bucket',
    stripePriceId: 'price_summer_bucket'
  },
  {
    id: '5',
    name: 'Vintage Trucker Hat',
    description: 'Retro-style trucker hat with mesh back for breathability. Features vintage-inspired graphics and a comfortable fit.',
    price: 2799,
    image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=500&h=500&fit=crop',
    category: 'Trucker Hats',
    sizes: ['One Size'],
    colors: ['Black/White', 'Navy/Gray', 'Red/White'],
    stripeProductId: 'prod_vintage_trucker',
    stripePriceId: 'price_vintage_trucker'
  },
  {
    id: '6',
    name: 'Luxury Beret',
    description: 'Sophisticated wool beret with a French-inspired design. Perfect for adding elegance to any outfit.',
    price: 4999,
    image: 'https://images.unsplash.com/photo-1506629905607-d405d7d3b0d2?w=500&h=500&fit=crop',
    category: 'Berets',
    sizes: ['One Size'],
    colors: ['Black', 'Navy', 'Burgundy', 'Cream'],
    stripeProductId: 'prod_luxury_beret',
    stripePriceId: 'price_luxury_beret'
  }
]

export const categories = [
  'All',
  'Baseball Caps',
  'Snapbacks',
  'Fedoras',
  'Bucket Hats',
  'Trucker Hats',
  'Berets'
]

export function getProductById(id: string): Product | undefined {
  return products.find(product => product.id === id)
}

export function getProductsByCategory(category: string): Product[] {
  if (category === 'All') return products
  return products.filter(product => product.category === category)
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price / 100)
}
