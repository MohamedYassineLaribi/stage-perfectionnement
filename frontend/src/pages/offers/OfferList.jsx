import React, { useState, useEffect } from 'react';
import { Container, Button, Badge } from 'react-bootstrap';
import FeatherIcon from 'feather-icons-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

import DataTable from '../../components/DataTable';
import offerService from '../../services/offerService';

const OfferList = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const data = await offerService.getAll();
                setOffers(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch offers", error);
                setLoading(false);
            }
        };
        fetchOffers();
    }, []);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'draft': return 'secondary';
            case 'sent': return 'info';
            case 'accepted': return 'success';
            case 'rejected': return 'danger';
            case 'converted': return 'primary';
            default: return 'light';
        }
    };

    const columns = [
        { header: 'Référence', accessor: 'reference' },
        { header: 'Titre', accessor: 'title' },
        {
            header: 'Client',
            accessor: 'client',
            render: (row) => row.client?.companyName || `${row.client?.firstName} ${row.client?.lastName}`
        },
        ...(user?.role?.name === 'Admin' ? [{
            header: 'Commercial',
            accessor: 'salesPerson',
            render: (row) => row.salesPerson?.name || 'Inconnu'
        }] : []),
        {
            header: 'Total TTC',
            accessor: 'totalAmountTTC',
            render: (row) => row.totalAmountTTC ? `${row.totalAmountTTC.toFixed(2)} €` : '-'
        },
        {
            header: 'Statut',
            accessor: 'status',
            render: (row) => <Badge bg={getStatusBadge(row.status)}>{row.status}</Badge>
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
                <h3 className="fw-bold">Gestion des Offres</h3>
                <Button variant="primary" onClick={() => navigate('/offers/create')}>
                    <FeatherIcon icon="plus" className="me-2" size="18" />
                    Nouvelle Offre
                </Button>
            </div>

            {loading ? <div>Chargement...</div> : (
                <DataTable
                    columns={columns}
                    data={offers}
                    onEdit={(row) => navigate(`/offers/edit/${row._id}`)}
                    onView={(row) => navigate(`/offers/view/${row._id}`)}
                    onDelete={(row) => alert("Fonction de suppression à confirmer")}
                />
            )}
        </Container>
    );
};

export default OfferList;
