import React, { useState, useEffect } from 'react';
import { Container, Button, Badge, Modal, Form, Row, Col } from 'react-bootstrap';
import FeatherIcon from 'feather-icons-react';
import DataTable from '../../components/DataTable';
import api from '../../services/api';

const RoleList = () => {
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        permissions: [] // IDs
    });
    const [editingId, setEditingId] = useState(null);

    // Mock data for demonstration
    const mockRoles = [
        { _id: '1', name: 'Admin', description: 'Accès complet au système', permissions: [{ _id: 'p1', name: 'manage_users' }, { _id: 'p2', name: 'manage_roles' }] },
        { _id: '2', name: 'Commercial', description: 'Accès aux fonctions commerciales', permissions: [{ _id: 'p3', name: 'view_offers' }, { _id: 'p4', name: 'create_offers' }] }
    ];
    const mockPermissions = [
        { _id: 'p1', name: 'manage_users', description: 'Gérer les utilisateurs' },
        { _id: 'p2', name: 'manage_roles', description: 'Gérer les rôles' },
        { _id: 'p3', name: 'view_offers', description: 'Voir les offres' },
        { _id: 'p4', name: 'create_offers', description: 'Créer des offres' },
        { _id: 'p5', name: 'manage_orders', description: 'Gérer les commandes' },
        { _id: 'p6', name: 'view_reports', description: 'Voir les rapports' }
    ];

    const fetchData = async () => {
        try {
            const [rolesRes, permsRes] = await Promise.all([
                api.get('/roles'),
                api.get('/roles/permissions')
            ]);
            setRoles(rolesRes.data.length > 0 ? rolesRes.data : mockRoles);
            setPermissions(permsRes.data.length > 0 ? permsRes.data : mockPermissions);
            setLoading(false);
        } catch (error) {
            console.error(error);
            // Use mock data on error
            setRoles(mockRoles);
            setPermissions(mockPermissions);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/roles/${editingId}`, formData);
            } else {
                await api.post('/roles', formData);
            }
            setShowModal(false);
            setFormData({ name: '', description: '', permissions: [] });
            setEditingId(null);
            fetchData();
        } catch (error) {
            alert("Erreur: " + (error.response?.data?.message || error.message));
        }
    };

    const handleEdit = (row) => {
        setEditingId(row._id);
        setFormData({
            name: row.name,
            description: row.description,
            permissions: row.permissions.map(p => p._id || p)
        });
        setShowModal(true);
    };

    const handleDelete = async (row) => {
        if (window.confirm(`Supprimer le rôle ${row.name} ?`)) {
            try {
                await api.delete(`/roles/${row._id}`);
                fetchData();
            } catch (error) {
                alert("Erreur lors de la suppression");
            }
        }
    };

    const togglePermission = (permId) => {
        setFormData(prev => ({
            ...prev,
            permissions: prev.permissions.includes(permId)
                ? prev.permissions.filter(id => id !== permId)
                : [...prev.permissions, permId]
        }));
    };

    const columns = [
        { header: 'Nom', accessor: 'name' },
        { header: 'Description', accessor: 'description' },
        {
            header: 'Permissions',
            accessor: 'permissions',
            render: (row) => (
                <div className="d-flex flex-wrap gap-1">
                    {row.permissions?.map((p, i) => (
                        <Badge key={i} bg="light" text="dark" className="border">
                            {p.name || p}
                        </Badge>
                    ))}
                </div>
            )
        }
    ];

    return (
        <Container fluid className="fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="fw-bold text-dark">Gestion des Rôles</h3>
                    <p className="text-muted mb-0">Définissez les rôles et leurs permissions d'accès.</p>
                </div>
                <Button variant="primary" className="rounded-pill px-4 shadow-sm" onClick={() => {
                    setEditingId(null);
                    setFormData({ name: '', description: '', permissions: [] });
                    setShowModal(true);
                }}>
                    <FeatherIcon icon="plus-circle" className="me-2" size="18" />
                    Nouveau Rôle
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={roles}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{editingId ? 'Modifier le Rôle' : 'Nouveau Rôle'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Nom du rôle</Form.Label>
                            <Form.Control
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </Form.Group>
                        <hr />
                        <h6>Permissions</h6>
                        <Row>
                            {permissions.map(perm => (
                                <Col md={4} key={perm._id} className="mb-2">
                                    <Form.Check
                                        type="checkbox"
                                        id={perm._id}
                                        label={perm.name}
                                        checked={formData.permissions.includes(perm._id)}
                                        onChange={() => togglePermission(perm._id)}
                                    />
                                </Col>
                            ))}
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="light" onClick={() => setShowModal(false)}>Annuler</Button>
                        <Button variant="primary" type="submit">Enregistrer</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default RoleList;
