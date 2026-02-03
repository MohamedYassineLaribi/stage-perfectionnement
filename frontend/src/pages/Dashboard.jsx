import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Dropdown, Table, Badge, ProgressBar } from 'react-bootstrap';
import FeatherIcon from 'feather-icons-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import invoiceService from '../services/invoiceService';
import orderService from '../services/orderService';
import contactService from '../services/contactService';
import api from '../services/api';

// Registre ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const DashCard = ({ title, value, icon, color, trend, trendValue, progress }) => (
    <Card className="border-0 shadow-sm h-100 overflow-hidden">
        <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h6 className="text-muted text-uppercase fw-bold mb-1" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>{title}</h6>
                    <h3 className="fw-bolder mb-0 text-dark">{value}</h3>
                </div>
                <div className={`p-3 rounded-circle bg-${color} bg-opacity-10 text-${color}`}>
                    <FeatherIcon icon={icon} size="24" />
                </div>
            </div>
            <div className="mb-3">
                <ProgressBar now={progress} variant={color} style={{ height: '6px' }} className="rounded-pill" />
            </div>
            <div className="d-flex justify-content-between align-items-center">
                <span className={`text-${trend === 'up' ? 'success' : 'danger'} small fw-bold d-flex align-items-center`}>
                    <FeatherIcon icon={`trending-${trend}`} size="14" className="me-1" />
                    {trendValue}
                </span>
                <span className="text-muted small">Depuis le mois dernier</span>
            </div>
        </Card.Body>
    </Card>
);

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    // State management for data
    const [stats, setStats] = useState({
        revenue: 0,
        orders: 0,
        clients: 0,
        invoices: 0,
        offers: 0,
        activities: 0,
        leads: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [salesData, setSalesData] = useState({
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
        datasets: []
    });

    const userRole = (typeof user?.role === 'string' ? user.role : user?.role?.name || 'Admin').toLowerCase();
    const isAdmin = userRole === 'admin' || userRole === 'administrateur';

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const results = await Promise.allSettled([
                    orderService.getAll(),
                    contactService.getAll(),
                    api.get('/offers'),
                    api.get('/activities'),
                    api.get('/leads')
                ]);

                const ordersData = results[0].status === 'fulfilled' ? results[0].value : [];
                const clientsData = results[1].status === 'fulfilled' ? results[1].value : [];
                const offersData = results[2].status === 'fulfilled' ? results[2].value.data : [];
                const activitiesData = results[3].status === 'fulfilled' ? results[3].value.data : [];
                const leadsData = results[4].status === 'fulfilled' ? results[4].value.data : [];

                let invoicesData = [];
                if (user?.role === 'Admin' || user?.role?.name === 'Admin') {
                    const invRes = await invoiceService.getAll();
                    invoicesData = invRes || [];
                }

                const totalRevenue = ordersData.reduce((sum, order) => sum + (order.totalAmountTTC || 0), 0);

                setStats({
                    revenue: totalRevenue || 0,
                    orders: ordersData.length || 0,
                    clients: clientsData.length || 0,
                    invoices: invoicesData.length || 0,
                    offers: offersData.length || 0,
                    activities: activitiesData.length || 0,
                    leads: leadsData.length || 0
                });

                setRecentOrders(ordersData.slice(0, 5));

                setSalesData({
                    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
                    datasets: [
                        {
                            label: 'Revenus (€)',
                            data: [12000, 19000, 15000, 22000, 18000, totalRevenue > 0 ? totalRevenue : 12000],
                            borderColor: '#4f46e5',
                            backgroundColor: 'rgba(79, 70, 229, 0.5)',
                            tension: 0.4,
                            fill: true,
                        },
                    ],
                });

            } catch (error) {
                console.error("Dashboard data load failed", error);
            }
        };
        loadDashboardData();
    }, [user]);

    // Chart Options
    const lineOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: false },
        },
        scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
            x: { grid: { display: false } }
        }
    };

    const doughnutData = {
        labels: ['Payé', 'En attente', 'Retard'],
        datasets: [
            {
                data: [65, 25, 10],
                backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
                borderWidth: 0,
            },
        ],
    };

    return (
        <div className="fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="fw-bold text-dark">Tableau de Bord</h3>
                    <p className="text-muted mb-0">Espace de gestion CRM {isAdmin ? 'Administrateur' : 'Commercial'}.</p>
                </div>
            </div>

            {/* Stats Row */}
            <Row className="mb-4 g-4">
                {isAdmin ? (
                    <>
                        <Col xl={3} md={6}>
                            <DashCard
                                title="Revenus Totaux"
                                value={`${stats.revenue.toLocaleString()} €`}
                                icon="dollar-sign"
                                color="success"
                                trend="up"
                                trendValue="+12.5%"
                                progress={75}
                            />
                        </Col>
                        <Col xl={3} md={6}>
                            <DashCard
                                title="Commandes Globales"
                                value={stats.orders}
                                icon="shopping-bag"
                                color="primary"
                                trend="up"
                                trendValue="+8.2%"
                                progress={60}
                            />
                        </Col>
                        <Col xl={3} md={6}>
                            <DashCard
                                title="Leads Actifs"
                                value={stats.leads}
                                icon="target"
                                color="info"
                                trend="up"
                                trendValue="+14.2%"
                                progress={55}
                            />
                        </Col>
                        <Col xl={3} md={6}>
                            <DashCard
                                title="Factures"
                                value={stats.invoices}
                                icon="file-text"
                                color="warning"
                                trend="up"
                                trendValue="+5.3%"
                                progress={80}
                            />
                        </Col>
                    </>
                ) : (
                    <>
                        <Col xl={3} md={6}>
                            <DashCard
                                title="Mes Offres"
                                value={stats.offers}
                                icon="file-text"
                                color="primary"
                                trend="up"
                                trendValue="+4.1%"
                                progress={65}
                            />
                        </Col>
                        <Col xl={3} md={6}>
                            <DashCard
                                title="Mes Commandes"
                                value={stats.orders}
                                icon="package"
                                color="success"
                                trend="up"
                                trendValue="+2.5%"
                                progress={50}
                            />
                        </Col>
                        <Col xl={3} md={6}>
                            <DashCard
                                title="Mes Clients"
                                value={stats.clients}
                                icon="users"
                                color="info"
                                trend="up"
                                trendValue="+1.2%"
                                progress={35}
                            />
                        </Col>
                        <Col xl={3} md={6}>
                            <DashCard
                                title="Activités Planifiées"
                                value={stats.activities}
                                icon="calendar"
                                color="warning"
                                trend="up"
                                trendValue="+15%"
                                progress={20}
                            />
                        </Col>
                    </>
                )}
            </Row>

            {/* Charts Section */}
            <Row className="mb-4 g-4">
                <Col xl={user?.role?.name === 'Admin' ? 8 : 12} lg={user?.role?.name === 'Admin' ? 7 : 12}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Header className="bg-transparent border-0 d-flex justify-content-between align-items-center">
                            <h5 className="mb-0 fw-bold">Performance {user?.role?.name === 'Admin' ? 'des Ventes' : 'Personnelle'}</h5>
                            <Dropdown>
                                <Dropdown.Toggle variant="light" size="sm" className="border-0 bg-transparent no-caret">
                                    <FeatherIcon icon="more-horizontal" size="18" className="text-muted" />
                                </Dropdown.Toggle>
                            </Dropdown>
                        </Card.Header>
                        <Card.Body>
                            <div style={{ height: '300px' }}>
                                <Line options={lineOptions} data={salesData} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                {user?.role?.name === 'Admin' && (
                    <Col xl={4} lg={5}>
                        <Card className="border-0 shadow-sm h-100">
                            <Card.Header className="bg-transparent border-0">
                                <h5 className="mb-0 fw-bold">État des Factures</h5>
                            </Card.Header>
                            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                                <div style={{ width: '250px', height: '250px' }}>
                                    < Doughnut data={doughnutData} options={{ maintainAspectRatio: false }} />
                                </div>
                                <div className="mt-4 w-100">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-success fw-bold"><span className="badge bg-success rounded-circle p-1 me-2">•</span>Payé</span>
                                        <span>65%</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-warning fw-bold"><span className="badge bg-warning rounded-circle p-1 me-2">•</span>En attente</span>
                                        <span>25%</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span className="text-danger fw-bold"><span className="badge bg-danger rounded-circle p-1 me-2">•</span>Retard</span>
                                        <span>10%</span>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                )}
            </Row>

            {/* Recent Orders & Activities Row */}
            <Row className="g-4">
                <Col xl={8}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Header className="bg-transparent border-0 d-flex justify-content-between align-items-center py-3">
                            <h5 className="mb-0 fw-bold">Commandes Récentes</h5>
                            <button className="btn btn-sm btn-outline-primary" onClick={() => navigate('/orders')}>Voir tout</button>
                        </Card.Header>
                        <Table hover responsive className="mb-0 align-middle">
                            <thead className="bg-light">
                                <tr>
                                    <th className="border-0 px-4">Référence</th>
                                    <th className="border-0">Client</th>
                                    <th className="border-0">Montant</th>
                                    <th className="border-0">Statut</th>
                                    <th className="border-0 text-end pe-4">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4 text-muted">Aucune commande récente.</td>
                                    </tr>
                                ) : (
                                    recentOrders.map((order) => (
                                        <tr key={order._id}>
                                            <td className="px-4 fw-bold text-primary">{order.reference}</td>
                                            <td>{order.client?.companyName || 'Client'}</td>
                                            <td className="fw-bold">{order.totalAmountTTC.toFixed(2)} €</td>
                                            <td>
                                                <Badge bg={order.status === 'confirmed' ? 'success' : 'warning'} pill>
                                                    {order.status}
                                                </Badge>
                                            </td>
                                            <td className="text-end pe-4">
                                                <button className="btn btn-sm btn-light p-1 text-muted"><FeatherIcon icon="eye" size="16" /></button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    </Card>
                </Col>
                <Col xl={4}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Header className="bg-transparent border-0 d-flex justify-content-between align-items-center py-3">
                            <h5 className="mb-0 fw-bold">Activités à venir</h5>
                            <button className="btn btn-sm btn-link text-decoration-none p-0" onClick={() => navigate('/calendar')}>Tout voir</button>
                        </Card.Header>
                        <Card.Body className="pt-0">
                            {[
                                { title: 'Appel Commercial', time: '14:30', date: 'Aujourd\'hui', type: 'call', color: 'primary' },
                                { title: 'Réunion Projet X', time: '10:00', date: 'Demain', type: 'users', color: 'info' },
                                { title: 'Envoi Devis #45', time: '16:00', date: '04 Fév', type: 'mail', color: 'warning' },
                                { title: 'Visite Client CRM App', time: '11:00', date: '05 Fév', type: 'map-pin', color: 'success' }
                            ].map((act, idx) => (
                                <div key={idx} className={`d-flex align-items-center p-3 mb-2 rounded-3 bg-${act.color} bg-opacity-10`}>
                                    <div className={`p-2 rounded-circle bg-white text-${act.color} me-3 shadow-sm`}>
                                        <FeatherIcon icon={act.type} size="16" />
                                    </div>
                                    <div className="flex-grow-1">
                                        <h6 className="mb-0 fw-bold small">{act.title}</h6>
                                        <span className="text-muted" style={{ fontSize: '11px' }}>{act.date} • {act.time}</span>
                                    </div>
                                    <FeatherIcon icon="chevron-right" size="14" className="text-muted" />
                                </div>
                            ))}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
