import '../main.css'
import './Header.css'
import { Link, useNavigate } from 'react-router-dom';
import menu from './img/menu.svg'
import logo from './img/logo.svg'
import search from './img/search.svg'
import shopping from './img/shopping.svg'
import { useState, useRef, useEffect } from 'react';
import closebrg from './img/closebrg.svg'
import { useCart } from '../CartContext'
import { useAuth } from '../AuthContext.jsx';
import userIcon from './img/userIcon.svg'


export default function Header({ onSearch }) {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchActive, setIsSearchActive] = useState(false);
    const menuRef = useRef(null);
    const searchRef = useRef(null);
    const navigate = useNavigate();
    const { cartCount } = useCart();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    const activateSearch = () => {
        setIsSearchActive(true);
        setTimeout(() => searchRef.current?.focus(), 0);
    };

    const deactivateSearch = () => {
        setIsSearchActive(false);
        setSearchQuery('');
        onSearch('');
    };

    const handleSearchKeyPress = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(`/Каталог?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };
    return (
        <>
            <header>
                <div className="container">
                    <div className="header-inner">
                        <nav className='nav-menu'>
                            <ul className='nav-menu_item'>
                                <li className='nav-left-content'>
                                    <button
                                        onClick={() => setIsOpen(!isOpen)}
                                        className="menu-button"
                                    >
                                        <img src={menu} alt="Open menu" />
                                    </button>
                                    <p className='brg-meni-title'>Меню</p>

                                    <div
                                        ref={menuRef}
                                        className={`side-menu ${isOpen ? 'open' : ''}`}
                                    >
                                        <button
                                            className="close-button"
                                            onClick={() => setIsOpen(false)}
                                            aria-label="Close menu"
                                        >
                                            <img src={closebrg} alt="Close" />
                                        </button>

                                        <div className="menu-content">
                                            <nav className='menu-contend-link'>
                                                <ul>
                                                    <li><Link to="/О нас">О нас</Link></li>
                                                    <li><Link to="/Об оплате">Об оплате</Link></li>
                                                    <li><Link to='/Каталог'>Каталог</Link></li>
                                                    <li><Link to="/special-offers">Спецпредложения</Link></li>
                                                </ul>
                                            </nav>

                                            <div className='menu-content-contact'>
                                                <b>Контакты</b>
                                                <span>+7 902 918-28-90</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`overlay ${isOpen ? 'visible' : ''}`} />

                                </li>
                                <li className='nav-center-content'>
                                    {!isSearchActive ? (
                                        <>
                                            <Link to="/"><img src={logo} alt="" /></Link>
                                            <Link to="/"><h1>РАДУГА</h1></Link>
                                        </>
                                    ) : (
                                        <div className="search-container">
                                            <input
                                                ref={searchRef}
                                                type="text"
                                                className="search-input"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                onKeyPress={handleSearchKeyPress}
                                                placeholder="Поиск товаров..."
                                            />
                                            <img
                                                src={closebrg}
                                                alt="Закрыть поиск"
                                                onClick={deactivateSearch}
                                                className="close-search-icon"
                                            />
                                        </div>
                                    )}
                                </li>

                                <li className='nav-right-content'>
                                    {isSearchActive ? null : (
                                        <img
                                            src={search}
                                            alt="Поиск"
                                            onClick={activateSearch}
                                            className="search-icon"
                                        />
                                    )}
                                    <button
                                        className='header-basket'
                                        onClick={() => {
                                            if (!user) {
                                                alert('Пожалуйста, войдите в аккаунт');
                                            } else {
                                                navigate('/basket');
                                            }
                                        }}
                                    >
                                        <img src={shopping} alt="Корзина" />
                                        {cartCount > 0 && (
                                            <span className="cart-count-badge">
                                                {cartCount > 9 ? '9+' : cartCount}
                                            </span>
                                        )}
                                    </button>

                                    {user ? (
                                        <div className="user-profile">
                                            <Link className='user-profile-link' to='/profile'>
                                                <img src={userIcon} alt="" />
                                            </Link>
                                            <button onClick={logout}>Выйти</button>
                                        </div>
                                    ) : (
                                        <Link className='user-log-res' to='/login'>
                                            <img src={userIcon} alt="Пользователь" />
                                            Вход/Регистрация
                                        </Link>
                                    )}
                                </li>

                            </ul>
                        </nav>
                    </div>
                </div>
            </header>
        </>
    )
}