import React, { useState, useEffect } from 'react';
import { Container, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

import DataTable from '../../components/DataTable';
import orderService from '../../services/orderService';

const OrderList = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await orderService.getAll();
                setOrders(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch orders", error);
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending': return 'warning';
            case 'confirmed': return 'info';
            case 'delivered': return 'success';
            case 'cancelled': return 'danger';
            default: return 'secondary';
        }
    };

    const columns = [
        { header: 'Référence', accessor: 'reference' },
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
                <h3 className="fw-bold">Gestion des Commandes</h3>
                {/* Orders are usually created from Offers, but manual creation can be added */}
            </div>

            {loading ? <div>Chargement...</div> : (
                <DataTable
                    columns={columns}
                    data={orders}
                    onView={(row) => navigate(`/orders/view/${row._id}`)}
                />
            )}
        </Container>
    );
};

export default OrderList;
