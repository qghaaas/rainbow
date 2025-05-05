import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPanel.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const encodedCredentials = btoa(`${login}:${password}`);

    try {
      const response = await fetch('http://localhost:3009/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${encodedCredentials}`,
        },
        body: JSON.stringify({ product_name: 'test', price: 1 })
      });

      if (response.status === 401) {
        setError('Неверный логин или пароль');
      } else {
        localStorage.setItem('adminAuth', encodedCredentials);
        navigate('/admin');
      }
    } catch (err) {
      setError('Ошибка подключения к серверу');
    }
  };

  return (
    <div className="admin-login-wrapper">
      <form onSubmit={handleSubmit} className="admin-login-form">
        <h2 className="admin-login-title">Admin Login</h2>
        <div className="admin-input-group">
          <label className="admin-input-label">Login:</label>
          <input
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            className="admin-input"
            placeholder="Введите логин"
          />
        </div>
        <div className="admin-input-group">
          <label className="admin-input-label">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="admin-input"
            placeholder="Введите пароль"
          />
        </div>
        {error && <p className="admin-error-message">{error}</p>}
        <button type="submit" className="admin-login-button">Войти</button>
      </form>
    </div>
  );
};

export default AdminLogin;

