import { useState } from 'react'
import { Link } from 'react-router-dom'
import * as Icon from 'feather-icons-react'
import { toast } from 'react-toastify'

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        // Simulate API call
        setTimeout(() => {
            setSent(true)
            setLoading(false)
            toast.success('Email de réinitialisation envoyé!')
        }, 1500)
    }

    if (sent) {
        return (
            <div className="auth-form text-center">
                <div className="mb-4">
                    <div className="avatar avatar-xl bg-success text-white mx-auto mb-3">
                        <Icon.CheckCircle size={40} />
                    </div>
                    <h3 className="fw-bold">Email envoyé!</h3>
                    <p className="text-muted">
                        Vérifiez votre boîte de réception pour réinitialiser votre mot de passe
                    </p>
                </div>
                <Link to="/auth/login" className="btn btn-primary">
                    Retour à la connexion
                </Link>
            </div>
        )
    }

    return (
        <div className="auth-form">
            <div className="text-center mb-4">
                <h3 className="fw-bold">Mot de passe oublié?</h3>
                <p className="text-muted">Entrez votre email pour réinitialiser</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        placeholder="votre@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                    {loading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" />
                            Envoi...
                        </>
                    ) : (
                        'Envoyer le lien'
                    )}
                </button>
            </form>

            <div className="text-center mt-4">
                <Link to="/auth/login" className="text-primary">
                    <Icon.ArrowLeft size={14} className="me-2" />
                    Retour à la connexion
                </Link>
            </div>
        </div>
    )
}

export default ForgotPassword
