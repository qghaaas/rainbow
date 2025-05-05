import '../main.css'
import './BasketPage.css'
import { Link } from 'react-router-dom'
import arrowleft from './img/arrowleft.svg'
import favorite from '../ProductPage/img/favorite.svg'
import trash from './img/trash.svg'
import Catalog from '../HomePage/Сatalog'
import React, { useState, useEffect } from 'react'
import { useCart } from '../CartContext'
import { useAuth } from '../AuthContext'
import { useNavigate } from 'react-router-dom';

export default function BasketPage() {
    const [cartItems, setCartItems] = useState([]);
    const [totals, setTotals] = useState({ total_items: 0, cart_total: 0 });
    const { user } = useAuth();
    const [isUpdating, setIsUpdating] = useState(false);
    const { fetchCartCount } = useCart();
    const navigate = useNavigate();

    const handleCheckout = async () => {
        try {
            const orderData = {
                user_id: user.id,
                items: cartItems.map(item => ({
                    product_id: item.product_id, 
                    quantity: item.quantity
                })),
                total: totals.cart_total
            };
    
            const response = await fetch('http://localhost:3009/api/orders', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token || ''}`
                },
                body: JSON.stringify(orderData)
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Ошибка оформления заказа');
            }
            
            await Promise.all(cartItems.map(item => 
                fetch(`http://localhost:3009/api/cart/remove/${item.id}`, { 
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${user.token || ''}`
                    }
                })
            ));
            
            navigate('/paymentpage');
        } catch (error) {
            console.error('Ошибка оформления заказа:', error);
            alert(error.message);
        }
    };

    const fetchCartData = async () => {
        try {
            const response = await fetch(`http://localhost:3009/api/cart/${user.id}`);
            const data = await response.json();
            setCartItems(data.items);
            setTotals(data.totals);
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    };

    useEffect(() => {
        fetchCartData();
    }, [user.id]);

    const updateQuantity = async (cartId, newQuantity) => {
        if (newQuantity < 1 || isUpdating) return;

        setIsUpdating(true);
        const prevItems = [...cartItems];
        const prevTotals = { ...totals };

        try {
            const updatedItems = cartItems.map(item =>
                item.id === cartId
                    ? {
                        ...item,
                        quantity: newQuantity,
                        item_total: item.price_at_adding * newQuantity
                    }
                    : item
            );

            setCartItems(updatedItems);

            const newTotalItems = updatedItems.reduce(
                (count, item) => count + item.quantity,
                0
            );
            const newCartTotal = updatedItems.reduce(
                (sum, item) => sum + item.item_total,
                0
            );

            setTotals({
                total_items: newTotalItems,
                cart_total: newCartTotal
            });

            const response = await fetch('http://localhost:3009/api/cart/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cart_id: cartId,
                    quantity: newQuantity
                })
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.error || responseData.details || 'Unknown error');
            }

            await fetchCartCount();
            await fetchCartData();
        } catch (error) {
            console.error('Error details:', {
                error: error.message,
                cartId,
                newQuantity,
                cartItems
            });
            alert(`Ошибка: ${error.message}`);
        } finally {
            setIsUpdating(false);
        }
    };

    const removeItem = async (cartId) => {
        try {
            await fetch(`http://localhost:3009/api/cart/remove/${cartId}`, {
                method: 'DELETE'
            });
            await fetchCartCount();
            await fetchCartData();
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };


    const handleAddToFavorites = async (item) => {
        try {
            const product = {
                id: item.product_id,
                name: item.product_name,
                price: item.price_at_adding,
                image: item.image_path
            };

            const response = await fetch('http://localhost:3009/api/add-favorite', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, product })
            });

            const data = await response.json();
            alert(data.message || 'Добавлено в избранное');
        } catch (error) {
            console.error('Ошибка при добавлении в избранное:', error);
        }
    };
    return (
        <section className="basketpage">
            <div className="container">
                <div className="basketpage-inner">
                    <div className='navigation navigation-bas'>
                        <img src={arrowleft} alt="" />
                        <Link to='/Главная'>Вернуться к покупакам</Link>
                    </div>

                    <h2>Корзина</h2>
                    <div className="basketpage-content">
                        <div className='basketpage-content-all_main'>
                            {cartItems.map(item => (
                                <div className="basketpage-content-product" key={item.id}>
                                    <img className='basketpage-content-img' src={item.image_path} alt={item.product_name} />
                                    <div className='basketpage-product-description'>
                                        <div className='basketpage-product-name-price'>
                                            <h3>{item.product_name}</h3>
                                            <span>{item.price_at_adding * item.quantity} ₽</span>
                                        </div>

                                        <div className='basketpage-product-subtitle'>
                                            <div className='basketpage-product-fav_tra'>
                                                <button onClick={() => handleAddToFavorites(item)}>
                                                    <img src={favorite} alt="В избранное" /> В избранное
                                                </button>
                                                <img src={trash} alt="Удалить" />
                                                <button onClick={() => removeItem(item.id)}>Удалить</button>
                                            </div>
                                            <div className='basketpage-product-add_del'>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                >
                                                    -
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="basketpage-content-selected_products">
                            <div className='basketpage-content-selected_products-inner'>
                                <h4>В корзине</h4>
                                <p>Товаров: {totals.total_items || 0}</p>
                                <button>Введите промокод</button>
                                <span>{totals.cart_total || 0} ₽</span>
                            </div>
                            <button className='Place-an-order' onClick={handleCheckout}>Оформить заказ</button>
                        </div>
                    </div>
                </div>
            </div>
            <Catalog />
        </section>
    );
}