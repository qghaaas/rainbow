import '../main.css'
import './Catalog.css'
import like from './img/like.svg'
import shoppingcard from './img/shoppingcard.svg'
import arrow from './img/arrow.svg'
import { Link, useSearchParams } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import { useCart } from '../CartContext'
import { useAuth } from '../AuthContext'


export default function Catalog({ searchQuery = '', hideAddToCart = false, offerType = null }) {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();
    const { fetchCartCount } = useCart();
    const userId = user?.id;
    const [searchParams] = useSearchParams();


    const addToCart = async (productId) => {
        if (!user) {
            alert('Пожалуйста, войдите в аккаунт');
            return;
        }
        try {
            const response = await fetch('http://localhost:3009/api/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user.id,
                    product_id: productId,
                    quantity: 1
                })
            });

            if (response.ok) {
                await fetchCartCount();
                alert('Товар добавлен в корзину!');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };



    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                let url;
                if (offerType) {
                    url = `http://localhost:3009/api/products/${offerType}`;
                } else {
                    const params = new URLSearchParams();
                    if (searchQuery) params.append('q', searchQuery);
                    if (searchParams.get('category')) params.append('category', searchParams.get('category'));
                    if (searchParams.get('minPrice')) params.append('minPrice', searchParams.get('minPrice'));
                    if (searchParams.get('maxPrice')) params.append('maxPrice', searchParams.get('maxPrice'));
                    if (searchParams.get('manufacturer')) params.append('manufacturer', searchParams.get('manufacturer'));
                    if (searchParams.get('manufacturerSearch')) params.append('manufacturer', searchParams.get('manufacturerSearch'));
                    if (searchParams.get('inStock')) params.append('inStock', searchParams.get('inStock'));

                    url = `http://localhost:3009/api/catalog?${params.toString()}`;
                }

                const response = await fetch(url);

                if (!response.ok) throw new Error('Ошибка загрузки данных');

                const result = await response.json();
                setData(result);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [searchQuery, searchParams, offerType]); 


    const addToFavorites = async (product) => {
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
    };



    return (
        <section className='catalog'>
            <div className="container">
                <div className="catalog-inner">
                    {!offerType && <Link className='linktocatalog' to='/Каталог'>Каталог</Link>}
                    {isLoading ? (
                        <div className="loading">Загрузка...</div>
                    ) : data.length === 0 ? (
                        <div className="no-results">
                            {searchQuery
                                ? `Товары по запросу "${searchQuery}" не найдены`
                                : 'В каталоге пока нет товаров'}
                        </div>
                    ) : (
                        <>
                            <div className='card-container'>
                                {data.map((catalog) => (
                                    <div className='card' key={catalog.id}>
                                        <div className='card-top'>

                                            {catalog.total_orders >= 3 && (
                                                <div className="popular-badge">Хит</div>
                                            )}

                                            <button onClick={() => addToFavorites(catalog)}>
                                                <img className='card-like' src={like} alt="Добавить в избранное" />
                                            </button>
                                            <Link to={`/product/${catalog.id}`} className="card-link">
                                                <img
                                                    className='card-img'
                                                    src={catalog.image_path}
                                                    alt={catalog.product_name}
                                                />
                                            </Link>
                                        </div>
                                        <div className="card-bot">
                                            <p>{catalog.product_name}</p>
                                            <div className='card-bot_p-s'>
                                                <span>{catalog.price} ₽</span>
                                                {!hideAddToCart && (
                                                    <div>
                                                        <img
                                                            src={shoppingcard}
                                                            alt="Добавить в корзину"
                                                            onClick={() => addToCart(catalog.id)}
                                                            style={{ cursor: 'pointer' }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {!searchQuery && !offerType && (
                                <button className='see-all'>
                                    <p>Смотреть все</p>
                                    <img src={arrow} alt="Стрелка" />
                                </button>
                            )}

                        </>
                    )}
                </div>
            </div>
        </section>
    )
}

// function isNewProduct(createdAt) {
//     const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
//     return new Date(createdAt) > twoWeeksAgo;
// }