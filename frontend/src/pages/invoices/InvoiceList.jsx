import React, { useState, useEffect } from 'react';
import { Container, Button, Badge } from 'react-bootstrap';
// Using feather-icons-react
import FeatherIcon from 'feather-icons-react';
import { useNavigate } from 'react-router-dom';

import DataTable from '../../components/DataTable';
import invoiceService from '../../services/invoiceService';

const InvoiceList = () => {
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const data = await invoiceService.getAll();
                setInvoices(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch invoices", error);
                setLoading(false);
            }
        };
        fetchInvoices();
    }, []);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'draft': return 'secondary';
            case 'issued': return 'primary';
            case 'paid': return 'success';
            case 'overdue': return 'danger';
            case 'cancelled': return 'dark';
            default: return 'light';
        }
    };

    const columns = [
        { header: 'Référence', accessor: 'reference' },
        {
            header: 'Client',
            accessor: 'client',
            render: (row) => row.client?.companyName || `${row.client?.firstName} ${row.client?.lastName}`
        },
        {
            header: 'Montant TTC',
            accessor: 'amountDue',
            render: (row) => `${row.amountDue.toFixed(2)} €`
        },
        {
            header: 'Échéance',
            accessor: 'dueDate',
            render: (row) => new Date(row.dueDate).toLocaleDateString()
        },
        {
            header: 'Statut',
            accessor: 'status',
            render: (row) => <Badge bg={getStatusBadge(row.status)}>{row.status}</Badge>
        }
    ];

    const handleDownloadPDF = async (id) => {
        try {
            const blob = await invoiceService.downloadPdf(id);
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `facture-${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Download failed", error);
        }
    };

    return (
        <Container fluid>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="fw-bold text-dark">Gestion de la Facturation</h3>
                    <p className="text-muted mb-0">Suivez et téléchargez l'ensemble des factures émises.</p>
                </div>
            </div>

            {loading ? <div className="p-4 text-center">Chargement...</div> : (
                <div className="card border-0 shadow-sm">
                    <div className="card-body p-0">
                        <DataTable
                            columns={columns}
                            data={invoices}
                            onView={(row) => navigate(`/invoices/view/${row._id}`)}
                            actions={(row) => (
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    className="ms-2"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDownloadPDF(row._id);
                                    }}
                                    title="Télécharger PDF"
                                >
                                    <FeatherIcon icon="download" size="14" />
                                </Button>
                            )}
                        />
                    </div>
                </div>
            )}
        </Container>
    );
};

export default InvoiceList;
