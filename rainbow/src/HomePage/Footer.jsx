import '../main.css'
import './Footer.css'
import { Link } from 'react-router-dom';
import logo from './img/logo.svg'



export default function Footer() {
    return (
        <>
            <footer>
                <div className="container">
                    <div className="footer-inner">
                        <div className='logo-footer'>
                            <Link to="/"><img src={logo} alt="" /></Link>
                            <Link to="Главная"> <h1>РАДУГА</h1> </Link>
                        </div>

                        <div className='contacts-footer'>
                            <b>+7 902 918-28-90</b>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}