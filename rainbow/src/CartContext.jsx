import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [cartTotals, setCartTotals] = useState({ total_items: 0, cart_total: 0 });
  const { user } = useAuth();

  const fetchCartData = async () => {
    if (!user) return;
    try {
      const response = await fetch(`http://localhost:3009/api/cart/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${user.token || ''}`
        }
      });
      const data = await response.json();
      setCartItems(data.items || []);
      setCartTotals(data.totals || { total_items: 0, cart_total: 0 });
      setCartCount(data.totals?.total_items || 0);
    } catch (error) {
      console.error('Error fetching cart data:', error);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, [user]);

  const clearCart = () => {
    setCartItems([]);
    setCartTotals({ total_items: 0, cart_total: 0 });
    setCartCount(0);
  };

  return (
    <CartContext.Provider value={{ 
      cartCount, 
      cartItems,
      cartTotals,
      setCartItems, 
      setCartTotals, 
      clearCart,     
      fetchCartCount: fetchCartData, 
      updateCart: fetchCartData 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);