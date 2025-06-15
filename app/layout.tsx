import './globals.css'
import type { Metadata } from 'next'
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from '@/components/theme-provider'
import { CartProvider } from '@/lib/cart-context'
import { Navigation } from '@/components/navigation'

export const metadata: Metadata = {
  title: 'Premium Hat Collection - Elevate Your Style',
  description: 'Discover our curated collection of premium hats. From classic baseball caps to elegant fedoras, find the perfect hat for every occasion.',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="h-full flex flex-col antialiased">
        <ThemeProvider defaultTheme="light" attribute="class">
          <CartProvider>
            <Navigation />
            <main className="flex-1">
              {children}
            </main>
            <Toaster />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
