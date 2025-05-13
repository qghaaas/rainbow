import '../main.css'
import './Registration.css'
import './Login.css'
import registrationstar from './img/registrationstar.svg'
import showpassword from './img/showpassword.svg'
import btnrating from './img/btnrating.svg'
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import arrowleft from '../BasketPage/img/arrowleft.svg'


export default function Registration() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isValid, setIsValid] = useState(true);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Валидация пароля
        if (name === 'password') {
            const isValidPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value);
            setIsValid(isValidPassword);
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert('Пароли не совпадают');
            return;
        }

        if (!isValid) {
            alert('Пароль не соответствует требованиям');
            return;
        }

        try {
            const response = await fetch('http://localhost:3009/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    password: formData.password
                })
            });

            if (response.ok) {
                alert('Регистрация успешна! Теперь войдите.');
                navigate('/login');
            } else {
                const errorData = await response.json();
                alert(errorData.error);
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка при регистрации');
        }
    };

    return (
        <section className="loginregistration">
            <div className="loginregistration-inner">
                <div className="loginregistration-registration">
                    <div className='navigation navigation-bas login-regist-back'>
                        <img src={arrowleft} alt="" />
                        <Link to='/Главная'>Назад</Link>
                    </div>
                    <h3>Регистрация</h3>

                    <form className='loginregistration-registration-form' onSubmit={handleSubmit}>
                        <div className='loginregistration-registration-form-inner'>
                            <label htmlFor="firstName">Ваше имя<img src={registrationstar} alt="" /></label>
                            <input
                                type="text"
                                name="firstName"
                                placeholder='Иван'
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className='loginregistration-registration-form-inner'>
                            <label htmlFor="lastName">Ваша фамилия<img src={registrationstar} alt="" /></label>
                            <input
                                type="text"
                                name="lastName"
                                placeholder='Петров'
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className='loginregistration-registration-form-inner'>
                            <label htmlFor="email">E-mail<img src={registrationstar} alt="" /></label>
                            <input
                                type="email"
                                name="email"
                                placeholder='name@inbox.ru'
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className='loginregistration-registration-form-inner'>
                            <label htmlFor="password">Пароль<img src={registrationstar} alt="" /></label>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder='********'
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <button type="button" onClick={toggleShowPassword}>
                                <img className='showpassword' src={showpassword} alt="" />
                                <img className='btnrating' src={btnrating} alt="" />
                            </button>
                            {!isValid && (
                                <div className="registration-warning">
                                    Пароль должен состоять из 8 цифр и латинских строчных и заглавных символов.
                                </div>
                            )}
                        </div>

                        <div className='loginregistration-registration-form-inner showpassword-repeat'>
                            <label htmlFor="confirmPassword">Повторите пароль<img src={registrationstar} alt="" /></label>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="confirmPassword"
                                placeholder='********'
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                            <button type="button" onClick={toggleShowPassword}>
                                <img className='showpassword' src={showpassword} alt="" />
                            </button>
                        </div>

                        <button type="submit" className='loginregistration-registration-login'>
                            Зарегистрироваться
                        </button>
                    </form>

                    <div className="loginregistration-form-register">
                        <p>Уже есть аккаунт? <Link to="/login">Войти</Link></p>
                    </div>
                </div>
            </div>
        </section>
    );
}