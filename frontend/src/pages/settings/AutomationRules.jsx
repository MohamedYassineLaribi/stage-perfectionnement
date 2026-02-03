import React, { useState } from 'react';
import { Container, Card, Table, Button, Badge, Modal, Form, Row, Col } from 'react-bootstrap';
import FeatherIcon from 'feather-icons-react';
import PageHeader from '../../components/PageHeader';

const AutomationRules = () => {
    const [rules, setRules] = useState([
        { id: 1, name: 'Nouveau Lead -> Tâche Auto', trigger: 'Lead Créé', action: 'Créer Appel Rappel', enabled: true },
        { id: 2, name: 'Offre Acceptée -> Facture', trigger: 'Offre Gagnée', action: 'Générer Brouillon Facture', enabled: true },
        { id: 3, name: 'Inactivité 30j -> Rappel', trigger: 'Dernière Activité > 30j', action: 'Notifier Commercial', enabled: false }
    ]);
    const [showModal, setShowModal] = useState(false);

    return (
        <Container fluid>
            <PageHeader title="Automatisation & Workflows" breadcrumb={[{ label: 'Configuration' }, { label: 'Workflows' }]} />

            <Card className="border-0 shadow-sm rounded-4 mb-4">
                <Card.Header className="bg-transparent border-0 d-flex justify-content-between align-items-center py-3">
                    <h5 className="fw-bold mb-0">Règles d'automatisation</h5>
                    <Button variant="primary" size="sm" className="rounded-pill px-3" onClick={() => setShowModal(true)}>
                        <FeatherIcon icon="plus" size="14" className="me-2" />
                        Nouvelle Règle
                    </Button>
                </Card.Header>
                <Card.Body className="p-0">
                    <Table hover responsive className="mb-0 align-middle">
                        <thead className="bg-light">
                            <tr>
                                <th className="border-0 px-4">Nom de la règle</th>
                                <th className="border-0">Déclencheur (Trigger)</th>
                                <th className="border-0">Action Automatique</th>
                                <th className="border-0">Statut</th>
                                <th className="border-0 text-end pe-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rules.map(rule => (
                                <tr key={rule.id}>
                                    <td className="px-4 fw-bold text-dark small">{rule.name}</td>
                                    <td><Badge bg="light" text="dark" className="border fw-normal">{rule.trigger}</Badge></td>
                                    <td><Badge bg="primary-subtle" text="primary" className="fw-normal">{rule.action}</Badge></td>
                                    <td>
                                        <Form.Check
                                            type="switch"
                                            checked={rule.enabled}
                                            onChange={() => setRules(rules.map(r => r.id === rule.id ? { ...r, enabled: !r.enabled } : r))}
                                        />
                                    </td>
                                    <td className="text-end pe-4">
                                        <Button variant="link" size="sm" className="p-1 text-muted"><FeatherIcon icon="edit-2" size="14" /></Button>
                                        <Button variant="link" size="sm" className="p-1 text-danger"><FeatherIcon icon="trash-2" size="14" /></Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            <Alert variant="info" className="rounded-4 border-0 shadow-sm d-flex align-items-center">
                <FeatherIcon icon="info" size="20" className="me-3" />
                <div className="small">
                    <strong>Conseil:</strong> Les automatisations s'exécutent en arrière-plan dès qu'un changement de données est détecté sur le serveur.
                </div>
            </Alert>

            {/* Mock Modal for Rule Creation */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
                <Modal.Header closeButton className="border-0 bg-light">
                    <Modal.Title className="fw-bold fs-5">🚀 Configurer une Automatisation Intelligence</Modal.Title>
                </Modal.Header>
                <Modal.Body className="py-4 px-4">
                    <Row className="g-4">
                        <Col md={12}>
                            <Form.Label className="small fw-bold text-uppercase text-muted">Nom de la règle</Form.Label>
                            <Form.Control placeholder="Ex: Alert Qualité Devis" className="rounded-4 py-2 border-light shadow-sm bg-light" />
                        </Col>

                        <Col md={6}>
                            <div className="p-3 bg-primary-subtle rounded-4 h-100 border border-primary border-opacity-10">
                                <Form.Label className="small fw-bold text-primary text-uppercase mb-3 d-flex align-items-center">
                                    <FeatherIcon icon="zap" size="14" className="me-2" />
                                    SI Cet événement...
                                </Form.Label>
                                <Form.Select className="rounded-3 border-0 shadow-sm py-2">
                                    <optgroup label="Leads">
                                        <option>Nouveau Lead créé</option>
                                        <option>Lead change de statut</option>
                                        <option>Lead assigné à un commercial</option>
                                    </optgroup>
                                    <optgroup label="Ventes">
                                        <option>Offre acceptée</option>
                                        <option>Offre expirée</option>
                                        <option>Paiement reçu</option>
                                    </optgroup>
                                    <optgroup label="Tâches">
                                        <option>Tâche en retard</option>
                                        <option>Nouvel appel manqué</option>
                                    </optgroup>
                                </Form.Select>
                            </div>
                        </Col>

                        <Col md={6}>
                            <div className="p-3 bg-success-subtle rounded-4 h-100 border border-success border-opacity-10">
                                <Form.Label className="small fw-bold text-success text-uppercase mb-3 d-flex align-items-center">
                                    <FeatherIcon icon="play-circle" size="14" className="me-2" />
                                    ALORS Faire l'action...
                                </Form.Label>
                                <Form.Select className="rounded-3 border-0 shadow-sm py-2">
                                    <optgroup label="Communication">
                                        <option>Envoyer un Email automatique</option>
                                        <option>Envoyer un SMS au client</option>
                                        <option>Notifier le manager sur Teams/Slack</option>
                                    </optgroup>
                                    <optgroup label="Gestion">
                                        <option>Créer une tâche de rappel</option>
                                        <option>Générer un document PDF</option>
                                        <option>Mettre à jour le statut</option>
                                    </optgroup>
                                </Form.Select>
                            </div>
                        </Col>

                        <Col md={12}>
                            <Form.Group controlId="formConditions" className="mt-2">
                                <Form.Check
                                    type="checkbox"
                                    label="Ajouter une condition de filtrage (ex: uniquement pour les clients VIP)"
                                    className="small text-muted"
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer className="border-0 bg-light py-3 px-4">
                    <Button variant="light" onClick={() => setShowModal(false)} className="rounded-pill px-4 fw-bold">Annuler</Button>
                    <Button variant="primary" onClick={() => setShowModal(false)} className="rounded-pill px-5 fw-bold shadow">
                        Activer la règle
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

// Internal Alert for simplicity without extra imports
const Alert = ({ variant, children, className }) => (
    <div className={`alert alert-${variant} ${className}`} role="alert">
        {children}
    </div>
);

export default AutomationRules;
