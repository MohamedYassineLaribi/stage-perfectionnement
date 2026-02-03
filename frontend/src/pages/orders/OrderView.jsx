import { Container, Card, Button, Row, Col, Table, Badge, Alert, Form } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import orderService from '../../services/orderService';
import invoiceService from '../../services/invoiceService';
import FeatherIcon from 'feather-icons-react';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';

const OrderView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const data = await orderService.getById(id);
                setOrder(data);
                setLoading(false);
            } catch (err) {
                setError("Impossible de charger la commande.");
                toast.error("Impossible de charger la commande.");
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending': return 'warning';
            case 'confirmed': return 'info';
            case 'processing': return 'primary';
            case 'delivered': return 'success';
            case 'cancelled': return 'danger';
            default: return 'secondary';
        }
    };

    const handleUpdateStatus = async (newStatus) => {
        try {
            await orderService.update(id, { status: newStatus });
            setOrder({ ...order, status: newStatus });
            toast.success(`Commande marquée comme ${newStatus} !`);
        } catch (err) {
            toast.error("Erreur lors de la mise à jour du statut");
        }
    };

    const handleGenerateInvoice = async () => {
        if (!window.confirm("Voulez-vous générer la facture pour cette commande ?")) return;
        try {
            await invoiceService.create({ orderId: id });
            toast.success("Facture générée avec succès !");
            navigate('/invoices');
        } catch (err) {
            console.error(err);
            toast.error("Erreur lors de la génération de la facture : " + (err.response?.data?.message || err.message));
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <Alert variant="danger">{error}</Alert>;
    if (!order) return <div>Commande introuvable.</div>;

    return (
        <Container>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Button variant="light" onClick={() => navigate('/orders')}>
                    <FeatherIcon icon="arrow-left" className="me-2" size="18" />
                    Retour
                </Button>
                <div className="d-flex align-items-center gap-2">
                    <Form.Select
                        size="sm"
                        className="w-auto"
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(e.target.value)}
                    >
                        <option value="pending">En attente</option>
                        <option value="confirmed">Confirmé</option>
                        <option value="processing">En préparation</option>
                        <option value="shipped">Expédié</option>
                        <option value="delivered">Livré</option>
                        <option value="cancelled">Annulé</option>
                    </Form.Select>
                    {user?.role?.name === 'Admin' && (
                        <Button variant="outline-primary" onClick={handleGenerateInvoice}>
                            <FeatherIcon icon="file-text" className="me-2" size="18" />
                            Générer Facture
                        </Button>
                    )}
                </div>
            </div>

            <Card className="border-0 shadow-sm mb-4">
                <Card.Body>
                    <div className="d-flex justify-content-between">
                        <div>
                            <h3 className="fw-bold text-primary">{order.reference}</h3>
                            <p className="text-muted">Issue de l'offre: {order.sourceOffer?.reference || 'N/A'}</p>
                        </div>
                        <div className="text-end">
                            <Badge bg={getStatusBadge(order.status)} className="fs-6 mb-2">
                                {order.status?.toUpperCase()}
                            </Badge>
                            <p className="text-muted mb-0">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <hr />
                    <Row className="mb-4">
                        <Col md={6}>
                            <h6 className="fw-bold text-uppercase text-muted small">Client</h6>
                            <p className="fw-bold mb-0">
                                {order.client?.companyName || `${order.client?.firstName} ${order.client?.lastName}`}
                            </p>
                            <p className="mb-0">{order.client?.email}</p>
                            <p className="text-muted">{order.client?.address}</p>
                        </Col>
                    </Row>

                    <Table responsive hover className="mb-4">
                        <thead className="bg-light">
                            <tr>
                                <th>Description</th>
                                <th className="text-center">Qté</th>
                                <th className="text-end">Prix Unit.</th>
                                <th className="text-end">Total HT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items?.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                        <div className="fw-bold">{item.description}</div>
                                        {/* <small className="text-muted">{item.article?.name}</small> */}
                                    </td>
                                    <td className="text-center">{item.quantity}</td>
                                    <td className="text-end">{item.unitPrice?.toFixed(2)} €</td>
                                    <td className="text-end fw-bold">{item.totalLine?.toFixed(2)} €</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <Row>
                        <Col md={{ span: 5, offset: 7 }}>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Total HT</span>
                                <span className="fw-bold">{order.totalAmountHT?.toFixed(2)} €</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">TVA (20%)</span>
                                <span>{(order.totalAmountTTC - order.totalAmountHT).toFixed(2)} €</span>
                            </div>
                            <div className="d-flex justify-content-between border-top pt-2">
                                <span className="fs-5 fw-bold">Total TTC</span>
                                <span className="fs-5 fw-bold text-primary">{order.totalAmountTTC?.toFixed(2)} €</span>
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default OrderView;
