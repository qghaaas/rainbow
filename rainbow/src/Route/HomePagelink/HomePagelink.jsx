import '../../HomePage/Header'
import Header from '../../HomePage/Header'
import Catalog from '../../HomePage/Сatalog'
import Offers from '../../HomePage/Offers'
import Footer from '../../HomePage/Footer'
import { useState } from 'react';


export default function HomePagelink() {
    const [searchQuery, setSearchQuery] = useState('');
    return (
        <>
            <Header onSearch={setSearchQuery} />
            <Catalog searchQuery={searchQuery} />
            <Offers />
            <Footer />
        </>
    )
}