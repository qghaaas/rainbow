import '../main.css'
import photoOFF from '../HomePage/img/photoOFF.png'
import { Link } from 'react-router-dom';
import './SpecialOffers.css'

export default function SpecialOffers() {
    return (
        <>
            <section className="spec-offers">
                <div className="container">
                    <div className='navigation'>
                        <Link to='/Главная'>Главная</Link>
                        <span>/</span>
                        <Link to='/special-offers'>Спецпредложения</Link>
                    </div>
                    <div className='spec-offers-inner'>
                        <div className="spec-offers-item">
                            <Link to="/offers/new">
                                <div className='spec-offers-content'><img src={photoOFF} alt="" /></div>
                            </Link>
                            <p>Новинки</p>
                        </div>
                        <div className="spec-offers-item">
                            <div className='spec-offers-content'>
                                <img src={photoOFF} alt="Акции" />
                                <div className="status-overlay">
                                    <span>Скоро</span>
                                    <p>Готовятся специальные предложения</p>
                                </div>
                            </div>
                            <p>Акции</p>
                        </div>
                        <div className="spec-offers-item">
                            <Link to="/offers/top">
                                <div className='spec-offers-content'> <img src={photoOFF} alt="" /></div>
                            </Link>
                            <p>Хиты продаж</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}