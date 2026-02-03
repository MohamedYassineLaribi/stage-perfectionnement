import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Container, Spinner, ProgressBar } from 'react-bootstrap';
import PageHeader from '../../components/PageHeader';
import FeatherIcon from 'feather-icons-react';
import invoiceService from '../../services/invoiceService';
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

const InvoiceReport = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalIssued: 0,
        paid: 0,
        unpaid: 0,
        totalAmount: '0 €'
    });
    const [chartData, setChartData] = useState(null);
    const [agingData, setAgingData] = useState(null);

    useEffect(() => {
        const fetchInvoiceStats = async () => {
            try {
                const invoices = await invoiceService.getAll();
                const totalAmount = invoices.reduce((sum, inv) => sum + (inv.amountDue || 0), 0);
                const paid = invoices.filter(inv => inv.status === 'paid').length;
                const overdue = invoices.filter(inv => inv.status === 'overdue').length;
                const issued = invoices.filter(inv => inv.status === 'issued').length;

                setStats({
                    totalIssued: invoices.length,
                    paid,
                    unpaid: overdue + issued,
                    totalAmount: totalAmount.toLocaleString() + ' €'
                });

                setChartData({
                    labels: ['Payées', 'En attente', 'En retard', 'Annulées'],
                    datasets: [{
                        data: [
                            paid,
                            issued,
                            overdue,
                            invoices.filter(inv => inv.status === 'cancelled').length
                        ],
                        backgroundColor: ['#10b981', '#0ea5e9', '#ef4444', '#cbd5e1']
                    }]
                });

                // Prepare Aging Data (Retards)
                setAgingData({
                    labels: ['0-30 Jours', '31-60 Jours', '61-90 Jours', '90+ Jours'],
                    datasets: [{
                        label: 'Montant en retard (€)',
                        data: [1200, 850, 400, 1500],
                        backgroundColor: ['#fed7aa', '#fb923c', '#ea580c', '#9a3412']
                    }]
                });

                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchInvoiceStats();
    }, []);

    if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>;

    const paidRate = stats.totalIssued > 0 ? (stats.paid / stats.totalIssued * 100).toFixed(1) : 0;

    return (
        <Container fluid>
            <PageHeader title="Statut des Factures" breadcrumb={[{ label: 'Rapports', path: '/reports' }, { label: 'Factures' }]} />

            <Row>
                <Col xl={3} md={6}>
                    <StatCard label="Factures Émises" value={stats.totalIssued} icon="file-plus" color="primary" />
                </Col>
                <Col xl={3} md={6}>
                    <StatCard label="Recouvrement" value={stats.paid} icon="check-square" color="success" trend={`${paidRate}%`} />
                </Col>
                <Col xl={3} md={6}>
                    <StatCard label="En Attente" value={stats.unpaid} icon="clock" color="warning" />
                </Col>
                <Col xl={3} md={6}>
                    <StatCard label="Chiffre d'Affaires" value={stats.totalAmount} icon="credit-card" color="info" />
                </Col>
            </Row>

            <Row className="g-4">
                <Col lg={4}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Header className="bg-white py-3 fs-6 fw-bold">Répartition des Paiements</Card.Header>
                        <Card.Body className="d-flex align-items-center justify-content-center">
                            <div style={{ height: '240px', width: '240px' }}>
                                {chartData && <Pie data={chartData} options={{ maintainAspectRatio: false }} />}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={8}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Header className="bg-white py-3 fs-6 fw-bold">Analyse des Retards (Aging Balance)</Card.Header>
                        <Card.Body>
                            <div style={{ height: '250px' }}>
                                {agingData && <Bar
                                    data={agingData}
                                    options={{
                                        maintainAspectRatio: false,
                                        plugins: { legend: { display: false } },
                                        scales: { y: { beginAtZero: true } }
                                    }}
                                />}
                            </div>
                            <div className="p-3 bg-light rounded-3 mt-4">
                                <div className="d-flex align-items-center">
                                    <div className="avatar-text bg-soft-warning text-warning me-3">
                                        <FeatherIcon icon="alert-triangle" size="18" />
                                    </div>
                                    <div>
                                        <h6 className="mb-1 fw-bold small text-dark">Attention aux retards critiques</h6>
                                        <p className="mb-0 text-muted small">Vous avez {stats.unpaid} factures nécessitant une relance immédiate.</p>
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default InvoiceReport;
