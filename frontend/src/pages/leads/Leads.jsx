import React, { useState, useEffect } from 'react';
import { Container, Button, Badge, Modal, Form } from 'react-bootstrap';
import FeatherIcon from 'feather-icons-react';
import DataTable from '../../components/DataTable';
import leadService from '../../services/leadService';
import contactService from '../../services/contactService';
import { useNavigate } from 'react-router-dom';
import LeadsKanban from './LeadsKanban';
import ImportModal from '../../components/ImportModal';
import { toast } from 'react-toastify';

const Leads = () => {
    const navigate = useNavigate();
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        source: 'Website',
        status: 'New'
    });
    const [editingId, setEditingId] = useState(null);
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'kanban'
    const [showImportModal, setShowImportModal] = useState(false);

    const handleImport = (file) => {
        toast.success(`Importation de "${file.name}" réussie (simulation).`);
        fetchLeads(); // Refresh data
    };

    const fetchLeads = async () => {
        try {
            const data = await leadService.getAll();
            setLeads(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const handleConvert = async (row) => {
        if (row.status === 'Converted') {
            toast.info("Ce lead est déjà converti en contact.");
            return;
        }

        if (window.confirm(`Convertir ${row.name} en contact ?`)) {
            try {
                // Split name to first/last if possible or use as firstName
                const names = row.name.split(' ');
                const contactData = {
                    firstName: names[0],
                    lastName: names.slice(1).join(' ') || '.',
                    email: row.email,
                    companyName: row.company || 'N/A',
                    type: 'Prospect'
                };

                await contactService.create(contactData);
                await leadService.update(row._id, { ...row, status: 'Converted' });

                toast.success("Contact créé avec succès !");
                navigate('/contacts');
            } catch (error) {
                toast.error("Erreur lors de la conversion");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await leadService.update(editingId, formData);
                toast.success("Lead mis à jour !");
            } else {
                await leadService.create(formData);
                toast.success("Lead créé !");
            }
            setShowModal(false);
            setFormData({ name: '', email: '', company: '', source: 'Website', status: 'New' });
            setEditingId(null);
            fetchLeads();
        } catch (error) {
            toast.error("Erreur: " + (error.response?.data?.message || error.message));
        }
    };

    const handleEdit = (row) => {
        setEditingId(row._id);
        setFormData({
            name: row.name,
            email: row.email,
            company: row.company || '',
            source: row.source || 'Website',
            status: row.status || 'New'
        });
        setShowModal(true);
    };

    const handleDelete = async (row) => {
        if (window.confirm(`Supprimer le lead ${row.name} ?`)) {
            try {
                await leadService.deleteLead(row._id);
                toast.success("Lead supprimé");
                fetchLeads();
            } catch (error) {
                toast.error("Erreur lors de la suppression");
            }
        }
    };

    const handleStatusChange = async (leadId, newStatus) => {
        const lead = leads.find(l => l._id === leadId);
        if (!lead || lead.status === newStatus) return;

        try {
            await leadService.update(leadId, { ...lead, status: newStatus });
            setLeads(leads.map(l => l._id === leadId ? { ...l, status: newStatus } : l));
            toast.success(`Statut mis à jour : ${newStatus}`);
        } catch (error) {
            toast.error("Erreur lors de la mise à jour du statut");
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'New': return <Badge bg="primary">Nouveau</Badge>;
            case 'Contacted': return <Badge bg="info">Contacté</Badge>;
            case 'Qualified': return <Badge bg="success">Qualifié</Badge>;
            case 'Lost': return <Badge bg="danger">Perdu</Badge>;
            case 'Converted': return <Badge bg="secondary">Converti</Badge>;
            default: return <Badge bg="light" text="dark">{status}</Badge>;
        }
    };

    const columns = [
        { header: 'Nom', accessor: 'name' },
        { header: 'Email', accessor: 'email' },
        { header: 'Entreprise', accessor: 'company' },
        { header: 'Source', accessor: 'source' },
        {
            header: 'Statut',
            accessor: 'status',
            render: (row) => getStatusBadge(row.status)
        },
        {
            header: 'Date',
            accessor: 'createdAt',
            render: (row) => new Date(row.createdAt).toLocaleDateString()
        }
    ];

    return (
        <Container fluid>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center gap-3">
                    <h3 className="fw-bold mb-0">Gestion des Leads</h3>
                    <div className="btn-group shadow-sm rounded-pill overflow-hidden border">
                        <Button
                            variant={viewMode === 'table' ? 'primary' : 'white'}
                            size="sm"
                            className="px-3"
                            onClick={() => setViewMode('table')}
                        >
                            <FeatherIcon icon="list" size="14" className="me-1" /> Table
                        </Button>
                        <Button
                            variant={viewMode === 'kanban' ? 'primary' : 'white'}
                            size="sm"
                            className="px-3"
                            onClick={() => setViewMode('kanban')}
                        >
                            <FeatherIcon icon="grid" size="14" className="me-1" /> Kanban
                        </Button>
                    </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <Button variant="outline-primary" className="rounded-pill shadow-sm px-4" onClick={() => setShowImportModal(true)}>
                        <FeatherIcon icon="upload" className="me-2" size="18" />
                        Importer
                    </Button>
                    <Button variant="primary" className="rounded-pill shadow-sm px-4" onClick={() => {
                        setEditingId(null);
                        setFormData({ name: '', email: '', company: '', source: 'Website', status: 'New' });
                        setShowModal(true);
                    }}>
                        <FeatherIcon icon="plus-circle" className="me-2" size="18" />
                        Nouveau Lead
                    </Button>
                </div>
            </div>

            <ImportModal
                show={showImportModal}
                onHide={() => setShowImportModal(false)}
                onImport={handleImport}
                title="Importer des Leads"
            />

            {viewMode === 'table' ? (
                <DataTable
                    columns={columns}
                    data={leads}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    actions={(row) => (
                        <Button
                            variant="link"
                            size="sm"
                            className="text-success p-1"
                            onClick={() => handleConvert(row)}
                            title="Convertir en Contact"
                            disabled={row.status === 'Converted'}
                        >
                            <FeatherIcon icon="user-plus" size="16" />
                        </Button>
                    )}
                />
            ) : (
                <LeadsKanban
                    leads={leads}
                    onStatusChange={handleStatusChange}
                    onEdit={handleEdit}
                    onView={(lead) => navigate(`/leads/view/${lead._id}`)}
                />
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{editingId ? 'Modifier Lead' : 'Nouveau Lead'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Nom complet</Form.Label>
                            <Form.Control
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Entreprise</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Statut</Form.Label>
                            <Form.Select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="New">Nouveau</option>
                                <option value="Contacted">Contacté</option>
                                <option value="Qualified">Qualifié</option>
                                <option value="Lost">Perdu</option>
                                <option value="Converted">Converti</option>
                            </Form.Select>
                        </Form.Group>
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

export default Leads;
