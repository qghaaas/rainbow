import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext'

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const { user } = useAuth(); 
  const fetchCartCount = async () => {
    if (!user) return;
    try {
      const response = await fetch(`http://localhost:3009/api/cart/${user.id}`);
      const data = await response.json();
      setCartCount(data.totals?.total_items || 0);
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, [user]); 

  return (
    <CartContext.Provider value={{ cartCount, fetchCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
