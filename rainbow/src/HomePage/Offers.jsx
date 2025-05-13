import '../main.css';
import './Offers.css';
import photoOFF from './img/photoOFF.png';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

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
        { title: 'Новинки', path: '/offers/new' },
        { title: 'Акции', path: '/offers/2' },
        { title: 'Хиты продаж', path: '/offers/top' },
        { title: 'Эксклюзив', path: '/offers/4' },
        { title: 'Выбор редакции', path: '/offers/5' },
        { title: 'Лимитированная серия', path: '/offers/6' }
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
                                    <div className="image-container">
                                        <img src={photoOFF} alt={offer.title} />
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