import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'

const AuthLayout = () => {
    useEffect(() => {
        // Ajouter la classe bg-primary au body pour le style d'auth
        document.body.classList.add('bg-primary')
        return () => {
            document.body.classList.remove('bg-primary')
        }
    }, [])

    return (
        <div className="auth-main-v1">
            <div className="col-lg-12 col-xl-12 col-xxl-12">
                <Outlet />
            </div>
        </div>
    )
}

export default AuthLayout
