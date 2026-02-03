import React, { useState, useEffect } from 'react';
import { Container, Button, Badge, Modal, Form, Row, Col } from 'react-bootstrap';
// Using feather-icons-react
import FeatherIcon from 'feather-icons-react';

import DataTable from '../../components/DataTable';
import api from '../../services/api'; // Direct API call for Users for now

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        roleName: 'Commercial'
    });
    const [editingId, setEditingId] = useState(null);

    // Mock data for demonstration
    const mockUsers = [
        { _id: '1', name: 'Admin Principal', email: 'admin@duralux.com', role: { name: 'Admin' }, createdAt: new Date() },
        { _id: '2', name: 'Jean Dupont', email: 'jean.dupont@duralux.com', role: { name: 'Commercial' }, createdAt: new Date() },
        { _id: '3', name: 'Marie Martin', email: 'marie.martin@duralux.com', role: { name: 'Commercial' }, createdAt: new Date() }
    ];

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data.length > 0 ? response.data : mockUsers);
            setLoading(false);
        } catch (error) {
            console.error(error);
            // Use mock data on error
            setUsers(mockUsers);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/users/${editingId}`, formData);
                alert("Utilisateur mis à jour !");
            } else {
                await api.post('/auth/register', formData);
                alert("Utilisateur créé avec succès !");
            }
            setShowModal(false);
            setFormData({ name: '', email: '', password: '', roleName: 'Commercial' });
            setEditingId(null);
            fetchUsers();
        } catch (error) {
            alert("Erreur: " + (error.response?.data?.message || error.message));
        }
    };

    const handleEdit = (row) => {
        setEditingId(row._id);
        setFormData({
            name: row.name,
            email: row.email,
            password: '', // Leave blank for no change
            roleName: row.role?.name || row.role
        });
        setShowModal(true);
    };

    const handleDelete = async (row) => {
        if (window.confirm(`Supprimer l'utilisateur ${row.name} ?`)) {
            try {
                await api.delete(`/users/${row._id}`);
                alert("Utilisateur supprimé");
                fetchUsers();
            } catch (error) {
                alert("Erreur lors de la suppression");
            }
        }
    };

    const columns = [
        { header: 'Nom', accessor: 'name' },
        { header: 'Email', accessor: 'email' },
        {
            header: 'Rôle',
            accessor: 'role',
            render: (row) => (
                <Badge bg={(row.role === 'Admin' || row.role?.name === 'Admin') ? 'danger' : 'success'}>
                    {(row.role?.name || row.role) || 'N/A'}
                </Badge>
            )
        },
        {
            header: 'Date création',
            accessor: 'createdAt',
            render: (row) => new Date(row.createdAt).toLocaleDateString()
        }
    ];

    return (
        <Container fluid className="fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="fw-bold text-dark">Gestion des Utilisateurs</h3>
                    <p className="text-muted mb-0">Créez et gérez les comptes utilisateurs et leurs rôles.</p>
                </div>
                <Button variant="primary" className="rounded-pill px-4 shadow-sm" onClick={() => setShowModal(true)}>
                    <FeatherIcon icon="user-plus" className="me-2" size="18" />
                    Nouvel Utilisateur
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={users}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {/* User Modal */}
            <Modal show={showModal} onHide={() => { setShowModal(false); setEditingId(null); }} centered>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold text-primary">
                        {editingId ? 'Modifier Utilisateur' : 'Nouvel Utilisateur'}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body className="pt-4">
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-medium">Nom complet</Form.Label>
                            <Form.Control
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="ex: Jean Dupont"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-medium">Email</Form.Label>
                            <Form.Control
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="ex: jean@duralux.com"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-medium">
                                Mot de passe {editingId && <span className="text-muted small fs-11">(laisser vide pour ne pas changer)</span>}
                            </Form.Label>
                            <Form.Control
                                type="password"
                                required={!editingId}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="••••••••"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-medium">Rôle</Form.Label>
                            <Form.Select
                                value={formData.roleName}
                                onChange={(e) => setFormData({ ...formData, roleName: e.target.value })}
                            >
                                <option value="Commercial">Commercial</option>
                                <option value="Admin">Administrateur</option>
                            </Form.Select>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer className="border-0 pt-0">
                        <Button variant="light" onClick={() => { setShowModal(false); setEditingId(null); }} className="px-4">Annuler</Button>
                        <Button variant="primary" type="submit" className="px-4">
                            {editingId ? 'Mettre à jour' : 'Créer'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default UserList;
