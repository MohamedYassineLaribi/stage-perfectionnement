import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import contactService from '../../services/contactService';

const ContactForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [type, setType] = useState('Person'); // Person or Company
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        companyName: '',
        email: '',
        phone: '',
        address: '',
        taxId: ''
    });

    useEffect(() => {
        if (isEditMode) {
            const fetchData = async () => {
                try {
                    const data = await contactService.getById(id);
                    setType(data.type);
                    setFormData(data);
                } catch (error) {
                    console.error(error);
                }
            };
            fetchData();
        }
    }, [id, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dataToSend = { ...formData, type };

        try {
            if (isEditMode) {
                await contactService.update(id, dataToSend);
            } else {
                await contactService.create(dataToSend);
            }
            navigate('/contacts');
        } catch (error) {
            console.error(error);
            alert('Erreur lors de l\'enregistrement');
        }
    };

    return (
        <Container>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold">{isEditMode ? 'Modifier Contact' : 'Nouveau Contact'}</h3>
                <Button variant="light" onClick={() => navigate('/contacts')}>Annuler</Button>
            </div>

            <Card className="border-0 shadow-sm">
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-4">
                            <Form.Label>Type de Contact</Form.Label>
                            <div>
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="Particulier (Personne)"
                                    name="typeGroup"
                                    checked={type === 'Person'}
                                    onChange={() => setType('Person')}
                                />
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="Entreprise"
                                    name="typeGroup"
                                    checked={type === 'Company'}
                                    onChange={() => setType('Company')}
                                />
                            </div>
                        </Form.Group>

                        {type === 'Person' ? (
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Prénom</Form.Label>
                                        <Form.Control type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Nom</Form.Label>
                                        <Form.Control type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
                                    </Form.Group>
                                </Col>
                            </Row>
                        ) : (
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Raison Sociale</Form.Label>
                                        <Form.Control type="text" name="companyName" value={formData.companyName} onChange={handleChange} required />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Numéro SIRET / TVA</Form.Label>
                                        <Form.Control type="text" name="taxId" value={formData.taxId} onChange={handleChange} />
                                    </Form.Group>
                                </Col>
                            </Row>
                        )}

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Téléphone</Form.Label>
                                    <Form.Control type="text" name="phone" value={formData.phone} onChange={handleChange} />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-4">
                            <Form.Label>Adresse</Form.Label>
                            <Form.Control as="textarea" rows={2} name="address" value={formData.address} onChange={handleChange} />
                        </Form.Group>

                        <div className="d-flex justify-content-end">
                            <Button variant="primary" type="submit" size="lg">Enregistrer</Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ContactForm;
