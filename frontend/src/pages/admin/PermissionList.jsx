import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Badge, Alert } from 'react-bootstrap';
import FeatherIcon from 'feather-icons-react';
import api from '../../services/api';

const PermissionList = () => {
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Mock data for demonstration
    const mockPermissions = [
        { _id: 'p1', name: 'manage_users', description: 'Créer, modifier et supprimer des utilisateurs' },
        { _id: 'p2', name: 'manage_roles', description: 'Gérer les rôles et leurs permissions' },
        { _id: 'p3', name: 'view_offers', description: 'Consulter les offres commerciales' },
        { _id: 'p4', name: 'create_offers', description: 'Créer de nouvelles offres' },
        { _id: 'p5', name: 'manage_orders', description: 'Gérer les commandes clients' },
        { _id: 'p6', name: 'view_reports', description: 'Accéder aux rapports et statistiques' },
        { _id: 'p7', name: 'manage_contacts', description: 'Gérer les contacts et clients' },
        { _id: 'p8', name: 'manage_invoices', description: 'Créer et gérer les factures' }
    ];

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const response = await api.get('/roles/permissions');
                setPermissions(response.data.length > 0 ? response.data : mockPermissions);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch permissions", err);
                // Use mock data on error
                setPermissions(mockPermissions);
                setLoading(false);
            }
        };
        fetchPermissions();
    }, []);

    if (loading) return <div className="p-4">Chargement des permissions...</div>;

    return (
        <Container fluid className="fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="fw-bold text-dark">Gestion des Permissions</h3>
                    <p className="text-muted mb-0">Liste complète des droits d'accès définis dans le système.</p>
                </div>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                    <Table responsive hover className="mb-0 align-middle">
                        <thead className="bg-light">
                            <tr>
                                <th className="px-4 py-3 border-0">Nom Technique</th>
                                <th className="py-3 border-0">Description</th>
                                <th className="py-3 border-0">Module</th>
                                <th className="py-3 border-0 text-center">Statut</th>
                            </tr>
                        </thead>
                        <tbody>
                            {permissions.map((perm) => (
                                <tr key={perm._id}>
                                    <td className="px-4">
                                        <code className="bg-light px-2 py-1 rounded text-primary">{perm.name}</code>
                                    </td>
                                    <td>{perm.description}</td>
                                    <td>
                                        <Badge bg="info" className="bg-opacity-10 text-info fw-medium">
                                            {perm.name.split('_')[1] || 'System'}
                                        </Badge>
                                    </td>
                                    <td className="text-center">
                                        <Badge bg="success" pill>Actif</Badge>
                                    </td>
                                </tr>
                            ))}
                            {permissions.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center py-5 text-muted">
                                        Aucune permission trouvée.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default PermissionList;
