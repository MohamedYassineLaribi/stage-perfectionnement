import React, { useState, useEffect } from 'react';
import { Container, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';
import DataTable from '../../components/DataTable';
import offerService from '../../services/offerService';
import PageHeader from '../../components/PageHeader';

const Proposals = () => {
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProposals = async () => {
        try {
            const data = await offerService.getAll();
            setProposals(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProposals();
    }, []);

    const columns = [
        {
            header: 'Sujet / Titre',
            accessor: 'title',
            render: (row) => (
                <div className="d-flex align-items-center gap-2">
                    <div className="avatar-text avatar-sm bg-soft-info text-info rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                        <FeatherIcon icon="file-text" size="14" />
                    </div>
                    <div>
                        <span className="fw-bold d-block text-dark">{row.title}</span>
                        <span className="text-muted small fs-11">{row.reference}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Client',
            accessor: 'client',
            render: (row) => row.client?.companyName || 'N/A'
        },
        {
            header: 'Montant',
            accessor: 'totalAmountTTC',
            render: (row) => <span className="fw-bold">{row.totalAmountTTC?.toLocaleString()} €</span>
        },
        {
            header: 'Date d\'échéance',
            accessor: 'validUntil',
            render: (row) => row.validUntil ? new Date(row.validUntil).toLocaleDateString() : 'N/A'
        },
        {
            header: 'Statut',
            accessor: 'status',
            render: (row) => {
                const colors = {
                    draft: 'secondary',
                    sent: 'info',
                    accepted: 'success',
                    rejected: 'danger',
                    converted: 'primary'
                };
                return <Badge bg={colors[row.status] || 'light'} pill className="text-capitalize">{row.status}</Badge>
            }
        }
    ];

    return (
        <Container fluid>
            <PageHeader title="Propositions Commerciales" breadcrumb={[{ label: 'Propositions' }]}>
                <Link to="/offers/create" className="btn btn-primary shadow-sm px-4">
                    <FeatherIcon icon="plus" size="16" className="me-2" />
                    <span>Nouvelle Proposition</span>
                </Link>
            </PageHeader>

            <DataTable
                columns={columns}
                data={proposals}
                onView={(row) => window.location.href = `/offers/view/${row._id}`}
                onEdit={(row) => window.location.href = `/offers/edit/${row._id}`}
            />
        </Container>
    );
};

export default Proposals;
