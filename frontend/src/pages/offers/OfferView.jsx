import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col, Table, Badge, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import offerService from '../../services/offerService';
import FeatherIcon from 'feather-icons-react';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';
import SignaturePad from '../../components/SignaturePad';
import { Modal } from 'react-bootstrap';

const OfferView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [offer, setOffer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showSignModal, setShowSignModal] = useState(false);
    const [signature, setSignature] = useState(null);

    useEffect(() => {
        const fetchOffer = async () => {
            try {
                const data = await offerService.getById(id);
                setOffer(data);
                setLoading(false);
            } catch (err) {
                setError("Impossible de charger l'offre.");
                toast.error("Impossible de charger l'offre.");
                setLoading(false);
            }
        };
        fetchOffer();
    }, [id]);

    const handleConvert = async () => {
        if (!window.confirm("Voulez-vous vraiment convertir cette offre en commande ?")) return;

        try {
            await offerService.convert(id);
            toast.success("Offre convertie avec succès !");
            navigate('/orders'); // Redirect to orders list
        } catch (err) {
            console.error(err);
            toast.error("Erreur lors de la conversion : " + (err.response?.data?.message || err.message));
        }
    };

    const handleUpdateStatus = async (newStatus) => {
        try {
            await offerService.update(id, { status: newStatus });
            setOffer({ ...offer, status: newStatus });
            toast.success(`Offre marquée comme ${newStatus} !`);
        } catch (err) {
            toast.error("Erreur lors de la mise à jour du statut");
        }
    };

    const handleSaveSignature = (dataUrl) => {
        setSignature(dataUrl);
        setShowSignModal(false);
        toast.success("Signature enregistrée sur l'offre !");
        handleUpdateStatus('accepted');
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <Alert variant="danger">{error}</Alert>;
    if (!offer) return <div>Offre introuvable.</div>;

    return (
        <Container>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Button variant="light" onClick={() => navigate('/offers')}>
                    <FeatherIcon icon="arrow-left" className="me-2" size="18" />
                    Retour
                </Button>
                <div>
                    {offer.status !== 'converted' && offer.status !== 'accepted' && (
                        <>
                            <Button variant="success" onClick={handleConvert}>
                                <FeatherIcon icon="check-circle" className="me-2" size="18" />
                                Confirmer & Convertir en Ordre
                            </Button>
                            <Button variant="outline-success" className="ms-2" onClick={() => handleUpdateStatus('accepted')}>
                                <FeatherIcon icon="thumbs-up" className="me-2" size="18" />
                                Accepter
                            </Button>
                            <Button variant="outline-danger" className="ms-2" onClick={() => handleUpdateStatus('rejected')}>
                                <FeatherIcon icon="thumbs-down" className="me-2" size="18" />
                                Rejeter
                            </Button>
                        </>
                    )}
                    <Button variant="outline-primary" className="ms-2" onClick={() => handleUpdateStatus('sent')}>
                        <FeatherIcon icon="send" className="me-2" size="18" />
                        Envoyer
                    </Button>
                    <Button variant="outline-success" className="ms-2" onClick={() => setShowSignModal(true)}>
                        <FeatherIcon icon="pen-tool" className="me-2" size="18" />
                        Signer
                    </Button>
                    <Button variant="primary" className="ms-2" onClick={() => navigate(`/offers/edit/${offer._id}`)}>
                        <FeatherIcon icon="edit" className="me-2" size="18" />
                        Modifier
                    </Button>
                    <Button variant="outline-dark" className="ms-2" onClick={() => window.print()}>
                        <FeatherIcon icon="printer" className="me-2" size="18" />
                        Imprimer PDF
                    </Button>
                </div>
            </div>

            <Card className="border-0 shadow-sm mb-4">
                <Card.Body>
                    <div className="d-flex justify-content-between">
                        <div>
                            <h3 className="fw-bold text-primary">{offer.reference}</h3>
                            <h5 className="text-muted">{offer.title}</h5>
                        </div>
                        <div className="text-end">
                            <Badge bg={offer.status === 'converted' ? 'success' : 'info'} className="fs-6 mb-2">
                                {offer.status.toUpperCase()}
                            </Badge>
                            <p className="text-muted mb-0">Date: {new Date(offer.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <hr />
                    <Row className="mb-4">
                        <Col md={6}>
                            <h6 className="fw-bold text-uppercase text-muted small">Client</h6>
                            <p className="fw-bold mb-0">
                                {offer.client?.companyName || `${offer.client?.firstName} ${offer.client?.lastName}`}
                            </p>
                            <p className="mb-0">{offer.client?.email}</p>
                        </Col>
                        <Col md={6} className="text-md-end">
                            <h6 className="fw-bold text-uppercase text-muted small">Vendeur</h6>
                            <p>{offer.salesPerson?.name || 'N/A'}</p>
                        </Col>
                    </Row>

                    <Table responsive hover className="mb-4">
                        <thead className="bg-light">
                            <tr>
                                <th>Description</th>
                                <th className="text-center">Qté</th>
                                <th className="text-end">Prix Unit.</th>
                                <th className="text-center">Remise</th>
                                <th className="text-end">Total HT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {offer.items.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                        <div className="fw-bold">{item.description}</div>
                                        {/* <small className="text-muted">{item.article?.name}</small> */}
                                    </td>
                                    <td className="text-center">{item.quantity}</td>
                                    <td className="text-end">{item.unitPrice.toFixed(2)} €</td>
                                    <td className="text-center">{item.discount}%</td>
                                    <td className="text-end fw-bold">{item.totalLine.toFixed(2)} €</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <Row>
                        <Col md={{ span: 5, offset: 7 }}>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Total HT</span>
                                <span className="fw-bold">{offer.totalAmountHT.toFixed(2)} €</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">TVA (20%)</span>
                                <span>{(offer.totalAmountTTC - offer.totalAmountHT).toFixed(2)} €</span>
                            </div>
                            <div className="d-flex justify-content-between border-top pt-2 mb-4">
                                <span className="fs-5 fw-bold">Total TTC</span>
                                <span className="fs-5 fw-bold text-primary">{offer.totalAmountTTC.toFixed(2)} €</span>
                            </div>

                            {signature && (
                                <div className="mt-4 p-3 border rounded-4 bg-light text-center">
                                    <h6 className="small fw-bold text-uppercase text-muted mb-2">Signature du Client</h6>
                                    <img src={signature} alt="Client Signature" style={{ maxWidth: '200px', maxHeight: '100px' }} />
                                    <p className="smaller text-muted mt-2 mb-0">Signé le {new Date().toLocaleDateString()}</p>
                                </div>
                            )}
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Modal show={showSignModal} onHide={() => setShowSignModal(false)} centered>
                <Modal.Header closeButton className="border-0">
                    <Modal.Title className="fw-bold">Signature de l'offre</Modal.Title>
                </Modal.Header>
                <Modal.Body className="py-4">
                    <p className="text-muted small mb-4">Veuillez signer ci-dessous pour valider l'offre commerciale.</p>
                    <SignaturePad onSave={handleSaveSignature} />
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default OfferView;
