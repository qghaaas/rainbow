import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import './StoreMap.css'

const storeCoordinates = [55.540526, 89.198854];

export default function StoreMap() {
  return (
    <section className="store-map-container">
      <div className='store-map-inner'>
        <h2 className="store-map-title">Геолокация нашего магазин</h2>
        <div className="store-map-box">
          <YMaps query={{ lang: 'ru_RU', load: 'package.full' }}>
            <Map
              defaultState={{
                center: storeCoordinates,
                zoom: 17,
                controls: ['zoomControl', 'fullscreenControl'],
              }}
              modules={[
                'control.ZoomControl',
                'control.FullscreenControl',
                'geolocation',
              ]}
              className="store-map"
              options={{
                suppressMapOpenBlock: true,
              }}
            >
              <Placemark
                geometry={storeCoordinates}
                properties={{
                  balloonContentHeader: '🛒 Магазин',
                  balloonContentBody: 'Кирова 6а, Шарыпово',
                  balloonContentFooter: 'Открыто с 9:00 до 20:00',
                  hintContent: 'Магазин',
                }}
                options={{
                  iconLayout: 'default#image',
                  iconImageHref: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
                  iconImageSize: [40, 40],
                  iconImageOffset: [-20, -40],
                }}
              />
            </Map>
          </YMaps>
        </div>
      </div>
    </section>
  );
}
