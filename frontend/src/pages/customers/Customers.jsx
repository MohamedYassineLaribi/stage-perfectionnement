import React, { useState, useEffect } from 'react';
import { Container, Button, Badge } from 'react-bootstrap';
import FeatherIcon from 'feather-icons-react';
import DataTable from '../../components/DataTable';
import contactService from '../../services/contactService';
import ImportModal from '../../components/ImportModal';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';

const Customers = () => {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showImportModal, setShowImportModal] = useState(false);

    const fetchCustomers = async () => {
        try {
            const data = await contactService.getAll();
            // Filter only customers
            setCustomers(data.filter(c => c.type === 'Customer' || c.type === 'Client'));
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleImport = (file) => {
        toast.success(`Importation de "${file.name}" réussie (simulation).`);
        fetchCustomers();
    };

    const handleDelete = async (row) => {
        if (window.confirm(`Supprimer le client ${row.firstName} ${row.lastName}?`)) {
            try {
                await contactService.deleteContact(row._id);
                toast.success("Client supprimé");
                fetchCustomers();
            } catch (error) {
                toast.error("Erreur lors de la suppression");
            }
        }
    };

    const columns = [
        {
            header: 'Client',
            accessor: 'firstName',
            render: (row) => (
                <div className="d-flex align-items-center gap-3">
                    <div className="avatar bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                        {row.firstName.charAt(0)}{row.lastName.charAt(0)}
                    </div>
                    <span className="fw-bold">{row.firstName} {row.lastName}</span>
                </div>
            )
        },
        { header: 'Email', accessor: 'email' },
        { header: 'Entreprise', accessor: 'companyName' },
        { header: 'Téléphone', accessor: 'phone' },
        {
            header: 'Type',
            accessor: 'type',
            render: (row) => <Badge bg="info-subtle" text="info" pill className="px-3">Client</Badge>
        }
    ];

    return (
        <Container fluid>
            <PageHeader title="Gestion des Clients" breadcrumb={[{ label: 'Clients' }]}>
                <div className="d-flex gap-2">
                    <Button variant="outline-primary" className="rounded-pill shadow-sm px-4" onClick={() => setShowImportModal(true)}>
                        <FeatherIcon icon="upload" className="me-2" size="18" />
                        Importer
                    </Button>
                    <Button variant="primary" className="rounded-pill shadow-sm px-4" onClick={() => navigate('/customers/create')}>
                        <FeatherIcon icon="plus-circle" className="me-2" size="18" />
                        Nouveau Client
                    </Button>
                </div>
            </PageHeader>

            <ImportModal
                show={showImportModal}
                onHide={() => setShowImportModal(false)}
                onImport={handleImport}
                title="Importer des Clients"
            />

            <DataTable
                columns={columns}
                data={customers}
                onView={(row) => navigate(`/customers/view/${row._id}`)}
                onEdit={(row) => navigate(`/customers/edit/${row._id}`)}
                onDelete={handleDelete}
            />
        </Container>
    );
};

export default Customers;
