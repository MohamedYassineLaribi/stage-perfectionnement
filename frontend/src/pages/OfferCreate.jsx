import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col, Table, InputGroup } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
// Using feather-icons-react
import FeatherIcon from 'feather-icons-react';

import contactService from '../services/contactService';
import articleService from '../services/articleService';
import offerService from '../services/offerService';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';

import api from '../services/api';

const OfferCreate = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    // Data sources
    const [contacts, setContacts] = useState([]);
    const [articles, setArticles] = useState([]);

    // Form State
    const [reference, setReference] = useState(`OFF-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`);
    const [title, setTitle] = useState('');
    const [selectedClient, setSelectedClient] = useState('');
    const [validUntil, setValidUntil] = useState('');
    const [offerType, setOfferType] = useState('Standard');
    const [allowedOfferTypes, setAllowedOfferTypes] = useState(['Standard', 'Récursion', 'Service', 'Produit']);
    const [notes, setNotes] = useState('');

    // Line Items State
    const [items, setItems] = useState([]);

    // Loading State
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch dependencies and existing offer if in edit mode
        const fetchData = async () => {
            try {
                const [contactsData, articlesData, settingsRes] = await Promise.all([
                    contactService.getAll(),
                    articleService.getAll(),
                    api.get('/settings')
                ]);
                setContacts(contactsData);
                setArticles(articlesData);
                if (settingsRes.data?.offerTypes?.length > 0) {
                    setAllowedOfferTypes(settingsRes.data.offerTypes);
                }

                if (isEditMode) {
                    const offerData = await offerService.getById(id);
                    setReference(offerData.reference);
                    setTitle(offerData.title);
                    setSelectedClient(offerData.client?._id || offerData.client);
                    setValidUntil(offerData.validUntil ? new Date(offerData.validUntil).toISOString().split('T')[0] : '');
                    setOfferType(offerData.offerType || 'Standard');
                    setNotes(offerData.notes || '');
                    setItems(offerData.items.map(item => ({
                        articleId: item.article?._id || item.article,
                        description: item.description,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        discount: item.discount,
                        total: item.totalLine
                    })));
                }

                setLoading(false);
            } catch (error) {
                console.error("Error fetching data", error);
                toast.error("Impossible de charger les données nécessaires.");
                setLoading(false);
            }
        };
        fetchData();
    }, [id, isEditMode]);

    // Add new line item
    const addItem = () => {
        setItems([...items, { articleId: '', description: '', quantity: 1, unitPrice: 0, discount: 0, total: 0 }]);
    };

    // Remove line item
    const removeItem = (index) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };

    // Update line item
    const updateItem = (index, field, value) => {
        const newItems = [...items];
        const item = newItems[index];

        if (field === 'articleId') {
            const article = articles.find(a => a._id === value);
            if (article) {
                item.articleId = value;
                item.description = article.name; // description default
                item.unitPrice = article.price;
            }
        } else {
            item[field] = value;
        }

        // Recalculate total for line
        // Total = (Price * Qty) * (1 - Discount/100)
        const qty = parseFloat(item.quantity) || 0;
        const price = parseFloat(item.unitPrice) || 0;
        const discount = parseFloat(item.discount) || 0;

        item.total = (qty * price) * (1 - discount / 100);

        setItems(newItems);
    };

    // Calculate Grand Total
    const calculateTotalHT = () => items.reduce((acc, item) => acc + (item.total || 0), 0);
    const taxRate = 20; // 20%
    const calculateTotalTTC = () => calculateTotalHT() * (1 + taxRate / 100);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const offerData = {
            reference,
            title,
            client: selectedClient,
            offerType,
            validUntil,
            notes,
            items: items.map(item => ({
                article: item.articleId,
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                discount: item.discount
            }))
        };

        try {
            if (isEditMode) {
                await offerService.update(id, offerData);
                toast.success('Offre mise à jour avec succès !');
            } else {
                await offerService.create(offerData);
                toast.success('Offre créée avec succès !');
            }
            navigate('/offers');
        } catch (error) {
            console.error(error);
            toast.error(`Erreur lors de l'enregistrement: ${error.response?.data?.message || error.message}`);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold">{isEditMode ? 'Modifier l\'Offre' : 'Nouvelle Offre'}</h3>
                <Button variant="light" onClick={() => navigate('/offers')}>Annuler</Button>
            </div>

            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={8}>
                        {/* Information Générale */}
                        <Card className="border-0 shadow-sm mb-4">
                            <Card.Header className="bg-white py-3 fw-bold">Informations Générales</Card.Header>
                            <Card.Body>
                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group controlId="reference">
                                            <Form.Label>Référence</Form.Label>
                                            <Form.Control type="text" value={reference} readOnly />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="title">
                                            <Form.Label>Titre de l'offre</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Ex: Refonte site web"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group controlId="client">
                                            <Form.Label>Client</Form.Label>
                                            <Form.Select
                                                value={selectedClient}
                                                onChange={(e) => setSelectedClient(e.target.value)}
                                                required
                                            >
                                                <option value="">Sélectionner un client...</option>
                                                {contacts.map(c => (
                                                    <option key={c._id} value={c._id}>
                                                        {c.companyName || `${c.firstName} ${c.lastName}`}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group controlId="offerType">
                                            <Form.Label>Type d'offre</Form.Label>
                                            <Form.Select
                                                value={offerType}
                                                onChange={(e) => setOfferType(e.target.value)}
                                            >
                                                {allowedOfferTypes.map(t => (
                                                    <option key={t} value={t}>{t}</option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group controlId="validUntil">
                                            <Form.Label>Date de validité</Form.Label>
                                            <Form.Control
                                                type="date"
                                                value={validUntil}
                                                onChange={(e) => setValidUntil(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        {/* Articles / Lignes */}
                        <Card className="border-0 shadow-sm mb-4">
                            <Card.Header className="bg-white py-3 fw-bold d-flex justify-content-between align-items-center">
                                <span>Articles & Services</span>
                                <Button variant="primary" size="sm" onClick={addItem}>
                                    <FeatherIcon icon="plus" size="14" className="me-1" /> Ajouter une ligne
                                </Button>
                            </Card.Header>
                            <Card.Body className="p-0">
                                <Table responsive hover className="mb-0">
                                    <thead className="bg-light">
                                        <tr>
                                            <th style={{ width: '30%' }}>Article</th>
                                            <th style={{ width: '10%' }}>Qté</th>
                                            <th style={{ width: '15%' }}>Prix Unit.</th>
                                            <th style={{ width: '10%' }}>Remise %</th>
                                            <th style={{ width: '15%' }} className="text-end">Total HT</th>
                                            <th style={{ width: '5%' }}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.length === 0 && (
                                            <tr>
                                                <td colSpan="6" className="text-center py-4 text-muted">
                                                    Aucun article ajouté.
                                                </td>
                                            </tr>
                                        )}
                                        {items.map((item, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <Form.Select
                                                        value={item.articleId}
                                                        onChange={(e) => updateItem(index, 'articleId', e.target.value)}
                                                        className="mb-2"
                                                        required
                                                    >
                                                        <option value="">Chosir...</option>
                                                        {articles.map(a => (
                                                            <option key={a._id} value={a._id}>{a.name}</option>
                                                        ))}
                                                    </Form.Select>
                                                    <Form.Control
                                                        type="text"
                                                        size="sm"
                                                        placeholder="Description..."
                                                        value={item.description}
                                                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <Form.Control
                                                        type="number"
                                                        min="1"
                                                        value={item.quantity}
                                                        onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                                                        required
                                                    />
                                                </td>
                                                <td>
                                                    <InputGroup>
                                                        <Form.Control
                                                            type="number"
                                                            value={item.unitPrice}
                                                            onChange={(e) => updateItem(index, 'unitPrice', e.target.value)}
                                                            required
                                                        />
                                                        <InputGroup.Text>€</InputGroup.Text>
                                                    </InputGroup>
                                                </td>
                                                <td>
                                                    <InputGroup>
                                                        <Form.Control
                                                            type="number"
                                                            min="0" max="100"
                                                            value={item.discount}
                                                            onChange={(e) => updateItem(index, 'discount', e.target.value)}
                                                        />
                                                        <InputGroup.Text>%</InputGroup.Text>
                                                    </InputGroup>
                                                </td>
                                                <td className="text-end fw-bold align-middle">
                                                    {item.total.toFixed(2)} €
                                                </td>
                                                <td className="align-middle">
                                                    <Button variant="link" className="text-danger p-0" onClick={() => removeItem(index)}>
                                                        <FeatherIcon icon="trash-2" size="18" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>

                        <Form.Group className="mb-4">
                            <Form.Label>Notes internes / Conditions</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </Form.Group>
                    </Col>

                    <Col md={4}>
                        <Card className="border-0 shadow-sm mb-4">
                            <Card.Body>
                                <h5 className="fw-bold mb-4">Récapitulatif</h5>
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Total HT</span>
                                    <span className="fw-bold">{calculateTotalHT().toFixed(2)} €</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">TVA (20%)</span>
                                    <span>{(calculateTotalHT() * 0.20).toFixed(2)} €</span>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between mb-4">
                                    <span className="fs-5 fw-bold">Total TTC</span>
                                    <span className="fs-5 fw-bold text-primary">{calculateTotalTTC().toFixed(2)} €</span>
                                </div>
                                <Button variant="success" size="lg" className="w-100" type="submit" disabled={items.length === 0 || !selectedClient}>
                                    {isEditMode ? 'Enregistrer les modifications' : 'Créer l\'Offre'}
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default OfferCreate;
