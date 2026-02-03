import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Container, Spinner, Badge } from 'react-bootstrap';
import PageHeader from '../../components/PageHeader';
import FeatherIcon from 'feather-icons-react';
import offerService from '../../services/offerService';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const StatCard = ({ label, value, icon, color, trend }) => (
    <Card className="border-0 shadow-sm mb-4">
        <Card.Body className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className={`p-3 rounded-3 bg-${color} bg-opacity-10 text-${color}`}>
                    <FeatherIcon icon={icon} size="20" />
                </div>
                {trend && <span className="badge bg-success bg-opacity-10 text-success small">{trend}</span>}
            </div>
            <h6 className="text-muted small text-uppercase mb-2 fw-bold" style={{ letterSpacing: '0.5px' }}>{label}</h6>
            <h3 className="fw-bold mb-0">{value}</h3>
        </Card.Body>
    </Card>
);

const OfferReport = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        accepted: 0,
        conversionRate: '0%',
        totalValue: '0 €'
    });
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const fetchOfferStats = async () => {
            try {
                const offers = await offerService.getAll();
                const total = offers.length;
                const accepted = offers.filter(o => o.status === 'accepted' || o.status === 'converted').length;
                const rate = total > 0 ? ((accepted / total) * 100).toFixed(1) : 0;
                const totalVal = offers.reduce((sum, o) => sum + (o.totalAmountTTC || 0), 0);

                setStats({
                    total,
                    accepted,
                    conversionRate: rate + '%',
                    totalValue: totalVal.toLocaleString() + ' €'
                });

                setChartData({
                    labels: ['Brouillon', 'Envoyé', 'Accepté', 'Refusé', 'Converti'],
                    datasets: [{
                        data: [
                            offers.filter(o => o.status === 'draft').length,
                            offers.filter(o => o.status === 'sent').length,
                            offers.filter(o => o.status === 'accepted').length,
                            offers.filter(o => o.status === 'rejected').length,
                            offers.filter(o => o.status === 'converted').length
                        ],
                        backgroundColor: [
                            '#cbd5e1', // secondary
                            '#0ea5e9', // info
                            '#10b981', // success
                            '#ef4444', // danger
                            '#4f46e5'  // primary
                        ]
                    }]
                });
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchOfferStats();
    }, []);

    if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>;

    return (
        <Container fluid>
            <PageHeader title="Performance des Offres" breadcrumb={[{ label: 'Rapports', path: '/reports' }, { label: 'Offres' }]} />

            <Row>
                <Col xl={3} md={6}>
                    <StatCard label="Total Offres" value={stats.total} icon="file-text" color="primary" trend="+8.2%" />
                </Col>
                <Col xl={3} md={6}>
                    <StatCard label="Offres Acceptées" value={stats.accepted} icon="check-circle" color="success" trend="+12.4%" />
                </Col>
                <Col xl={3} md={6}>
                    <StatCard label="Taux de Signature" value={stats.conversionRate} icon="percent" color="info" trend="+2.1%" />
                </Col>
                <Col xl={3} md={6}>
                    <StatCard label="Volume Devisé" value={stats.totalValue} icon="dollar-sign" color="warning" trend="+15.2%" />
                </Col>
            </Row>

            <Row className="g-4">
                <Col lg={5}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Header className="bg-white py-3 font-weight-bold">Status des Offres</Card.Header>
                        <Card.Body className="d-flex align-items-center justify-content-center">
                            <div style={{ height: '280px', width: '280px' }}>
                                {chartData && <Doughnut data={chartData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={7}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Header className="bg-white py-3 font-weight-bold">Analyse Comparative</Card.Header>
                        <Card.Body>
                            <div style={{ height: '300px' }}>
                                {chartData && <Bar
                                    data={chartData}
                                    options={{
                                        maintainAspectRatio: false,
                                        plugins: { legend: { display: false } },
                                        scales: { y: { beginAtZero: true } }
                                    }}
                                />}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default OfferReport;
