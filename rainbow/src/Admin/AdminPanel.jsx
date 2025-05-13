import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPanel.css'

const AdminPanel = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [manufacturers, setManufacturers] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [newManufacturer, setNewManufacturer] = useState('');
    const [formData, setFormData] = useState({
        product_name: '',
        price: '',
        description: '',
        image_path: '',
        category: '',
        manufacturer: '',
        in_stock: true
    });
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('users');
    const navigate = useNavigate();

    const fetchOrders = async () => {
        try {
            const credentials = btoa('admin:admin');
            const response = await fetch('http://localhost:3009/admin/orders', {
                headers: {
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
            alert('Ошибка при загрузке заказов');
        }
    };

    const handleAcceptOrder = async (orderId) => {
        try {
            const credentials = btoa('admin:admin');
            const response = await fetch(`http://localhost:3009/admin/orders/${orderId}/accept`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Ошибка принятия заказа');

            await fetchOrders();
            alert('Заказ успешно принят!');
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        }
    };

    const handleRejectOrder = async (orderId) => {
        try {
            const credentials = btoa('admin:admin');
            const response = await fetch(`http://localhost:3009/admin/orders/${orderId}/reject`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Ошибка отклонения заказа');

            await fetchOrders();
            alert('Заказ успешно отклонен!');
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        }
    };

    const fetchUsers = async () => {
        try {
            const credentials = btoa('admin:admin');
            const response = await fetch('http://localhost:3009/admin/users', {
                headers: {
                    'Authorization': `Basic ${credentials}`
                }
            });
            if (!response.ok) throw new Error('Ошибка загрузки');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error:', error);
            alert('Ошибка при загрузке пользователей');
        }
    };

    useEffect(() => {
        const isAuthenticated = localStorage.getItem('adminAuth');
        if (!isAuthenticated) {
            navigate('/admin/login');
        } else {
            fetchProducts();
            fetchCategories();
            fetchManufacturers();
            fetchUsers();
            fetchOrders();
        }
    }, [navigate]);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:3009/api/catalog');
            if (!response.ok) throw new Error('Ошибка загрузки');
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error:', error);
            alert('Ошибка при загрузке товаров');
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:3009/api/categories');
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchManufacturers = async () => {
        try {
            const response = await fetch('http://localhost:3009/api/manufacturers');
            const data = await response.json();
            setManufacturers(data);
        } catch (error) {
            console.error('Error fetching manufacturers:', error);
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                in_stock: formData.in_stock === 'true' || formData.in_stock === true
            };

            const credentials = btoa('admin:admin');

            const response = await fetch('http://localhost:3009/admin/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${credentials}`
                },
                body: JSON.stringify(productData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(`Ошибка: ${errorData.error || 'Неизвестная ошибка'}`);
                return;
            }

            await fetchProducts();
            setFormData({
                product_name: '',
                price: '',
                description: '',
                image_path: '',
                category: '',
                manufacturer: '',
                in_stock: true
            });
            alert('Товар успешно добавлен!');
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Произошла ошибка при добавлении товара');
        }
    };

    const handleDelete = async (id) => {
        try {
            if (!window.confirm('Вы точно хотите удалить этот товар?')) return;

            const credentials = btoa('admin:admin');
            const response = await fetch(`http://localhost:3009/admin/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Basic ${credentials}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Ошибка удаления');
            }

            await fetchProducts();
            alert('Товар успешно удален!');
        } catch (error) {
            console.error('Delete error:', error);
            alert(error.message);
        }
    };



    return (
        <div className="admin-panel">
            <h1 className='title-admin-h'>Админ панель</h1>
            <button className='getout-admin' onClick={() => {
                localStorage.removeItem('adminAuth');
                navigate('/admin/login');
            }}>
                Выйти
            </button>

            <div className="admin-tabs">
                <button
                    className={`tab-link ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                >
                    Пользователи
                </button>
                <button
                    className={`tab-link ${activeTab === 'orders' ? 'active' : ''}`}
                    onClick={() => setActiveTab('orders')}
                >
                    Заказы
                </button>
                <button
                    className={`tab-link ${activeTab === 'categories' ? 'active' : ''}`}
                    onClick={() => setActiveTab('categories')}
                >
                    Категории
                </button>
                <button
                    className={`tab-link ${activeTab === 'products' ? 'active' : ''}`}
                    onClick={() => setActiveTab('products')}
                >
                    Товары
                </button>
            </div>

            {activeTab === 'users' && (
                <div className="admin-section">
                    <h3>Зарегистрированные пользователи</h3>
                    <div className="admin-list">
                        {users.map(user => (
                            <div key={user.id} className="admin-list-item">
                                <div className="user-info">
                                    <span>{user.first_name} {user.last_name}</span>
                                    <span>Email: {user.email}</span>
                                    {user.delivery_address &&
                                        <span>Адрес: {user.delivery_address}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>)}

            {activeTab === 'orders' && (
                <div className="admin-section">
                    <h3>Заказы</h3>
                    <div className="orders-list">
                        {orders.length === 0 ? (
                            <div className="no-orders">Заказов пока нет</div>
                        ) : (
                            orders.map(order => (
                                <div key={order.id} className="order-item">
                                    <div className="order-header">
                                        <div className="order-meta">
                                            <span className="order-number">Заказ #{order.id}</span>
                                            <span className={`order-status status-${order.status}`}>
                                                {order.status === 'pending' && 'Ожидает решения'}
                                                {order.status === 'accepted' && 'Принят'}
                                                {order.status === 'rejected' && 'Отклонен'}
                                            </span>
                                        </div>
                                        <span className="order-date">
                                            {new Date(order.created_at).toLocaleDateString('ru-RU', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>

                                    <div className="order-user-info">
                                        <h4>Информация о клиенте:</h4>
                                        <div className="user-details">
                                            <p>
                                                <span className="detail-label">Имя:</span>
                                                {order.first_name} {order.last_name}
                                            </p>
                                            <p>
                                                <span className="detail-label">Email:</span>
                                                {order.email}
                                            </p>
                                            {order.delivery_address && (
                                                <p>
                                                    <span className="detail-label">Адрес доставки:</span>
                                                    {order.delivery_address}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="order-products">
                                        <h4>Состав заказа:</h4>
                                        <div className="products-list">
                                            {order.items.map((item, index) => (
                                                <div key={index} className="product-item">
                                                    <span className="product-name">{item.product_name}</span>
                                                    <div className="product-meta">
                                                        <span className="product-quantity">
                                                            {item.quantity} шт.
                                                        </span>
                                                        <span className="product-price">
                                                            {item.price}₽/шт.
                                                        </span>
                                                        <span className="product-total">
                                                            {item.quantity * item.price}₽
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="order-footer">
                                        <div className="total-sum">
                                            Итого: <span>{order.total}₽</span>
                                        </div>
                                        {order.status === 'pending' && (
                                            <div className="order-actions">
                                                <button
                                                    className="accept-button"
                                                    onClick={() => handleAcceptOrder(order.id)}
                                                >
                                                    ✓ Принять заказ
                                                </button>
                                                <button
                                                    className="reject-button"
                                                    onClick={() => handleRejectOrder(order.id)}
                                                >
                                                    ✕ Отклонить заказ
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'categories' && (
                <div className="admin-section">
                    <h3>Управление категориями</h3>
                    <div className="admin-form-group">
                        <input
                            type="text"
                            placeholder="Новая категория"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                        />
                        <button onClick={async () => {
                            const response = await fetch('http://localhost:3009/admin/categories', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ name: newCategory })
                            });
                            if (response.ok) {
                                setNewCategory('');
                                fetchCategories();
                            } else {
                                alert('Ошибка при добавлении категории');
                            }
                        }}>
                            Добавить категорию
                        </button>
                    </div>
                    <div className="admin-list">
                        {categories.map((cat, idx) => (
                            <div key={idx} className="admin-list-item">
                                <span>{cat}</span>
                                <button className="delete-btn" onClick={async () => {
                                    if (window.confirm(`Удалить категорию "${cat}"?`)) {
                                        await fetch(`http://localhost:3009/admin/categories/${cat}`, { method: 'DELETE' });
                                        fetchCategories();
                                    }
                                }}>Удалить</button>
                            </div>
                        ))}
                    </div>

                    <h3>Управление производителями</h3>
                    <div className="admin-form-group">
                        <input
                            type="text"
                            placeholder="Новый производитель"
                            value={newManufacturer}
                            onChange={(e) => setNewManufacturer(e.target.value)}
                        />
                        <button onClick={async () => {
                            const response = await fetch('http://localhost:3009/admin/manufacturers', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ name: newManufacturer })
                            });
                            if (response.ok) {
                                setNewManufacturer('');
                                fetchManufacturers();
                            } else {
                                alert('Ошибка при добавлении производителя');
                            }
                        }}>
                            Добавить производителя
                        </button>
                    </div>
                    <div className="admin-list">
                        {manufacturers.map((man, idx) => (
                            <div key={idx} className="admin-list-item">
                                <span>{man}</span>
                                <button className="delete-btn" onClick={async () => {
                                    if (window.confirm(`Удалить производителя "${man}"?`)) {
                                        await fetch(`http://localhost:3009/admin/manufacturers/${man}`, { method: 'DELETE' });
                                        fetchManufacturers();
                                    }
                                }}>Удалить</button>
                            </div>
                        ))}
                    </div>
                </div>)}

            {activeTab === 'products' && (
                <>
                    <form className='form-add-product' onSubmit={handleAddProduct}>
                        <input
                            type="text"
                            placeholder="Название продукта"
                            value={formData.product_name}
                            onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Цена"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Описание"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Ссылка на изображение"
                            value={formData.image_path}
                            onChange={(e) => setFormData({ ...formData, image_path: e.target.value })}
                            required
                        />

                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            required
                        >
                            <option value="">Выберите категорию</option>
                            {categories.map((category, index) => (
                                <option key={`cat-${index}`} value={category}>{category}</option>
                            ))}
                        </select>

                        <select
                            value={formData.manufacturer}
                            onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                            required
                        >
                            <option value="">Выберите производителя</option>
                            {manufacturers.map((manufacturer, index) => (
                                <option key={`man-${index}`} value={manufacturer}>{manufacturer}</option>
                            ))}
                        </select>

                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={formData.in_stock}
                                onChange={(e) => setFormData({ ...formData, in_stock: e.target.checked })}
                            />
                            <span className="checkmark"></span>
                            В наличии
                        </label>

                        <button className='button-add-product' type="submit">Добавить продукт</button>
                    </form>

                    <div className="products-list">
                        <h2>Список товаров ({products.length})</h2>
                        <div className="products-grid">
                            {products.map(product => (
                                <div key={product.id} className="product-card">
                                    <img
                                        src={product.image_path || 'placeholder-image.jpg'}
                                        alt={product.product_name}
                                        className="product-image"
                                    />
                                    <div className="product-info">
                                        <h3>{product.product_name}</h3>
                                        <p>Цена:{product.price} ₽</p>
                                        {product.description && <p>{product.description}</p>}
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDelete(product.id)}
                                        >
                                            Удалить товар
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>)}
        </div>
    );
};

export default AdminPanel;