import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, Tab, Badge, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';
import DocumentManager from '../../components/DocumentManager';
import ActivityTimeline from '../../components/ActivityTimeline';
import PageHeader from '../../components/PageHeader';
import contactService from '../../services/contactService';

const CustomerView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                // Using contactService as customers are essentially contacts with type 'Customer'
                const data = await contactService.getById(id);
                setCustomer(data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchCustomer();
    }, [id]);

    if (loading) return <div className="p-5 text-center">Chargement...</div>;
    if (!customer) return <div className="p-5 text-center text-danger">Client introuvable</div>;

    return (
        <Container fluid>
            <PageHeader
                title={`${customer.firstName} ${customer.lastName}`}
                breadcrumb={[{ label: 'Clients', path: '/customers' }, { label: customer.companyName || 'Détails' }]}
            />

            <Row className="g-4">
                <Col xl={4}>
                    {/* Customer Profile Card */}
                    <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                        <div className="bg-primary bg-gradient py-5 text-center position-relative">
                            <div className="avatar bg-white text-primary rounded-circle mx-auto d-flex align-items-center justify-content-center shadow-lg" style={{ width: '80px', height: '80px', fontSize: '32px' }}>
                                {customer.firstName.charAt(0)}
                            </div>
                            <Button variant="light" size="sm" className="position-absolute bottom-0 end-0 m-3 rounded-circle p-2 shadow-sm" onClick={() => navigate(`/customers/edit/${id}`)}>
                                <FeatherIcon icon="edit-2" size="14" />
                            </Button>
                        </div>
                        <Card.Body className="text-center pt-4 pb-4">
                            <h5 className="fw-bold mb-1">{customer.firstName} {customer.lastName}</h5>
                            <p className="text-muted mb-3">{customer.companyName}</p>
                            <div className="d-flex justify-content-center gap-2">
                                <Badge bg="primary-subtle" text="primary" pill className="px-3">Client Actif</Badge>
                                <Badge bg="light" text="dark" pill className="px-3">ID: #{id.slice(-4)}</Badge>
                            </div>
                        </Card.Body>
                        <Card.Footer className="bg-transparent border-top-light py-3">
                            <div className="d-grid gap-2">
                                <a href={`mailto:${customer.email}`} className="btn btn-outline-primary btn-sm rounded-pill py-2">
                                    <FeatherIcon icon="mail" size="14" className="me-2" /> {customer.email}
                                </a>
                                {customer.phone && (
                                    <a href={`tel:${customer.phone}`} className="btn btn-light btn-sm rounded-pill py-2 text-muted">
                                        <FeatherIcon icon="phone" size="14" className="me-2" /> {customer.phone}
                                    </a>
                                )}
                            </div>
                        </Card.Footer>
                    </Card>

                    {/* Quick Stats */}
                    <Card className="border-0 shadow-sm rounded-4 p-3 mb-4">
                        <h6 className="fw-bold mb-3 small text-uppercase text-muted">Informations Supplémentaires</h6>
                        <div className="mb-2 d-flex justify-content-between">
                            <span className="text-muted small">Type:</span>
                            <span className="fw-bold small">{customer.type || 'Standard'}</span>
                        </div>
                        <div className="mb-2 d-flex justify-content-between">
                            <span className="text-muted small">Date d'ajout:</span>
                            <span className="fw-bold small">{new Date(customer.createdAt).toLocaleDateString()}</span>
                        </div>
                    </Card>
                </Col>

                <Col xl={8}>
                    <Tab.Container defaultActiveKey="profile">
                        <Card className="border-0 shadow-sm rounded-4 mb-4">
                            <Card.Header className="bg-transparent border-0 p-3 pb-0">
                                <Nav variant="tabs" className="border-0 custom-tabs">
                                    <Nav.Item>
                                        <Nav.Link eventKey="profile" className="px-4 py-3 fw-bold small text-uppercase border-0">
                                            Profil Détallé
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="documents" className="px-4 py-3 fw-bold small text-uppercase border-0">
                                            Documents (GED)
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="timeline" className="px-4 py-3 fw-bold small text-uppercase border-0">
                                            Historique
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Card.Header>
                            <Tab.Content className="p-4">
                                <Tab.Pane eventKey="profile">
                                    <Row className="gy-4">
                                        <Col md={6}>
                                            <label className="text-muted smaller text-uppercase fw-bold mb-1">Adresse</label>
                                            <p className="fw-bold">{customer.address || 'Non spécifiée'}</p>
                                        </Col>
                                        <Col md={6}>
                                            <label className="text-muted smaller text-uppercase fw-bold mb-1">Note de CRM</label>
                                            <p className="border p-3 rounded-3 bg-light opacity-75 small">
                                                {customer.notes || "Aucune note particulière pour ce client. Utilisez cet espace pour ajouter des détails sur ses préférences ou son historique d'achats."}
                                            </p>
                                        </Col>
                                    </Row>
                                </Tab.Pane>
                                <Tab.Pane eventKey="documents">
                                    <DocumentManager entityId={id} entityType="customer" />
                                </Tab.Pane>
                                <Tab.Pane eventKey="timeline">
                                    <ActivityTimeline />
                                </Tab.Pane>
                            </Tab.Content>
                        </Card>
                    </Tab.Container>
                </Col>
            </Row>
        </Container>
    );
};

export default CustomerView;
