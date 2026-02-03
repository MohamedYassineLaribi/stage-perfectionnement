import React, { useState, useEffect } from 'react';
import { Container, Button, Badge } from 'react-bootstrap';
// Using feather-icons-react
import FeatherIcon from 'feather-icons-react';
import { useNavigate } from 'react-router-dom';

import DataTable from '../../components/DataTable';
import articleService from '../../services/articleService';

const ArticleList = () => {
    const navigate = useNavigate();
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const data = await articleService.getAll();
                setArticles(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch articles", error);
                setLoading(false);
            }
        };
        fetchArticles();
    }, []);

    const columns = [
        { header: 'Nom', accessor: 'name' },
        {
            header: 'Type',
            accessor: 'type',
            render: (row) => <Badge bg={row.type === 'Product' ? 'info' : 'warning'}>{row.type}</Badge>
        },
        {
            header: 'Prix HT',
            accessor: 'price',
            render: (row) => `${row.price} €`
        },
        { header: 'Stock', accessor: 'stockString' }
    ];

    const handleDelete = async (row) => {
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'article "${row.name}" ?`)) {
            try {
                await articleService.delete(row._id);
                setArticles(articles.filter(a => a._id !== row._id));
            } catch (error) {
                console.error("Failed to delete article", error);
                alert("Erreur lors de la suppression");
            }
        }
    };

    return (
        <Container fluid>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold">Catalogue Articles</h3>
                <Button variant="primary" onClick={() => navigate('/articles/create')}>
                    <FeatherIcon icon="plus" className="me-2" size="18" />
                    Nouvel Article
                </Button>
            </div>

            {loading ? <div>Chargement...</div> : (
                <DataTable
                    columns={columns}
                    data={articles}
                    onEdit={(row) => navigate(`/articles/edit/${row._id}`)}
                    onDelete={handleDelete}
                />
            )}
        </Container>
    );
};

export default ArticleList;
