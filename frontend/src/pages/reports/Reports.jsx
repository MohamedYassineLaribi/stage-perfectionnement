import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';
import PageHeader from '../../components/PageHeader';

const Reports = () => {
    const reportCategories = [
        {
            title: 'Analyses Commerciales',
            reports: [
                { title: 'Ventes & Revenus', description: 'Évolution du CA et performance des ventes.', path: '/reports/sales', icon: 'BarChart2', color: 'primary' },
                { title: 'Performance des Offres', description: 'Taux de conversion et état des devis.', path: '/reports/offers', icon: 'FileText', color: 'info' },
                { title: 'Statut des Factures', description: 'Aperçu des paiements et retards.', path: '/reports/invoices', icon: 'DollarSign', color: 'success' }
            ]
        },
        {
            title: 'Analyses Clientèle',
            reports: [
                { title: 'Génération de Leads', description: 'Sources et conversion des nouveaux prospects.', path: '/reports/leads', icon: 'Target', color: 'warning' },
                { title: 'Activités Commerciales', description: 'Volume et types d\'interactions clients.', path: '/reports/activities', icon: 'Activity', color: 'secondary' }
            ]
        },
        {
            title: 'Gestion de Projets',
            reports: [
                { title: 'État des Projets', description: 'Suivi de l\'avancement et des deadlines.', path: '/reports/projects', icon: 'Briefcase', color: 'primary' },
                { title: 'Feuilles de Temps', description: 'Analyse du temps passé par projet.', path: '/reports/timesheets', icon: 'Clock', color: 'info' }
            ]
        }
    ];

    return (
        <Container fluid>
            <PageHeader title="Centre de Rapports" breadcrumb={[{ label: 'Rapports' }]} />

            {reportCategories.map((category, idx) => (
                <div key={idx} className="mb-5">
                    <h5 className="fw-bold mb-4 text-muted text-uppercase small" style={{ letterSpacing: '1px' }}>{category.title}</h5>
                    <Row className="g-4">
                        {category.reports.map((report, rIdx) => (
                            <Col xl={4} md={6} key={rIdx}>
                                <Card as={Link} to={report.path} className="border-0 shadow-sm h-100 text-decoration-none hover-shadow transition-all">
                                    <Card.Body className="p-4 d-flex align-items-start">
                                        <div className={`p-3 rounded-3 bg-${report.color} bg-opacity-10 text-${report.color} me-4`}>
                                            <FeatherIcon icon={report.icon} size="24" />
                                        </div>
                                        <div>
                                            <h6 className="fw-bold text-dark mb-1">{report.title}</h6>
                                            <p className="text-muted small mb-0">{report.description}</p>
                                        </div>
                                        <div className="ms-auto align-self-center text-muted opacity-25">
                                            <FeatherIcon icon="chevron-right" size="20" />
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            ))}
        </Container>
    );
};

export default Reports;
