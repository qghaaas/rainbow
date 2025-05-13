import { Route, Routes } from "react-router-dom";
import { HashRouter } from "react-router-dom";
import HomePagelink from "./Route/HomePagelink/HomePagelink";
import Login from "./User/Login";
import Registration from "./User/Registration";
import CatalogPagelink from "./Route/CatalogPagelink/CatalogPagelink";
import ProductPagelink from "./Route/ProductPagelink/ProductPagelink";
import BasketPagelink from "./Route/BasketPagelink/BasketPagelink";
import { CartProvider } from './CartContext'
import AboutUslink from "./Route/AboutUslink/AboutUslink";
import AdminPanel from "./Admin/AdminPanel";
import AdminLogin from "./Admin/AdminLogin";
import Aboutpaymentlink from "./Route/Aboutpaymentlink/Aboutpaymentlink";
import { AuthProvider } from './AuthContext.jsx';
import Profile from './User/Profile';
import PaymentPagelink from "./Route/PaymentPagelink/PaymentPagelink.jsx";
import OfferPage from "./OfferPage/OfferPage.jsx";
import SpecialOfferslink from "./Route/SpecialOfferslink/SpecialOfferslink.jsx";


export default function MainRouter() {
    return (
        <>
            <AuthProvider>
                <CartProvider>
                    <HashRouter>

                        <Routes>

                            <Route path="/" index element={<HomePagelink />} />
                            <Route path="/Главная" element={<HomePagelink />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/registration" element={<Registration />} />
                            <Route path="/Каталог" element={<CatalogPagelink />} />
                            <Route path="/Каталог" element={<CatalogPagelink />} />
                            <Route path="/product/:id" element={<ProductPagelink />} />
                            <Route path="/basket" element={<BasketPagelink />} />
                            <Route path="/basket" element={<BasketPagelink />} />
                            <Route path="/admin" element={<AdminPanel />} />
                            <Route path="/admin/login" element={<AdminLogin />} />
                            <Route path="/О нас" element={<AboutUslink />} />
                            <Route path="/Об оплате" element={<Aboutpaymentlink />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/paymentpage" element={<PaymentPagelink />} />
                            <Route path="/offers/:type" element={<OfferPage />} />
                            <Route path="/special-offers" element={<SpecialOfferslink/>} />

                        </Routes>

                    </HashRouter>
                </CartProvider>
            </AuthProvider>
        </>
    )
}