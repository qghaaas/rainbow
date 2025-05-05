import '../main.css'
import './Offers.css'
import photoOFF from './img/photoOFF.png'
import { Link } from 'react-router-dom';

export default function Offers() {
    return (
        <>
            <section className="offers">
                <div className="container">
                    <div className='offers-inner'>
                        <div className="offers-item">
                                <Link to="/offers/new">
                                    <div className='offers-content'><img src={photoOFF} alt="" /></div>
                                </Link>
                                <p>Новинки</p>
                        </div>
                        <div className="offers-item">
                                <div className='offers-content'><img src={photoOFF} alt="" /></div>
                                <p>Акции</p>
                        </div>
                        <div className="offers-item">
                                <Link to="/offers/top">
                                    <div className='offers-content'> <img src={photoOFF} alt="" /></div>
                                </Link>
                                <p>Хиты продаж</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}