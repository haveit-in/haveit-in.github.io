import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext.jsx'
import { useToast } from './ToastContext.jsx'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const [restaurant, setRestaurant] = useState(null)
  const [showConflictModal, setShowConflictModal] = useState(false)
  const [pendingRestaurant, setPendingRestaurant] = useState(null)
  const { getAuthHeaders } = useAuth()
  const toast = useToast()

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    const savedRestaurant = localStorage.getItem('cartRestaurant')
    
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (e) {
        console.error('Failed to parse saved cart:', e)
      }
    }
    
    if (savedRestaurant) {
      try {
        setRestaurant(JSON.parse(savedRestaurant))
      } catch (e) {
        console.error('Failed to parse saved restaurant:', e)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    if (restaurant) {
      localStorage.setItem('cartRestaurant', JSON.stringify(restaurant))
    } else {
      localStorage.removeItem('cartRestaurant')
    }
  }, [restaurant])

  // Add item to cart
  const addToCart = useCallback((item, itemRestaurant) => {
    // Check for restaurant conflict
    if (restaurant && restaurant.id !== itemRestaurant.id) {
      setPendingRestaurant(itemRestaurant)
      setShowConflictModal(true)
      return false
    }

    setRestaurant(itemRestaurant)
    setCart(prev => {
      const existingItem = prev[item.id]
      if (existingItem) {
        toast.success(`${item.name} quantity updated`)
        return {
          ...prev,
          [item.id]: {
            ...existingItem,
            quantity: existingItem.quantity + 1,
            addedAt: new Date().toISOString()
          }
        }
      } else {
        toast.success(`${item.name} added to cart`)
        return {
          ...prev,
          [item.id]: {
            ...item,
            quantity: 1,
            addedAt: new Date().toISOString()
          }
        }
      }
    })
    return true
  }, [restaurant, toast])

  // Update item quantity
  const updateQuantity = useCallback((itemId, change) => {
    setCart(prev => {
      const item = prev[itemId]
      if (!item) return prev

      const newQuantity = item.quantity + change
      if (newQuantity <= 0) {
        toast.success(`${item.name} removed from cart`)
        const { [itemId]: removed, ...rest } = prev
        return rest
      }

      return {
        ...prev,
        [itemId]: {
          ...item,
          quantity: newQuantity
        }
      }
    })
  }, [toast])

  // Remove item from cart
  const removeFromCart = useCallback((itemId) => {
    setCart(prev => {
      const { [itemId]: removed, ...rest } = prev
      return rest
    })
  }, [])

  // Clear entire cart
  const clearCart = useCallback(() => {
    setCart({})
    setRestaurant(null)
    localStorage.removeItem('cart')
    localStorage.removeItem('cartRestaurant')
  }, [])

  // Replace cart with new restaurant (for conflict resolution)
  const replaceCart = useCallback((newRestaurant) => {
    setCart({})
    setRestaurant(newRestaurant)
    setShowConflictModal(false)
    setPendingRestaurant(null)
    localStorage.removeItem('cart')
  }, [])

  // Get cart totals
  const getCartTotals = useCallback(() => {
    const items = Object.values(cart)
    const subtotal = items.reduce((sum, item) => {
      const price = item.discount_price || item.price
      return sum + (price * item.quantity)
    }, 0)
    
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
    
    // Calculate delivery fee and GST (these would normally come from API)
    const deliveryFee = restaurant?.delivery_fee || 0
    const gst = subtotal * 0.05 // 5% GST
    const total = subtotal + deliveryFee + gst

    return {
      subtotal,
      deliveryFee,
      gst,
      total,
      itemCount,
      items
    }
  }, [cart, restaurant])

  // Check if cart is empty
  const isEmpty = useCallback(() => {
    return Object.keys(cart).length === 0
  }, [cart])

  // Get minimum order info
  const getMinimumOrderInfo = useCallback(() => {
    if (!restaurant) return { met: true, remaining: 0 }
    
    const { subtotal } = getCartTotals()
    const minimumOrder = restaurant.minimum_order || 0
    const remaining = Math.max(0, minimumOrder - subtotal)
    
    return {
      met: remaining === 0,
      remaining,
      minimumOrder
    }
  }, [restaurant, getCartTotals])

  const value = {
    cart,
    restaurant,
    showConflictModal,
    pendingRestaurant,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    replaceCart,
    getCartTotals,
    isEmpty,
    getMinimumOrderInfo,
    setShowConflictModal
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}
