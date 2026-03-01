import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col, Table, Badge, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import invoiceService from '../../services/invoiceService';
import FeatherIcon from 'feather-icons-react';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';

const InvoiceView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const data = await invoiceService.getById(id);
                setInvoice(data);
                setLoading(false);
            } catch (err) {
                setError("Impossible de charger la facture.");
                toast.error("Impossible de charger la facture.");
                setLoading(false);
            }
        };
        fetchInvoice();
    }, [id]);

    const handleDownload = async () => {
        try {
            const blob = await invoiceService.downloadPdf(id);
            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `facture-${invoice.reference}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            toast.success("Téléchargement démarré");
        } catch (err) {
            console.error("Download failed", err);
            toast.error("Erreur lors du téléchargement du PDF");
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <Alert variant="danger">{error}</Alert>;
    if (!invoice) return <div>Facture introuvable.</div>;

    const items = invoice.order?.items || [];

    return (
        <Container>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Button variant="light" onClick={() => navigate('/invoices')}>
                    <FeatherIcon icon="arrow-left" className="me-2" size="18" />
                    Retour
                </Button>
                <div>
                    <Button variant="outline-primary" onClick={handleDownload}>
                        <FeatherIcon icon="download" className="me-2" size="18" />
                        Télécharger PDF
                    </Button>
                    <Button variant="outline-dark" className="ms-2" onClick={() => window.print()}>
                        <FeatherIcon icon="printer" className="me-2" size="18" />
                        Imprimer PDF
                    </Button>
                </div>
            </div>

            <Card className="border-0 shadow-sm mb-4">
                <Card.Body className="p-5">
                    <Row className="mb-5">
                        <Col>
                            <h2 className="fw-bold text-primary">CRM APP</h2>
                            <p className="mb-0">123 Avenue de la Rénovation</p>
                            <p>75000 Paris, France</p>
                        </Col>
                        <Col className="text-end">
                            <h4 className="fw-bold">FACTURE</h4>
                            <h5 className="text-muted">{invoice.reference}</h5>
                            <Badge bg="primary" className="fs-6 mt-2">{invoice.status.toUpperCase()}</Badge>
                        </Col>
                    </Row>

                    <Row className="mb-5">
                        <Col md={6}>
                            <h6 className="fw-bold text-uppercase text-muted small">Facturé à :</h6>
                            <h5 className="fw-bold">
                                {invoice.client?.companyName || `${invoice.client?.firstName} ${invoice.client?.lastName}`}
                            </h5>
                            <p>{invoice.client?.email}</p>
                            <p>{invoice.client?.address || "Adresse non renseignée"}</p>
                        </Col>
                        <Col md={6} className="text-md-end">
                            <p className="mb-1"><span className="fw-bold text-muted">Date de facture :</span> {new Date(invoice.createdAt).toLocaleDateString()}</p>
                            <p className="mb-1"><span className="fw-bold text-muted">Date d'échéance :</span> {new Date(invoice.dueDate).toLocaleDateString()}</p>
                        </Col>
                    </Row>

                    <Table className="mb-5">
                        <thead className="bg-light">
                            <tr>
                                <th>Description</th>
                                <th className="text-center">Qté</th>
                                <th className="text-end">Prix Unit.</th>
                                <th className="text-end">Total HT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.description}</td>
                                    <td className="text-center">{item.quantity}</td>
                                    <td className="text-end">{item.unitPrice.toFixed(2)} €</td>
                                    <td className="text-end fw-bold">{item.totalLine.toFixed(2)} €</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <Row>
                        <Col md={{ span: 5, offset: 7 }}>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Total HT</span>
                                <span className="fw-bold">{invoice.order?.totalAmountHT?.toFixed(2)} €</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">TVA (20%)</span>
                                <span>{(invoice.amountDue - (invoice.order?.totalAmountHT || 0)).toFixed(2)} €</span>
                            </div>
                            <div className="d-flex justify-content-between border-top pt-2">
                                <span className="fs-5 fw-bold">Total TTC (À payer)</span>
                                <span className="fs-5 fw-bold text-primary">{invoice.amountDue.toFixed(2)} €</span>
                            </div>
                        </Col>
                    </Row>

                    {/* Footer / Notes */}
                    <div className="mt-5 text-muted small text-center">
                        <p>Merci de votre confiance. Paiement dû sous 30 jours.</p>
                        <p>Coordonnées Bancaires : FR76 1234 5678 9012 3456 7890 123</p>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default InvoiceView;
