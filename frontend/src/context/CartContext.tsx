import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

interface CartItem {
  productId: number;
  name: string;
  price: number;
  qty: number;
  _id?: string;
}

interface Cart {
  items: CartItem[];
  total: number;
}

interface CartContextType {
  cart: Cart;
  fetchCart: () => Promise<void>;
  addToCart: (productId: number, name: string, price: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  clearCart;
  checkout: (customerData: { name: string; email: string }) => Promise<any>;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const API_BASE = 'http://localhost:5000';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 });
  const [isLoading, setIsLoading] = useState(false);

  const fetchCart = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/cart`);
      if (response.ok) {
        const data = await response.json();
        setCart({
          items: data.items || [],
          total: parseFloat(data.total) || 0,
        });
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };

  const addToCart = async (productId: number, name: string, price: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, qty: 1 }),
      });

      if (response.ok) {
        const data = await response.json();
        setCart({
          items: data.items || [],
          total: parseFloat(data.total) || 0,
        });
        toast.success(`${name} added to cart!`);
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to add item to cart');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
      console.error('Add to cart error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/cart/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const data = await response.json();
        setCart({
          items: data.items || [],
          total: parseFloat(data.total) || 0,
        });
        toast.success('Item removed from cart');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to remove item');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
      console.error('Remove from cart error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkout = async (customerData: { name: string; email: string }) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerData),
      });

      if (response.ok) {
        const receipt = await response.json();
        return receipt;
      } else {
        const error = await response.json();
        toast.error(error.message || 'Checkout failed');
        throw new Error(error.message);
      }
    } catch (error) {
      toast.error('Checkout failed. Please try again.');
      console.error('Checkout error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = () => {
    setCart({ items: [], total: 0 });
    toast.success('Cart cleared');
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider value={{ cart, fetchCart, addToCart, removeFromCart, checkout, clearCart,isLoading }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
