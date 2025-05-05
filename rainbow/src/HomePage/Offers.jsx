import '../main.css'
import './Offers.css'
import photoOFF from './img/photoOFF.png'


export default function Offers() {
    return (
        <>
            <section className="offers">
                <div className="container">
                    <div className='offers-inner'>
                        <div className="offers-item">
                                <div className='offers-content'><img src={photoOFF} alt="" /></div>
                                <p>Новинки</p>
                        </div>
                        <div className="offers-item">
                                <div className='offers-content'><img src={photoOFF} alt="" /></div>
                                <p>Акции</p>
                        </div>
                        <div className="offers-item">
                                <div className='offers-content'> <img src={photoOFF} alt="" /></div>
                                <p>Хиты продаж</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}