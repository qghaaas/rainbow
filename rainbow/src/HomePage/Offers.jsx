import '../main.css';
import './Offers.css';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import newoffers from './img/newoffers.jpg';
import stock from './img/stock.jpg';
import bestsellers from './img/bestsellers.jpg';
import exclusive from './img/exclusive.jpg';
import editors from './img/editors.jpg';
import limited from './img/limited.jpg';

export default function Offers() {
    function getDescription(title) {
        const descriptions = {
            'Новинки': 'Первыми оцените свежие поступления',
            'Акции': 'Специальные условия на лучшие товары',
            'Хиты продаж': 'Самые популярные позиции месяца',
            'Эксклюзив': 'Уникальные товары только у нас',
            'Выбор редакции': 'Рекомендуем лучшее для вас',
            'Лимитированная серия': 'Особенная коллекция в ограниченном количестве'
        };
        return descriptions[title];
    }

    const offers = [
        { title: 'Новинки', path: '/offers/new', image: newoffers },
        { title: 'Акции', path: '/offers/2', image: stock },
        { title: 'Хиты продаж', path: '/offers/top', image: bestsellers },
        { title: 'Эксклюзив', path: '/offers/4', image: exclusive },
        { title: 'Выбор редакции', path: '/offers/5', image: editors },
        { title: 'Лимитированная серия', path: '/offers/6', image: limited }
    ];

    return (
        <section className="green-offers">
            <div className="container">
                <Swiper
                    slidesPerView={3}
                    spaceBetween={30}
                    loop={true}
                    navigation={{
                        nextEl: '.custom-next',
                        prevEl: '.custom-prev',
                    }}
                    pagination={{
                        clickable: true,
                        bulletClass: 'green-bullet',
                        bulletActiveClass: 'green-bullet-active'
                    }}
                    autoplay={{ delay: 5000 }}
                    breakpoints={{
                        320: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 }
                    }}
                    modules={[Navigation, Pagination, Autoplay]}
                    className="green-swiper"
                >
                    {offers.map((offer, index) => (
                        <SwiperSlide key={index}>
                            <div className="green-card">
                                <Link to={offer.path} className="green-link">
                                 <img src={offer.image} alt={offer.title} />
                                    <div className="image-container">
                                       
                                        <div className="hover-line"></div>
                                    </div>
                                    <div className="card-body">
                                        <h3>{offer.title}</h3>
                                        <p>{getDescription(offer.title)}</p>
                                        <span className="more-link">Подробнее →</span>
                                    </div>
                                </Link>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                <div className="custom-nav">
                    <button className="custom-prev">←</button>
                    <button className="custom-next">→</button>
                </div>
            </div>
        </section>
    )
}