import '../main.css'
import './Footer.css'
import { Link } from 'react-router-dom';
import logo from './img/logo.svg'
import vk from './img/vk.svg'
import telegram from './img/telegram.svg'
import whatsapp from './img/whatsapp.svg'


export default function Footer() {
    return (
        <>
            <footer>
                <div className="container">
                    <div className="footer-inner">
                        <div className='logo-footer'>
                            <Link to="/"><img src={logo} alt="Логотип Радуга" /></Link>
                            <Link to="/"><h1>РАДУГА</h1></Link>
                        </div>

                        <div className='footer-nav'>
                            <h3 className="footer-title">Меню</h3>
                            <ul className="footer-links">
                                <li><Link to="/О нас">О нас</Link></li>
                                <li><Link to="/Об оплате">Об оплате</Link></li>
                                <li><Link to="/Каталог">Каталог</Link></li>
                                <li><Link to="/special-offers">Спецпредложения</Link></li>
                            </ul>
                        </div>

                        <div className='contacts-footer'>
                            <h3 className="footer-title">Контакты</h3>
                            <div className="contact-items">
                                <b>+7 902 918-28-90</b>
                                <p>info@raduga.ru</p>
                                <div className="social-links">
                                    <Link to="#"><img src={vk} alt="" /></Link>
                                    <Link to="#"><img src={telegram} alt="" /></Link>
                                    <Link to="#"><img src={whatsapp} alt="" /></Link>
                                </div>
                            </div>
                        </div>

                        <div className='footer-subscribe'>
                            <h3 className="footer-title">Подписаться</h3>
                            <form className="subscribe-form">
                                <input type="email" placeholder="Ваш email" />
                                <button type="submit">Подписаться</button>
                            </form>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <p>© {new Date().getFullYear()} "Радуга". Все права защищены.</p>
                        <Link to="/privacy">Политика конфиденциальности</Link>
                    </div>
                </div>
            </footer>
        </>
    )
}