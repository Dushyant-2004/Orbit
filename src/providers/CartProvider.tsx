'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { Cart, CartItem, Product } from '@/types';
import toast from 'react-hot-toast';

interface CartContextType {
  cart: Cart;
  items: CartItem[];
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  cartOpen: boolean;
  itemCount: number;
  addToCart: (product: Product, quantity?: number, variants?: Record<string, string>) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

const CART_STORAGE_KEY = 'orbit-cart';
const TAX_RATE = 0.08;
const FREE_SHIPPING_THRESHOLD = 100;
const SHIPPING_COST = 9.99;

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<Cart>({
    items: [],
    subtotal: 0,
    tax: 0,
    shipping: 0,
    discount: 0,
    total: 0,
  });
  const [cartOpen, setCartOpen] = useState(false);

  // Calculate cart totals
  const calculateTotals = useCallback((items: CartItem[], discountPercent: number = 0): Cart => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = (subtotal * discountPercent) / 100;
    const afterDiscount = subtotal - discount;
    const tax = afterDiscount * TAX_RATE;
    const shipping = afterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : items.length > 0 ? SHIPPING_COST : 0;
    const total = afterDiscount + tax + shipping;

    return {
      items,
      subtotal,
      tax,
      shipping,
      discount,
      total,
      couponCode: discountPercent > 0 ? cart.couponCode : undefined,
    };
  }, [cart.couponCode]);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        setCart(parsed);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }, [cart]);

  // Item count
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  // Add to cart
  const addToCart = (product: Product, quantity: number = 1, variants?: Record<string, string>) => {
    setCart((prev) => {
      const existingIndex = prev.items.findIndex(
        (item) =>
          item.productId === product._id &&
          JSON.stringify(item.selectedVariants) === JSON.stringify(variants)
      );

      let newItems: CartItem[];

      if (existingIndex >= 0) {
        newItems = prev.items.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const newItem: CartItem = {
          id: `${product._id}-${Date.now()}`,
          productId: product._id,
          product,
          name: product.name,
          price: product.price,
          image: product.images[0] || '',
          quantity,
          selectedVariants: variants,
        };
        newItems = [...prev.items, newItem];
      }

      return calculateTotals(newItems, prev.discount > 0 ? (prev.discount / prev.subtotal) * 100 : 0);
    });

    toast.success(`${product.name} added to cart`);
    setCartOpen(true);
  };

  // Remove from cart
  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const newItems = prev.items.filter((item) => item.productId !== productId);
      return calculateTotals(newItems, prev.discount > 0 ? (prev.discount / prev.subtotal) * 100 : 0);
    });
    toast.success('Item removed from cart');
  };

  // Update quantity
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCart((prev) => {
      const newItems = prev.items.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      );
      return calculateTotals(newItems, prev.discount > 0 ? (prev.discount / prev.subtotal) * 100 : 0);
    });
  };

  // Clear cart
  const clearCart = () => {
    setCart({
      items: [],
      subtotal: 0,
      tax: 0,
      shipping: 0,
      discount: 0,
      total: 0,
    });
    toast.success('Cart cleared');
  };

  // Apply coupon
  const applyCoupon = async (code: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal: cart.subtotal }),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message || 'Invalid coupon code');
        return false;
      }

      const { discount } = await response.json();
      setCart((prev) => ({
        ...calculateTotals(prev.items, discount),
        couponCode: code,
      }));

      toast.success(`Coupon applied! ${discount}% off`);
      return true;
    } catch (error) {
      console.error('Error applying coupon:', error);
      toast.error('Failed to apply coupon');
      return false;
    }
  };

  // Remove coupon
  const removeCoupon = () => {
    setCart((prev) => ({
      ...calculateTotals(prev.items, 0),
      couponCode: undefined,
    }));
    toast.success('Coupon removed');
  };

  // Cart visibility
  const toggleCart = () => setCartOpen((prev) => !prev);
  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);

  const value: CartContextType = {
    cart,
    items: cart.items,
    total: cart.total,
    subtotal: cart.subtotal,
    tax: cart.tax,
    shipping: cart.shipping,
    discount: cart.discount,
    cartOpen,
    itemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    toggleCart,
    openCart,
    closeCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
