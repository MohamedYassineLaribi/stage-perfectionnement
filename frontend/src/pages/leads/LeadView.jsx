import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, Tab, Badge, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';
import DocumentManager from '../../components/DocumentManager';
import ActivityTimeline from '../../components/ActivityTimeline';
import PageHeader from '../../components/PageHeader';
import leadService from '../../services/leadService';

const LeadView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [lead, setLead] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLead = async () => {
            try {
                const data = await leadService.getById(id);
                setLead(data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchLead();
    }, [id]);

    if (loading) return <div className="p-5 text-center">Chargement...</div>;
    if (!lead) return <div className="p-5 text-center text-danger">Lead introuvable</div>;

    return (
        <Container fluid>
            <PageHeader
                title={lead.name}
                breadcrumb={[{ label: 'Leads', path: '/leads' }, { label: lead.company || 'Détails' }]}
            />

            <Row className="g-4">
                <Col xl={4}>
                    <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                        <div className="bg-warning bg-gradient py-5 text-center position-relative">
                            <div className="avatar bg-white text-warning rounded-circle mx-auto d-flex align-items-center justify-content-center shadow-lg" style={{ width: '80px', height: '80px', fontSize: '32px' }}>
                                {lead.name.charAt(0)}
                            </div>
                        </div>
                        <Card.Body className="text-center pt-4 pb-4">
                            <h5 className="fw-bold mb-1">{lead.name}</h5>
                            <p className="text-muted mb-3">{lead.company}</p>
                            <div className="d-flex justify-content-center gap-2">
                                <Badge bg="warning-subtle" text="warning" pill className="px-3">{lead.status}</Badge>
                                <Badge bg="light" text="dark" pill className="px-3">Lead</Badge>
                            </div>
                        </Card.Body>
                        <Card.Footer className="bg-transparent border-top-light py-3">
                            <div className="d-grid gap-2">
                                <a href={`mailto:${lead.email}`} className="btn btn-outline-warning btn-sm rounded-pill py-2 text-dark">
                                    <FeatherIcon icon="mail" size="14" className="me-2" /> {lead.email}
                                </a>
                                <Button variant="primary" size="sm" className="rounded-pill py-2" onClick={() => navigate('/contacts')}>
                                    <FeatherIcon icon="user-plus" size="14" className="me-2" /> Convertir en Contact
                                </Button>
                            </div>
                        </Card.Footer>
                    </Card>

                    <Card className="border-0 shadow-sm rounded-4 p-3 mb-4">
                        <h6 className="fw-bold mb-3 small text-uppercase text-muted">Source du Lead</h6>
                        <div className="d-flex align-items-center">
                            <div className="p-2 bg-light rounded-3 text-secondary me-3">
                                <FeatherIcon icon="globe" size="20" />
                            </div>
                            <div>
                                <h6 className="mb-0 fw-bold small">{lead.source || 'Direct'}</h6>
                                <span className="text-muted smaller">Provenant du formulaire web</span>
                            </div>
                        </div>
                    </Card>
                </Col>

                <Col xl={8}>
                    <Tab.Container defaultActiveKey="profile">
                        <Card className="border-0 shadow-sm rounded-4 mb-4">
                            <Card.Header className="bg-transparent border-0 p-3 pb-0">
                                <Nav variant="tabs" className="border-0 custom-tabs">
                                    <Nav.Item>
                                        <Nav.Link eventKey="profile" className="px-4 py-3 fw-bold small text-uppercase border-0 text-warning">
                                            Analyse du Lead
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="documents" className="px-4 py-3 fw-bold small text-uppercase border-0">
                                            Fichiers
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="timeline" className="px-4 py-3 fw-bold small text-uppercase border-0">
                                            Actions
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Card.Header>
                            <Tab.Content className="p-4">
                                <Tab.Pane eventKey="profile">
                                    <label className="text-muted smaller text-uppercase fw-bold mb-2">Qualifications</label>
                                    <p className="small">Potentiel de conversion estimé à 75%. Le prospect semble intéressé par les solutions domotiques haut de gamme.</p>
                                    <hr />
                                    <label className="text-muted smaller text-uppercase fw-bold mb-2">Détails techniques</label>
                                    <p className="small">Contacté via Landing Page #4. Navigateur: Chrome Desktop.</p>
                                </Tab.Pane>
                                <Tab.Pane eventKey="documents">
                                    <DocumentManager entityId={id} entityType="lead" />
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

export default LeadView;
