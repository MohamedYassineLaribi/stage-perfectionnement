import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Modal, Form, Badge, Alert } from 'react-bootstrap';
import FeatherIcon from 'feather-icons-react';
import api from '../../services/api';
import { toast } from 'react-toastify';

const CRMConfigModule = ({ type, title, description, icon }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newItem, setNewItem] = useState('');
    const [settingsId, setSettingsId] = useState(null);

    const fetchSettings = async () => {
        try {
            const response = await api.get('/settings');
            const data = response.data;
            setSettingsId(data._id);
            setItems(data[type] || []);
            setLoading(false);
        } catch (error) {
            console.error(`Failed to fetch ${type}`, error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, [type]);

    const handleAddItem = async (e) => {
        e.preventDefault();
        if (!newItem.trim()) return;

        try {
            const updatedItems = [...items, newItem.trim()];
            await api.put('/settings', { [type]: updatedItems });
            setItems(updatedItems);
            setNewItem('');
            setShowModal(false);
            toast.success("Ajouté avec succès !");
        } catch (error) {
            toast.error("Erreur lors de l'ajout");
        }
    };

    const handleDelete = async (index) => {
        if (!window.confirm("Supprimer cet élément ?")) return;

        try {
            const updatedItems = items.filter((_, i) => i !== index);
            await api.put('/settings', { [type]: updatedItems });
            setItems(updatedItems);
            toast.success("Supprimé avec succès !");
        } catch (error) {
            toast.error("Erreur lors de la suppression");
        }
    };

    if (loading) return <div className="p-4">Chargement...</div>;

    return (
        <Container fluid className="fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="fw-bold text-dark">{title}</h3>
                    <p className="text-muted mb-0">{description}</p>
                </div>
                <Button variant="primary" className="rounded-pill px-4 shadow-sm" onClick={() => setShowModal(true)}>
                    <FeatherIcon icon="plus" className="me-2" size="18" />
                    Ajouter
                </Button>
            </div>

            <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                    <Table responsive hover className="mb-0 align-middle">
                        <thead className="bg-light">
                            <tr>
                                <th className="px-4 py-3 border-0">Nom</th>
                                <th className="py-3 border-0">Type</th>
                                <th className="py-3 border-0 text-end pe-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={index}>
                                    <td className="px-4 fw-medium">{item}</td>
                                    <td>
                                        <Badge bg="primary" className="bg-opacity-10 text-primary">
                                            {title.split(' ')[0]}
                                        </Badge>
                                    </td>
                                    <td className="text-end pe-4">
                                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(index)}>
                                            <FeatherIcon icon="trash-2" size="14" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {items.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="text-center py-5 text-muted">
                                        Aucun élément trouvé.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold text-primary">Nouveau {title.slice(0, -1)}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleAddItem}>
                    <Modal.Body className="pt-4">
                        <Form.Group>
                            <Form.Label>Nom de l'élément</Form.Label>
                            <Form.Control
                                type="text"
                                required
                                value={newItem}
                                onChange={(e) => setNewItem(e.target.value)}
                                placeholder="ex: Nouveau Type"
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer className="border-0">
                        <Button variant="light" onClick={() => setShowModal(false)}>Annuler</Button>
                        <Button variant="primary" type="submit">Enregistrer</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default CRMConfigModule;
