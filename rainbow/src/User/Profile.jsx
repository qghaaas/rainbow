import { useAuth } from '../AuthContext.jsx';
import './Profile.css'
import { useState, useEffect } from 'react';

export default function Profile() {
    const { user, logout } = useAuth();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [message, setMessage] = useState('');
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [addressMessage, setAddressMessage] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [favorites, setFavorites] = useState([]);


    const fetchAddressSuggestions = async (query) => {
        const token = "0ff147ff2686d7939290aacb2c35466435a44115";

        const response = await fetch("https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Token " + token
            },
            body: JSON.stringify({ query, count: 5 })
        });

        const data = await response.json();

        const filtered = data.suggestions.filter(s => s.data.country === "Россия");

        setSuggestions(filtered);
        if (data.suggestions.length > 0 && filtered.length === 0) {
            setAddressMessage("На данный адрес доставка не осуществляется");
        } else {
            setAddressMessage("");
        }
    };

    const handleAddressChange = (e) => {
        const value = e.target.value;
        setDeliveryAddress(value);
        fetchAddressSuggestions(value);
    };

    const handleSuggestionClick = (suggestion) => {
        setDeliveryAddress(suggestion.value);
        setSuggestions([]);
        setAddressMessage('');
    };

    const handleCheckOldPassword = async () => {
        const response = await fetch('http://localhost:3009/api/change-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email, oldPassword, newPassword: oldPassword })
        });

        const data = await response.json();

        if (response.ok) {
            setIsVerified(true);
            setMessage('');
        } else {
            setMessage(data.error);
        }
    };

    const handleChangePassword = async () => {
        if (newPassword !== repeatPassword) {
            setMessage('Новые пароли не совпадают');
            return;
        }

        const response = await fetch('http://localhost:3009/api/change-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email, oldPassword, newPassword })
        });

        const data = await response.json();

        if (response.ok) {
            setMessage('Пароль успешно обновлён');
            setOldPassword('');
            setNewPassword('');
            setRepeatPassword('');
            setIsVerified(false);
        } else {
            setMessage(data.error);
        }
    };

    useEffect(() => {
        if (user?.id) {
            fetch(`http://localhost:3009/api/favorites/${user.id}`)
                .then(res => res.json())
                .then(data => setFavorites(data))
                .catch(err => console.error(err));
        }
    }, [user]);

    const handleUpdateAddress = async () => {
        const response = await fetch('http://localhost:3009/api/update-address', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email, deliveryAddress })
        });

        const data = await response.json();

        if (response.ok) {
            setAddressMessage('Адрес успешно обновлён');
        } else {
            setAddressMessage(data.error || 'Ошибка обновления адреса');
        }
    };

    const removeFromFavorites = async (productName) => {
        try {
            const response = await fetch('http://localhost:3009/api/favorites/remove', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: user.id, productName })
            });

            const data = await response.json();

            if (response.ok) {
                setFavorites(data.updatedFavorites);
            } else {
                console.error('Ошибка при удалении из избранного:', data.error);
            }
        } catch (err) {
            console.error('Ошибка сети:', err);
        }
    };

    return (
        <section className='user-page'>
            <div className='container'>
                <div className='user-page-inner'>
                    <h2>Ваш профиль</h2>
                    {user && (
                        <div className="user-info">
                            <ul>
                                <li><p>Имя: {user.first_name}</p></li>
                                <li><p>Фамилия: {user.last_name}</p></li>
                                <li><p>Email: {user.email}</p></li>
                            </ul>
                            <button onClick={logout} className="logout-button">
                                Выйти из аккаунта
                            </button>

                            <hr />
                            <h3>Адрес доставки</h3>
                            <div className="delivery-address-form">
                                <input
                                    type="text"
                                    placeholder="Введите ваш адрес"
                                    value={deliveryAddress}
                                    onChange={handleAddressChange}
                                />
                                {suggestions.length > 0 && (
                                    <ul className="suggestions-list">
                                        {suggestions.map((sug, idx) => (
                                            <li key={idx} onClick={() => handleSuggestionClick(sug)}>
                                                {sug.value}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <button onClick={handleUpdateAddress}>Сохранить адрес</button>
                                {addressMessage && <p className="message">{addressMessage}</p>}
                            </div>

                            <hr />
                            <h3>Избранное</h3>
                            {favorites.length === 0 ? (
                                <p>У вас пока нет избранных товаров.</p>
                            ) : (
                                <div className="favorites-list">
                                    {favorites.map((fav, index) => (
                                        <div className="favorite-item" key={index}>
                                            <img src={fav.image} alt={fav.name} className="favorite-img" />
                                            <div>
                                                <h4>{fav.name}</h4>
                                                <p>{fav.price} ₽</p>
                                            </div>
                                            <button onClick={() => removeFromFavorites(fav.name)}>Удалить</button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <hr />
                            <h3>Смена пароля</h3>
                            {!isVerified ? (
                                <div className="change-password-form">
                                    <input
                                        type="password"
                                        placeholder="Старый пароль"
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                    />
                                    <button onClick={handleCheckOldPassword}>Проверить пароль</button>
                                </div>
                            ) : (
                                <div className="change-password-form">
                                    <input
                                        type="password"
                                        placeholder="Новый пароль"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    <input
                                        type="password"
                                        placeholder="Повторите новый пароль"
                                        value={repeatPassword}
                                        onChange={(e) => setRepeatPassword(e.target.value)}
                                    />
                                    <button onClick={handleChangePassword}>Сменить пароль</button>
                                </div>
                            )}
                            {message && <p className="message">{message}</p>}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
