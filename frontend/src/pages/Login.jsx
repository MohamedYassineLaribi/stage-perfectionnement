import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Card, Container, Row, Col, Alert } from 'react-bootstrap';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate(from, { replace: true });
        } catch (err) {
            setError('Échec de la connexion. Vérifiez vos identifiants.');
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', background: '#f3f6f9' }}>
            <div className="w-100" style={{ maxWidth: '400px' }}>
                <Card className="shadow-lg border-0 rounded-lg">
                    <Card.Body className="p-5">
                        <div className="text-center mb-4">
                            <h2 className="fw-bold mb-2" style={{
                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                fontSize: '2.5rem'
                            }}>
                                CRM App
                            </h2>
                            <p className="text-muted">Connectez-vous à votre compte</p>
                        </div>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="nom@exemple.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="p-3"
                                />
                            </Form.Group>

                            <Form.Group className="mb-4" controlId="password">
                                <Form.Label>Mot de passe</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="p-3"
                                />
                            </Form.Group>

                            <Button variant="primary" type="submit" className="w-100 p-3 fw-bold">
                                Se connecter
                            </Button>
                        </Form>
                    </Card.Body>
                    <Card.Footer className="text-center py-3 bg-light border-0 rounded-bottom">
                        <small className="text-muted">&copy; 2026 CRM</small>
                    </Card.Footer>
                </Card>
            </div>
        </Container>
    );
};

export default Login;
