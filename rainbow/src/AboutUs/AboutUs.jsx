import '../main.css'
import './AboutUs.css'
import { Link } from 'react-router-dom'
import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';


import photoStore1 from './img/photoStore1.jpg'
import photoStore2 from './img/photoStore2.jpg'
import photoStore3 from './img/photoStore3.jpg'
import photoStore4 from './img/photoStore4.jpg'
import photoStore5 from './img/photoStore5.jpg'


export default function AboutUs() {
    return (
        <>
            <section className="aboutus">
                <div className="container">
                    <div className="aboutus-inner">
                        <div className='navigation'>
                            <Link to='/Главная'>Главная</Link>
                            <span>/</span>
                            <Link to='/О нас'>О компании</Link>
                        </div>

                        <h2>О нас</h2>
                        <p>"Радуга" — ваш надежный партнер в сфере сельского хозяйства и разведения животных. Мы специализируемся на продаже товаров для садоводов и кормов для домашних животных, таких как свиньи, куры и другие сельскохозяйственные животные.

                            В нашем ассортименте вы найдете все необходимое для успешного ведения садоводства: семена, удобрения, садовые инструменты и аксессуары, которые помогут вам вырастить богатый урожай и создать красивый сад.

                            Кроме того, мы предлагаем высококачественные корма для животных, обеспечивая их полноценное и сбалансированное питание. Наши корма разработаны с учетом потребностей различных видов животных и содержат все необходимые витамины и минералы для их здоровья и продуктивности.

                            Наша команда профессионалов всегда готова предоставить вам консультации и рекомендации по выбору товаров, чтобы вы могли достичь наилучших результатов в своем хозяйстве.

                            С "Радугой" ваш сад будет процветать, а ваши животные — здоровыми и продуктивными!</p>


                    </div>

                    <h3 className='aboutus-img-subtitle'>Ассортимент нашего магазина</h3>
                    <Swiper
                        pagination={{
                            dynamicBullets: true,
                        }}
                        modules={[Pagination]}
                        className="mySwiper"
                    >
                        <SwiperSlide><img src={photoStore1} alt="" /></SwiperSlide>
                        <SwiperSlide><img src={photoStore2} alt="" /></SwiperSlide>
                        <SwiperSlide><img src={photoStore3} alt="" /></SwiperSlide>
                        <SwiperSlide><img src={photoStore4} alt="" /></SwiperSlide>
                        <SwiperSlide><img src={photoStore5} alt="" /></SwiperSlide>

                    </Swiper>
                </div>

            </section>
        </>
    )
}