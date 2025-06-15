'use client'

import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import { Product } from './products'

export interface CartItem {
  product: Product
  quantity: number
  selectedSize?: string
  selectedColor?: string
}

interface CartState {
  items: CartItem[]
  total: number
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; size?: string; color?: string } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string; size?: string; color?: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number; size?: string; color?: string } }
  | { type: 'CLEAR_CART' }

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
} | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, size, color } = action.payload
      const existingItemIndex = state.items.findIndex(
        item => 
          item.product.id === product.id && 
          item.selectedSize === size && 
          item.selectedColor === color
      )

      if (existingItemIndex > -1) {
        const updatedItems = [...state.items]
        updatedItems[existingItemIndex].quantity += 1
        return {
          items: updatedItems,
          total: calculateTotal(updatedItems)
        }
      }

      const newItem: CartItem = {
        product,
        quantity: 1,
        selectedSize: size,
        selectedColor: color
      }

      const updatedItems = [...state.items, newItem]
      return {
        items: updatedItems,
        total: calculateTotal(updatedItems)
      }
    }

    case 'REMOVE_ITEM': {
      const { productId, size, color } = action.payload
      const updatedItems = state.items.filter(
        item => !(
          item.product.id === productId && 
          item.selectedSize === size && 
          item.selectedColor === color
        )
      )
      return {
        items: updatedItems,
        total: calculateTotal(updatedItems)
      }
    }

    case 'UPDATE_QUANTITY': {
      const { productId, quantity, size, color } = action.payload
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: { productId, size, color } })
      }

      const updatedItems = state.items.map(item =>
        item.product.id === productId && 
        item.selectedSize === size && 
        item.selectedColor === color
          ? { ...item, quantity }
          : item
      )

      return {
        items: updatedItems,
        total: calculateTotal(updatedItems)
      }
    }

    case 'CLEAR_CART':
      return {
        items: [],
        total: 0
      }

    default:
      return state
  }
}

function calculateTotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + (item.product.price * item.quantity), 0)
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0
  })

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
