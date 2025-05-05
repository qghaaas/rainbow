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
                            <p>Проверяем платёжную систему...</p>
                        </div>
                    ) : (
                        <h2>Сервис временно недоступен,<br />приносим свои извинения</h2>
                    )}
                </div>
            </div>
        </section>
    )
}
