import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@hooks/useAuth'
import * as Icon from 'feather-icons-react'
import { toast } from 'react-toastify'

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [loading, setLoading] = useState(false)
    const { register } = useAuth()
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (formData.password !== formData.confirmPassword) {
            toast.error('Les mots de passe ne correspondent pas')
            return
        }

        setLoading(true)
        const result = await register(formData)

        if (result.success) {
            navigate('/')
        }

        setLoading(false)
    }

    return (
        <div className="row align-items-center justify-content-center">
            <div className="col-md-8 col-lg-6 col-xl-5 col-xxl-4">
                <div className="card my-5">
                    <div className="card-body p-4">
                        <div className="text-center mb-4">
                            <Link to="/" className="d-block mb-4">
                                <img src="/assets/images/logo-full.png" alt="Logo" className="img-fluid" style={{ maxWidth: '150px' }} />
                            </Link>
                            <h4 className="fw-bold">Créer un compte</h4>
                            <p className="fs-12 text-muted">Rejoignez CRM App</p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label text-dark">Nom complet</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-dark">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    placeholder="votre@email.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label text-dark">Mot de passe</label>
                                    <input
                                        type="password"
                                        name="password"
                                        className="form-control"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label text-dark">Confirmer</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        className="form-control"
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                {loading ? 'Création...' : 'Créer mon compte'}
                            </button>
                        </form>

                        <div className="text-center mt-4">
                            <p className="fs-13 text-muted">
                                Déjà un compte?{' '}
                                <Link to="/auth/login" className="text-primary fw-semibold">Se connecter</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register
