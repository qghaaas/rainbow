import '../../HomePage/Header'
import Header from '../../HomePage/Header'
import Offers from '../../HomePage/Offers'
import Catalog from '../../HomePage/Сatalog'
import Footer from '../../HomePage/Footer'
import { useState } from 'react';
import StoreMap from '../../StoreMap/StoreMap'

export default function HomePagelink() {
    const [searchQuery, setSearchQuery] = useState('');
    return (
        <>
            <Header onSearch={setSearchQuery} />
            <Offers />
            <Catalog searchQuery={searchQuery} />
            <StoreMap />
            <Footer />
        </>
    )
}