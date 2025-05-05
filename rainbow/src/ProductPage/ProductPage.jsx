import '../main.css'
import './ProductPage.css'
import { Link, useParams, useNavigate } from 'react-router-dom'
import star from './img/star.svg'
import favorite from './img/favorite.svg'
import { useState, useEffect } from 'react'
import { useCart } from '../CartContext'
import { useAuth } from '../AuthContext'

export default function ProductPage() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [count, setCount] = useState(1);
    const navigate = useNavigate();
    const { fetchCartCount } = useCart();
    const { user } = useAuth();
    const userId = user?.id;

    const handleBuyNow = async () => {
        if (!userId) {
            alert('Пожалуйста, войдите в аккаунт');
            return;
        }

        try {
            const orderData = {
                user_id: userId,
                items: [{
                    product_id: product.id,
                    product_name: product.product_name,
                    quantity: count,
                    price_at_adding: product.price
                }],
                total: product.price * count
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

            navigate('/paymentpage');
        } catch (error) {
            console.error('Ошибка оформления заказа:', error);
            alert(error.message);
        }
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:3009/api/catalog/${id}`);
                if (!response.ok) throw new Error('Товар не найден');
                const data = await response.json();
                setProduct(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const addToCart = async () => {
        if (!userId) {
            alert('Пожалуйста, войдите в аккаунт');
            return;
        }

        try {
            await fetch('http://localhost:3009/api/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    product_id: parseInt(id, 10),
                    quantity: count
                })
            });

            await fetchCartCount();
            navigate('/basket');
        } catch (err) {
            alert('Ошибка при добавлении в корзину');
            console.error(err);
        }
    };

    if (loading) return <div className="loading">Загрузка...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!product) return <div className="not-found">Товар не найден</div>;

    const addToFavorites = async () => {
        if (!userId) {
            alert('Пожалуйста, войдите в аккаунт');
            return;
        }

        try {
            const response = await fetch('http://localhost:3009/api/add-favorite', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    product: {
                        id: product.id,
                        name: product.product_name,
                        price: product.price,
                        image: product.image_path
                    }
                })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Ошибка при добавлении в избранное');

            alert('Товар добавлен в избранное');
        } catch (err) {
            console.error(err);
            alert(err.message || 'Ошибка');
        }
        console.log('Клик по избранному');
    };

    return (
        <section className='productpage'>
            <div className="container">
                <div className="productpage-inner">
                    <div className='navigation'>
                        <Link to='/Главная'>Главная</Link>
                        <span>/</span>
                        <Link to='/Каталог'>Каталог</Link>
                    </div>

                    <div className='productpage-content'>
                        <img className='productpage-img' src={product.image_path} alt={product.product_name} />
                        <div className='productpage-content-right'>
                            <h2>{product.product_name}</h2>
                            <div className='productpage-content-subtitle'>
                                <ul className='productpage-content-reviews'>
                                    {[...Array(5)].map((_, i) => (
                                        <li key={i}><button><img src={star} alt="Звезда рейтинга" /></button></li>
                                    ))}
                                    <li><span>({product.reviews_count || 0})</span></li>
                                </ul>
                                <div className='productpage-content-favorites' onClick={() => addToFavorites()}>
                                    <img src={favorite} alt="Добавить в избранное" />
                                    <span>В избранное</span>
                                </div>
                            </div>

                            <div className='productpage-content-bot'>
                                <p>{product.price * count} ₽</p>
                                <div className='productpage-content-basket'>
                                    <button className='productpage-content-basket-count' onClick={() => setCount(Math.max(1, count - 1))}>-</button>
                                    <button className='productpage-content-basket-linkpage' onClick={addToCart}>
                                        В корзине {count} шт<br />
                                        перейти
                                    </button>
                                    <button className='productpage-content-basket-count' onClick={() => setCount(count + 1)}>+</button>
                                </div>
                            </div>

                            <button className='buyioc' onClick={handleBuyNow}>
                                Купить в 1 клик
                            </button>

                            <div className="productpage-details">
                                <p><strong>Категория:</strong> {product.category || 'Не указана'}</p>
                                <p><strong>Производитель:</strong> {product.manufacturer || 'Не указан'}</p>
                                <p><strong>Описание:</strong> {product.description?.trim() ? product.description : 'На данный товар нет описания'}</p>
                                <p><strong>Наличие:</strong> {product.in_stock && product.in_stock > 0 ? 'Есть в наличии' : 'Нет в наличии'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
