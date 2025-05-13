import '../main.css'
import './PaymentPage.css'
import { useState, useEffect } from 'react'

export default function PaymentPage() {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 2500)
        return () => clearTimeout(timer)
    }, [])

    return (
        <section className='paymentpage'>
            <div className="container">
                <div className="paymentpage-inner">
                    {loading ? (
                        <div className="loader-wrapper">
                            <div className="loader"></div>
                            <p>Отправляем заказ администратору...</p>
                        </div>
                    ) : (
                        <h2>Заказ отправлен администратору,<br />ожидайте ответа</h2>
                    )}
                </div>
            </div>
        </section>
    )
}
