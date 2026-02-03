import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Spinner, Table, ProgressBar, Badge, Container } from 'react-bootstrap';
import PageHeader from '../../components/PageHeader';
import FeatherIcon from 'feather-icons-react';
import orderService from '../../services/orderService';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    ArcElement
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const StatCard = ({ label, value, icon, color, trend, trendValue }) => (
    <Card className="border-0 shadow-sm mb-4">
        <Card.Body className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className={`p-3 rounded-3 bg-${color} bg-opacity-10 text-${color}`}>
                    <FeatherIcon icon={icon} size="20" />
                </div>
                {trendValue && (
                    <span className={`badge bg-${trend === 'up' ? 'success' : 'danger'} bg-opacity-10 text-${trend === 'up' ? 'success' : 'danger'} small`}>
                        <FeatherIcon icon={trend === 'up' ? 'trending-up' : 'trending-down'} size="12" className="me-1" />
                        {trendValue}
                    </span>
                )}
            </div>
            <h6 className="text-muted small text-uppercase mb-2 fw-bold" style={{ letterSpacing: '0.5px' }}>{label}</h6>
            <h3 className="fw-bold mb-0">{value}</h3>
        </Card.Body>
    </Card>
);

const SalesReport = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        avgValue: 0,
        totalOrders: 0,
        conversion: '5.2%'
    });
    const [chartData, setChartData] = useState(null);
    const [categoryData, setCategoryData] = useState(null);
    const [topCustomers, setTopCustomers] = useState([]);

    useEffect(() => {
        const fetchSalesStats = async () => {
            try {
                const orders = await orderService.getAll();
                const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmountTTC || 0), 0);
                const avgValue = orders.length > 0 ? (totalRevenue / orders.length) : 0;

                setStats({
                    totalRevenue: totalRevenue.toLocaleString() + ' €',
                    avgValue: avgValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €',
                    totalOrders: orders.length,
                    conversion: '5.2%'
                });

                // Prepare chart data
                setChartData({
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Ventes Mensuelles (€)',
                        data: [12500, 18200, 15300, 21000, 19400, totalRevenue > 0 ? totalRevenue : 15000],
                        backgroundColor: 'rgba(79, 70, 229, 0.2)',
                        borderColor: '#4f46e5',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: '#fff',
                        pointBorderColor: '#4f46e5',
                        pointBorderWidth: 2,
                        pointRadius: 4
                    }]
                });

                // Prepare Category Data
                const categories = { 'Services': 45, 'Matériel': 30, 'Logiciels': 15, 'Autres': 10 };
                setCategoryData({
                    labels: Object.keys(categories),
                    datasets: [{
                        data: Object.values(categories),
                        backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#ef4444'],
                        borderWidth: 0,
                        hoverOffset: 15
                    }]
                });

                // Aggregating Top Customers
                const customerMap = {};
                orders.forEach(o => {
                    const name = o.client?.companyName || 'Passager';
                    customerMap[name] = (customerMap[name] || 0) + (o.totalAmountTTC || 0);
                });

                const sortedCustomers = Object.entries(customerMap)
                    .map(([name, total]) => ({ name, total }))
                    .sort((a, b) => b.total - a.total)
                    .slice(0, 5);

                setTopCustomers(sortedCustomers);

                setLoading(false);
            } catch (error) {
                console.error("Sales report error:", error);
                setLoading(false);
            }
        };
        fetchSalesStats();
    }, []);

    if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>;

    const salesStats = [
        { label: 'Revenu Total', value: stats.totalRevenue, icon: 'DollarSign', color: 'primary', trend: 'up', trendValue: '+12.5%' },
        { label: 'Panier Moyen', value: stats.avgValue, icon: 'ShoppingCart', color: 'info', trend: 'up', trendValue: '+3.2%' },
        { label: 'Taux Conversion', value: stats.conversion, icon: 'Target', color: 'success', trend: 'up', trendValue: '+1.5%' },
        { label: 'Commandes Totales', value: stats.totalOrders, icon: 'Package', color: 'warning', trend: 'down', trendValue: '-2.4%' },
    ];

    return (
        <Container fluid>
            <PageHeader title="Rapport des Ventes & Revenus" breadcrumb={[{ label: 'Rapports', path: '/reports' }, { label: 'Ventes' }]}>
                <div className="d-flex gap-2">
                    <Button variant="outline-primary" size="sm" className="d-flex align-items-center">
                        <FeatherIcon icon="download" size="14" className="me-2" /> PDF
                    </Button>
                    <Button variant="primary" size="sm" className="d-flex align-items-center">
                        <FeatherIcon icon="file-text" size="14" className="me-2" /> Excel
                    </Button>
                </div>
            </PageHeader>

            <Row>
                {salesStats.map((stat, idx) => (
                    <Col xl={3} md={6} key={idx}>
                        <StatCard {...stat} />
                    </Col>
                ))}
            </Row>

            <Row className="g-4">
                <Col lg={8}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center">
                            <h6 className="fw-bold mb-0">Évolution Chirre d'Affaires</h6>
                            <Badge bg="soft-primary" className="text-primary fw-normal">6 Derniers Mois</Badge>
                        </Card.Header>
                        <Card.Body>
                            <div style={{ height: '350px' }}>
                                {chartData && <Line
                                    data={chartData}
                                    options={{
                                        maintainAspectRatio: false,
                                        plugins: { legend: { display: false } },
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                grid: { borderDash: [5, 5] }
                                            },
                                            x: { grid: { display: false } }
                                        }
                                    }}
                                />}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={4}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Header className="bg-white py-3">
                            <h6 className="fw-bold mb-0">Répartition par Catégorie</h6>
                        </Card.Header>
                        <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                            <div style={{ height: '240px', width: '240px' }} className="mb-4">
                                {categoryData && <Doughnut data={categoryData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, cutout: '75%' }} />}
                            </div>
                            <div className="w-100">
                                {categoryData?.labels.map((label, i) => (
                                    <div key={i} className="d-flex align-items-center justify-content-between mb-2 pb-2 border-bottom border-light">
                                        <div className="d-flex align-items-center">
                                            <div className="rounded-circle me-2" style={{ width: '8px', height: '8px', backgroundColor: categoryData.datasets[0].backgroundColor[i] }}></div>
                                            <span className="small text-muted">{label}</span>
                                        </div>
                                        <span className="small fw-bold text-dark">{categoryData.datasets[0].data[i]}%</span>
                                    </div>
                                ))}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mt-2 g-4 mb-4">
                <Col lg={7}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Header className="bg-white py-3">
                            <h6 className="fw-bold mb-0">Top 5 Clients par Revenus</h6>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <Table responsive hover className="mb-0">
                                <thead className="bg-light">
                                    <tr>
                                        <th className="border-0 ps-4 small text-muted text-uppercase fw-bold">Client</th>
                                        <th className="border-0 small text-muted text-uppercase fw-bold">Part</th>
                                        <th className="border-0 pe-4 text-end small text-muted text-uppercase fw-bold">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topCustomers.map((c, i) => {
                                        const cleanRevenue = stats.totalRevenue.replace(/\s/g, '').replace('€', '').replace(',', '.');
                                        const totalRevNum = parseFloat(cleanRevenue) || 1;
                                        const share = ((c.total / totalRevNum) * 100).toFixed(1);
                                        return (
                                            <tr key={i}>
                                                <td className="ps-4 py-3 fw-bold text-dark">{c.name}</td>
                                                <td className="py-3" style={{ width: '40%' }}>
                                                    <div className="d-flex align-items-center">
                                                        <ProgressBar now={share} variant="primary" style={{ height: '6px', flex: 1 }} className="me-2" />
                                                        <span className="small text-muted">{share}%</span>
                                                    </div>
                                                </td>
                                                <td className="pe-4 py-3 text-end fw-bold">{c.total.toLocaleString()} €</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={5}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center">
                            <h6 className="fw-bold mb-0">Performance des Canaux</h6>
                            <Button variant="link" className="p-0 text-primary small">Détails</Button>
                        </Card.Header>
                        <Card.Body>
                            <div className="mb-4">
                                <div className="d-flex justify-content-between mb-1">
                                    <span className="small text-muted">Ventes Directes</span>
                                    <span className="small fw-bold">65%</span>
                                </div>
                                <ProgressBar now={65} variant="primary" style={{ height: '6px' }} />
                            </div>
                            <div className="mb-4">
                                <div className="d-flex justify-content-between mb-1">
                                    <span className="small text-muted">Partenaires</span>
                                    <span className="small fw-bold">25%</span>
                                </div>
                                <ProgressBar now={25} variant="success" style={{ height: '6px' }} />
                            </div>
                            <div className="mb-4">
                                <div className="d-flex justify-content-between mb-1">
                                    <span className="small text-muted">E-commerce</span>
                                    <span className="small fw-bold">10%</span>
                                </div>
                                <ProgressBar now={10} variant="info" style={{ height: '6px' }} />
                            </div>
                            <div className="mt-4 p-3 bg-soft-info rounded-3">
                                <p className="small text-info mb-0">
                                    <FeatherIcon icon="info" size="14" className="me-2" />
                                    Les ventes directes restent votre canal principal avec une croissance de 12% ce mois-ci.
                                </p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default SalesReport;
