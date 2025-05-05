import { useParams } from 'react-router-dom';
import Catalog from '../HomePage/Сatalog';
import './OfferPage.css'

export default function OfferPage() {
    const { type } = useParams();
    
    const pageTitles = {
        new: 'Новинки',
        top: 'Хиты продаж',
        sales: 'Акции'
    };

    const getOfferType = () => {
        switch(type) {
            case 'new': return 'new';
            case 'top': return 'top-sellers';
            default: return null;
        }
    }

    return (
        <section className="offer-page">
            <div className="container">
                <h1>{pageTitles[type] || 'Специальные предложения'}</h1>
                <Catalog 
                    offerType={getOfferType()}
                    hideAddToCart={false} 
                />
            </div>
        </section>
    );
}