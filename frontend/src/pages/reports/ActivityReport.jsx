import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Container, Spinner } from 'react-bootstrap';
import PageHeader from '../../components/PageHeader';
import FeatherIcon from 'feather-icons-react';
import activityService from '../../services/activityService';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
    RadialLinearScale
} from 'chart.js';
import { Bar, Radar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const StatCard = ({ label, value, icon, color }) => (
    <Card className="border-0 shadow-sm mb-4">
        <Card.Body className="p-4 d-flex align-items-center">
            <div className={`p-3 rounded-circle bg-${color} bg-opacity-10 text-${color} me-3`}>
                <FeatherIcon icon={icon} size="20" />
            </div>
            <div>
                <h6 className="text-muted small text-uppercase mb-1 fw-bold">{label}</h6>
                <h3 className="fw-bold mb-0">{value}</h3>
            </div>
        </Card.Body>
    </Card>
);

const ActivityReport = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        calls: 0,
        emails: 0,
        meetings: 0
    });
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const fetchActivityStats = async () => {
            try {
                const activities = await activityService.getAll();
                const total = activities.length;
                const calls = activities.filter(a => a.type === 'Appel').length;
                const emails = activities.filter(a => a.type === 'Email').length;
                const meetings = activities.filter(a => a.type === 'Réunion').length;

                setStats({ total, calls, emails, meetings });

                setChartData({
                    labels: ['Appels', 'Emails', 'Réunions', 'Tâches', 'Notes'],
                    datasets: [{
                        label: 'Volume d\'activité',
                        data: [
                            calls,
                            emails,
                            meetings,
                            activities.filter(a => a.type === 'Tâche').length,
                            activities.filter(a => a.type === 'Note').length
                        ],
                        backgroundColor: 'rgba(99, 102, 241, 0.2)',
                        borderColor: '#6366f1',
                        borderWidth: 2,
                        pointBackgroundColor: '#6366f1'
                    }]
                });
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchActivityStats();
    }, []);

    if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>;

    return (
        <Container fluid>
            <PageHeader title="Activités Commerciales" breadcrumb={[{ label: 'Rapports', path: '/reports' }, { label: 'Activités' }]} />

            <Row>
                <Col xl={3} md={6}>
                    <StatCard label="Total Activités" value={stats.total} icon="activity" color="primary" />
                </Col>
                <Col xl={3} md={6}>
                    <StatCard label="Appels" value={stats.calls} icon="phone" color="info" />
                </Col>
                <Col xl={3} md={6}>
                    <StatCard label="Emails" value={stats.emails} icon="mail" color="warning" />
                </Col>
                <Col xl={3} md={6}>
                    <StatCard label="Réunions" value={stats.meetings} icon="users" color="success" />
                </Col>
            </Row>

            <Row className="g-4">
                <Col lg={6}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Header className="bg-white py-3 fs-6 fw-bold">Mix d'Activités (Radar)</Card.Header>
                        <Card.Body className="d-flex align-items-center justify-content-center">
                            <div style={{ height: '350px', width: '100%' }}>
                                {chartData && <Radar
                                    data={chartData}
                                    options={{
                                        maintainAspectRatio: false,
                                        scales: { r: { beginAtZero: true } }
                                    }}
                                />}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={6}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Header className="bg-white py-3 fs-6 fw-bold">Histogramme des Interactions</Card.Header>
                        <Card.Body>
                            <div style={{ height: '350px' }}>
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

export default ActivityReport;
