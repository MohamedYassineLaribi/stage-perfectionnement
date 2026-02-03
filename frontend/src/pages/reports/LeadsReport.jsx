import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Container, Spinner } from 'react-bootstrap';
import PageHeader from '../../components/PageHeader';
import FeatherIcon from 'feather-icons-react';
import leadService from '../../services/leadService';
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
import { Bar, Pie } from 'react-chartjs-2';

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

const LeadsReport = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        converted: 0,
        conversionRate: '0%',
        newLeads: 0
    });
    const [chartData, setChartData] = useState(null);
    const [sourceData, setSourceData] = useState(null);

    useEffect(() => {
        const fetchLeadsStats = async () => {
            try {
                const leads = await leadService.getAll();
                const total = leads.length;
                const converted = leads.filter(l => l.status === 'Converted').length;
                const rate = total > 0 ? ((converted / total) * 100).toFixed(1) : 0;
                const news = leads.filter(l => l.status === 'New').length;

                setStats({
                    total,
                    converted,
                    conversionRate: rate + '%',
                    newLeads: news
                });

                setChartData({
                    labels: ['New', 'Contacted', 'Qualified', 'Converted', 'Unqualified'],
                    datasets: [{
                        label: 'Distribution des Leads',
                        data: [
                            leads.filter(l => l.status === 'New').length,
                            leads.filter(l => l.status === 'Contacted').length,
                            leads.filter(l => l.status === 'Qualified').length,
                            converted,
                            leads.filter(l => l.status === 'Unqualified').length
                        ],
                        backgroundColor: [
                            '#4f46e5',
                            '#0ea5e9',
                            '#10b981',
                            '#f59e0b',
                            '#ef4444'
                        ]
                    }]
                });

                // Prepare source data
                const sources = {};
                leads.forEach(l => {
                    const s = l.source || 'Inconnu';
                    sources[s] = (sources[s] || 0) + 1;
                });

                setSourceData({
                    labels: Object.keys(sources),
                    datasets: [{
                        data: Object.values(sources),
                        backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#0ea5e9']
                    }]
                });

                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchLeadsStats();
    }, []);

    if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>;

    const leadsStats = [
        { label: 'Total Leads', value: stats.total, icon: 'Target', color: 'primary', trend: '+15.2%' },
        { label: 'Leads Convertis', value: stats.converted, icon: 'CheckCircle', color: 'success', trend: '+5.4%' },
        { label: 'Nouveaux Leads', value: stats.newLeads, icon: 'Zap', color: 'info', trend: '+2.1%' },
        { label: 'Taux de Conversion', value: stats.conversionRate, icon: 'Percent', color: 'warning', trend: '+1.2%' },
    ];

    return (
        <Container fluid>
            <PageHeader title="Rapport des Leads" breadcrumb={[{ label: 'Rapports', path: '/reports' }, { label: 'Leads' }]}>
                <button className="btn btn-primary btn-sm">Générer Rapport PDF</button>
            </PageHeader>

            <Row>
                {leadsStats.map((stat, idx) => (
                    <Col xl={3} md={6} key={idx}>
                        <StatCard {...stat} />
                    </Col>
                ))}
            </Row>

            <Row className="mt-2 g-4">
                <Col lg={7}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Header className="bg-white py-3">
                            <h6 className="fw-bold mb-0">Entonnoir de Conversion</h6>
                        </Card.Header>
                        <Card.Body>
                            <div style={{ height: '300px' }}>
                                {chartData && <Bar
                                    data={chartData}
                                    options={{
                                        indexAxis: 'y',
                                        maintainAspectRatio: false,
                                        plugins: { legend: { display: false } }
                                    }}
                                />}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={5}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Header className="bg-white py-3">
                            <h6 className="fw-bold mb-0">Origine des Leads (Sources)</h6>
                        </Card.Header>
                        <Card.Body className="d-flex align-items-center justify-content-center">
                            <div style={{ height: '250px', width: '250px' }}>
                                {sourceData && <Doughnut data={sourceData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default LeadsReport;
