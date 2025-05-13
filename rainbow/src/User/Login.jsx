import '../main.css'
import './Login.css'
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import showpassword from './img/showpassword.svg';
import btnrating from './img/btnrating.svg';
import { useAuth } from '../AuthContext.jsx';
import arrowleft from '../BasketPage/img/arrowleft.svg'


export default function Login() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3009/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const userData = await response.json();
                login(userData.user);
                navigate('/');
            } else {
                alert('Неверный email или пароль');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка при входе');
        }
    };

    return (
        <section className="loginregistration">
            <div className="loginregistration-inner">
                <div className="loginregistration-form">
                    <div className='navigation navigation-bas login-regist-back'>
                        <img src={arrowleft} alt="" />
                        <Link to='/Главная'>Назад</Link>
                    </div>
                    <div className="loginregistration-form-title">
                        <h3>Вход</h3>
                        <p>Введите ваши учетные данные для входа</p>
                    </div>

                    <form className='loginregistration-registration-form' onSubmit={handleLogin}>
                        <div className="loginregistration-registration-form-inner">
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="name@inbox.ru"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="loginregistration-registration-form-inner">
                            <label>Пароль</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="********"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={toggleShowPassword}
                            >
                                <img className='showpassword' src={showpassword} alt="Показать пароль" />
                                <img className='btnrating' src={btnrating} alt="Иконка рейтинга" />
                            </button>
                        </div>

                        <button type="submit" className='loginregistration-registration-login'>
                            Войти
                        </button>
                    </form>

                    <div className="loginregistration-form-register">
                        <p>Нет аккаунта? <Link to="/registration">Зарегистрироваться</Link></p>
                    </div>
                </div>
            </div>
        </section>
    );
}











