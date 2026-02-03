import React, { useState, useEffect } from 'react';
import { Container, Button, Badge } from 'react-bootstrap';
import FeatherIcon from 'feather-icons-react';
import { useNavigate } from 'react-router-dom';

import DataTable from '../../components/DataTable';
import contactService from '../../services/contactService';

const ContactList = () => {
    const navigate = useNavigate();
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const data = await contactService.getAll();
                setContacts(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch contacts", error);
                setLoading(false);
            }
        };
        fetchContacts();
    }, []);

    const columns = [
        {
            header: 'Nom / Raison Sociale',
            accessor: 'displayName',
            render: (row) => row.type === 'Company' ? row.companyName : `${row.firstName} ${row.lastName}`
        },
        {
            header: 'Type',
            accessor: 'type',
            render: (row) => <Badge bg={row.type === 'Company' ? 'primary' : 'secondary'}>{row.type}</Badge>
        },
        { header: 'Email', accessor: 'email' },
        { header: 'Téléphone', accessor: 'phone' }
    ];

    const handleDelete = async (row) => {
        const displayName = row.type === 'Company' ? row.companyName : `${row.firstName} ${row.lastName}`;
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer le contact "${displayName}" ?`)) {
            try {
                await contactService.delete(row._id);
                setContacts(contacts.filter(c => c._id !== row._id));
            } catch (error) {
                console.error("Failed to delete contact", error);
                alert("Erreur lors de la suppression");
            }
        }
    };

    return (
        <Container fluid>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold">Gestion des Contacts</h3>
                <Button variant="primary" onClick={() => navigate('/contacts/create')}>
                    <FeatherIcon icon="plus" className="me-2" size="18" />
                    Nouveau Contact
                </Button>
            </div>

            {loading ? <div>Chargement...</div> : (
                <DataTable
                    columns={columns}
                    data={contacts}
                    onEdit={(row) => navigate(`/contacts/edit/${row._id}`)}
                    onDelete={handleDelete}
                />
            )}
        </Container>
    );
};

export default ContactList;
