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
    const {
        cartItems,
        cartTotals,
        updateCart,
        clearCart,
        setCartItems,
        fetchCartCount
    } = useCart();
    const [totals, setTotals] = useState({ total_items: 0, cart_total: 0 });
    const { user } = useAuth();
    const [isUpdating, setIsUpdating] = useState(false);
    const [showCheckoutPopup, setShowCheckoutPopup] = useState(false);
    const [deliveryMethod, setDeliveryMethod] = useState('pickup');
    const [selectedDate, setSelectedDate] = useState('');
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
            const response = await fetch(`http://localhost:3009/api/cart/${user.id}`, {
                headers: {
                    'Authorization': `Bearer ${user.token || ''}`
                }
            });
            const data = await response.json();
            setCartItems(data.items);
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    };

    useEffect(() => {
        if (user && user.id) {
            fetchCartData();
        }
    }, [user]);

    const updateQuantity = async (cartId, newQuantity) => {
        if (newQuantity < 1 || isUpdating) return;

        setIsUpdating(true);

        try {
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

            if (response.ok) {
                await updateCart();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Unknown error');
            }
        } catch (error) {
            console.error('Error details:', error);
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

    const handleFinalCheckout = async () => {
        try {
            let finalDate = selectedDate;
            if (deliveryMethod === 'pickup' && !selectedDate) {
                const threeDaysLater = new Date();
                threeDaysLater.setDate(threeDaysLater.getDate() + 3);
                finalDate = threeDaysLater.toISOString().split('T')[0];
            }

            const orderData = {
                user_id: user.id,
                items: cartItems.map(item => ({
                    product_id: item.product_id,
                    quantity: item.quantity
                })),
                total: cartTotals.cart_total,
                delivery_method: deliveryMethod,
                delivery_date: finalDate
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
            clearCart();

            navigate('/paymentpage');
        } catch (error) {
            console.error('Ошибка оформления заказа:', error);
            alert(error.message);
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
                                <p>Товаров: {cartTotals.total_items || 0}</p>
                                <button>Введите промокод</button>
                                <span>{cartTotals.cart_total || 0} ₽</span>
                            </div>
                            <button
                                className='Place-an-order'
                                onClick={() => setShowCheckoutPopup(true)}
                            >
                                Оформить заказ
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Catalog />

            {showCheckoutPopup && user && (
                <div className="popup-overlay">
                    <div className="checkout-popup">
                        <button
                            className="close-popup"
                            onClick={() => setShowCheckoutPopup(false)}
                        >
                            &times;
                        </button>

                        <h2>Оформление заказа</h2>

                        <div className="user-info">
                            <p><strong>Имя:</strong> {user.first_name} {user.last_name}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Телефон:</strong> {user.phone_number || 'Не указан'}</p>
                            <p><strong>Сумма заказа:</strong> {cartTotals.cart_total || 0} ₽</p>
                        </div>

                        <div className="delivery-method">
                            <label>
                                <input
                                    type="radio"
                                    value="pickup"
                                    checked={deliveryMethod === 'pickup'}
                                    onChange={() => setDeliveryMethod('pickup')}
                                />
                                Самовывоз
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="delivery"
                                    checked={deliveryMethod === 'delivery'}
                                    onChange={() => setDeliveryMethod('delivery')}
                                />
                                Доставка
                            </label>
                        </div>

                        <div className="date-selection">
                            <label>
                                {deliveryMethod === 'pickup'
                                    ? "Дата самовывоза:"
                                    : "Дата доставки:"}
                            </label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                            />

                            {deliveryMethod === 'pickup' && !selectedDate && (
                                <div className="pickup-notice">
                                    <p>Ваш заказ будет готов к выдаче через 3 дня</p>
                                    <p>График работы: Пн-Пт: 9:00-20:00, Сб-Вс: 10:00-18:00</p>
                                </div>
                            )}
                        </div>

                        <button
                            className="confirm-order-btn"
                            onClick={handleFinalCheckout}
                        >
                            Подтвердить заказ
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}