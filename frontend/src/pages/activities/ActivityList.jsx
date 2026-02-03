import React, { useState, useEffect } from 'react';
import { Container, Button, Modal, Form, Badge, Row, Col } from 'react-bootstrap';
import FeatherIcon from 'feather-icons-react';
import DataTable from '../../components/DataTable';
import activityService from '../../services/activityService';
import contactService from '../../services/contactService';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';

import api from '../../services/api';

const ActivityList = () => {
    const [activities, setActivities] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [allowedTypes, setAllowedTypes] = useState(['Call', 'Meeting', 'Task', 'Email', 'Other']);

    // Form State
    const [formData, setFormData] = useState({
        subject: '',
        type: 'Call',
        description: '',
        contact: '',
        status: 'Planned',
        date: new Date().toISOString().split('T')[0]
    });

    const fetchData = async () => {
        try {
            const [acts, cts, settingsRes] = await Promise.all([
                activityService.getAll(),
                contactService.getAll(),
                api.get('/settings')
            ]);
            setActivities(acts);
            setContacts(cts);
            if (settingsRes.data?.activityTypes?.length > 0) {
                setAllowedTypes(settingsRes.data.activityTypes);
                setFormData(prev => ({ ...prev, type: settingsRes.data.activityTypes[0] }));
            }
        } catch (error) {
            console.error("Error fetching activity data", error);
            toast.error("Erreur lors du chargement des données");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await activityService.create(formData);
            toast.success("Activité créée !");
            setShowModal(false);
            setFormData({
                subject: '',
                type: 'Call',
                description: '',
                contact: '',
                status: 'Planned',
                date: new Date().toISOString().split('T')[0]
            });
            fetchData();
        } catch (error) {
            toast.error("Erreur lors de la création");
        }
    };

    const handleDelete = async (row) => {
        if (window.confirm("Supprimer cette activité ?")) {
            try {
                await activityService.remove(row._id);
                toast.success("Activité supprimée");
                fetchData();
            } catch (error) {
                toast.error("Erreur lors de la suppression");
            }
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Planned': return 'info';
            case 'Completed': return 'success';
            case 'Cancelled': return 'danger';
            default: return 'secondary';
        }
    };

    const columns = [
        { header: 'Sujet', accessor: 'subject' },
        {
            header: 'Type',
            accessor: 'type',
            render: (row) => (
                <div className="d-flex align-items-center">
                    <FeatherIcon icon={row.type === 'Call' ? 'phone' : row.type === 'Meeting' ? 'users' : 'check-square'} size="14" className="me-2 text-muted" />
                    {row.type}
                </div>
            )
        },
        {
            header: 'Client / Contact',
            accessor: 'contact',
            render: (row) => row.contact ? (row.contact.companyName || `${row.contact.firstName} ${row.contact.lastName}`) : '-'
        },
        {
            header: 'Date',
            accessor: 'date',
            render: (row) => new Date(row.date).toLocaleDateString()
        },
        {
            header: 'Statut',
            accessor: 'status',
            render: (row) => <Badge bg={getStatusBadge(row.status)}>{row.status}</Badge>
        },
        {
            header: 'Commercial',
            accessor: 'salesPerson',
            render: (row) => row.salesPerson?.name || 'N/A'
        }
    ];

    if (loading) return <LoadingSpinner />;

    return (
        <Container fluid>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="fw-bold">Activités Commerciales</h3>
                    <p className="text-muted">Suivez vos appels, réunions et tâches.</p>
                </div>
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    <FeatherIcon icon="plus" className="me-2" size="18" />
                    Nouvelle Activité
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={activities}
                onDelete={handleDelete}
                onEdit={(row) => {
                    setFormData({
                        _id: row._id,
                        subject: row.subject,
                        type: row.type,
                        description: row.description || '',
                        contact: row.contact?._id || '',
                        status: row.status,
                        date: new Date(row.date).toISOString().split('T')[0]
                    });
                    setShowModal(true);
                }}
            />

            {/* Create/Edit Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold">
                        {formData._id ? 'Modifier' : 'Nouvelle'} Activité
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body className="pt-3">
                        <Form.Group className="mb-3">
                            <Form.Label>Sujet</Form.Label>
                            <Form.Control
                                type="text"
                                required
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                placeholder="ex: Appel de suivi, Présentation produit..."
                            />
                        </Form.Group>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Type</Form.Label>
                                    <Form.Select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        {allowedTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Statut</Form.Label>
                                    <Form.Select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option value="Planned">Planifié</option>
                                        <option value="Completed">Terminé</option>
                                        <option value="Cancelled">Annulé</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Contact / Client</Form.Label>
                            <Form.Select
                                value={formData.contact}
                                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                required
                            >
                                <option value="">Séléctionner un contact</option>
                                {contacts.map(c => (
                                    <option key={c._id} value={c._id}>
                                        {c.companyName ? `${c.companyName} (${c.firstName} ${c.lastName})` : `${c.firstName} ${c.lastName}`}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer className="border-0 pt-0">
                        <Button variant="light" onClick={() => setShowModal(false)}>Annuler</Button>
                        <Button variant="primary" type="submit" className="px-4">
                            {formData._id ? 'Mettre à jour' : 'Créer'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default ActivityList;
