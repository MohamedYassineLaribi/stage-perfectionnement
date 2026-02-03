import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@hooks/useAuth'
import * as Icon from 'feather-icons-react'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        const result = await login(email, password)

        if (result.success) {
            navigate('/')
        }

        setLoading(false)
    }

    return (
        <div className="row align-items-center justify-content-center">
            <div className="col-md-6 col-lg-5 col-xl-4 col-xxl-3">
                <div className="card my-5">
                    <div className="card-body p-4">
                        <div className="text-center mb-4">
                            <Link to="/" className="d-block mb-4">
                                <img src="/assets/images/logo-full.png" alt="Logo" className="img-fluid" style={{ maxWidth: '150px' }} />
                            </Link>
                            <h4 className="fw-bold">Connexion</h4>
                            <p className="fs-12 text-muted">Connectez-vous à votre compte CRM App</p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label text-dark">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="votre@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <div className="d-flex justify-content-between">
                                    <label className="form-label text-dark">Mot de passe</label>
                                    <Link to="/auth/forgot-password" className="fs-12 text-primary">Mot de passe oublié?</Link>
                                </div>
                                <div className="input-group">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className="form-control"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-light-brand"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <Icon.EyeOff size={16} /> : <Icon.Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" id="remember" />
                                    <label className="form-check-label fs-13" htmlFor="remember">
                                        Se souvenir de moi
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-100"
                                disabled={loading}
                            >
                                {loading ? 'Connexion...' : 'Se connecter'}
                            </button>
                        </form>

                        <div className="text-center mt-4">
                            <p className="fs-13 text-muted">
                                Pas encore de compte?{' '}
                                <Link to="/auth/register" className="text-primary fw-semibold">S'inscrire</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
