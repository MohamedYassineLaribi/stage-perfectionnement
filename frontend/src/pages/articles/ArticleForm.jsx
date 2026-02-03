import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import articleService from '../../services/articleService';

const ArticleForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        name: '',
        type: 'Product',
        price: '',
        stockString: 'Disponible',
        description: ''
    });

    useEffect(() => {
        if (isEditMode) {
            // Load existing data
            const fetchData = async () => {
                try {
                    const data = await articleService.getById(id);
                    setFormData({
                        name: data.name,
                        type: data.type,
                        price: data.price,
                        stockString: data.stockString || '',
                        description: data.description || ''
                    });
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
        try {
            if (isEditMode) {
                await articleService.update(id, formData);
            } else {
                await articleService.create(formData);
            }
            navigate('/articles');
        } catch (error) {
            console.error(error);
            alert('Erreur lors de l\'enregistrement');
        }
    };

    return (
        <Container>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold">{isEditMode ? 'Modifier Article' : 'Nouvel Article'}</h3>
                <Button variant="light" onClick={() => navigate('/articles')}>Annuler</Button>
            </div>

            <Card className="border-0 shadow-sm">
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={8}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nom de l'article</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Type</Form.Label>
                                    <Form.Select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                    >
                                        <option value="Product">Produit</option>
                                        <option value="Service">Service</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Prix HT (€)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Statut Stock</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ex: 50 unités, Sur commande..."
                                        name="stockString"
                                        value={formData.stockString}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-4">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-end">
                            <Button variant="primary" type="submit" size="lg">
                                Enregistrer
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ArticleForm;
