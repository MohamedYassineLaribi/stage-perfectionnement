import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Nav, Tab, Alert, Badge } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
// Using feather-icons-react
import FeatherIcon from 'feather-icons-react';
import { useTheme } from '../contexts/ThemeContext';
import authService from '../services/authService';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';

const Settings = ({ defaultTab = 'profile' }) => {
    const { user } = useAuth();
    const { theme, toggleTheme, darkMode } = useTheme();

    // Tab State
    const [activeTab, setActiveTab] = useState(defaultTab);

    useEffect(() => {
        if (defaultTab) {
            setActiveTab(defaultTab);
        }
    }, [defaultTab]);

    // Profile State
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [notificationsPrefs, setNotificationsPrefs] = useState({ emailNotif: true, pushNotif: true, weeklyReport: false });

    // App Settings State (Persisted)
    const [activityTypes, setActivityTypes] = useState([]);
    const [offerStatuses, setOfferStatuses] = useState([]);
    const [offerTypes, setOfferTypes] = useState([]);
    const [orderStatuses, setOrderStatuses] = useState([]);
    const [workflow, setWorkflow] = useState({
        autoInvoice: false,
        autoConvert: false
    });

    const [enterprise, setEnterprise] = useState({ name: '', vat: '', address: '', phone: '', currency: 'Euro (€)' });
    const [emailConfig, setEmailConfig] = useState({ host: 'smtp.crmapp.com', user: 'noreply@crmapp.com', password: '', port: 587, encryption: 'TLS' });
    const [backupConfig, setBackupConfig] = useState({ autoBackup: true, time: '02:00', retentionDays: 30 });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get('/settings');
                setActivityTypes(res.data.activityTypes || []);
                setOfferStatuses(res.data.offerStatuses || []);
                setOfferTypes(res.data.offerTypes || ['Standard', 'Récursion', 'Service', 'Produit']);
                setOrderStatuses(res.data.orderStatuses || []);
                setWorkflow(res.data.workflow || { autoInvoice: false, autoConvert: false });
                if (res.data.notifications) setNotificationsPrefs(res.data.notifications);
                if (res.data.enterprise) setEnterprise(res.data.enterprise);
                if (res.data.emailConfig) setEmailConfig(res.data.emailConfig);
                if (res.data.backupConfig) setBackupConfig(res.data.backupConfig);
            } catch (error) {
                console.error("Erreur lors du chargement des paramètres", error);
            }
        };
        if (user?.role?.name === 'Admin') {
            fetchSettings();
        }
    }, [user]);

    const handleSaveSection = async (sectionData, sectionName) => {
        try {
            await api.put('/settings', sectionData);
            toast.success(`Configuration ${sectionName} enregistrée !`);
        } catch (error) {
            toast.error("Erreur lors de la sauvegarde : " + (error.response?.data?.message || error.message));
        }
    };

    const handleSaveCRM = async () => {
        try {
            await api.put('/settings', {
                activityTypes,
                offerStatuses,
                offerTypes,
                orderStatuses,
                workflow
            });
            toast.success("Configuration CRM enregistrée !");
        } catch (error) {
            toast.error("Erreur lors de la sauvegarde : " + (error.response?.data?.message || error.message));
        }
    };

    const addType = (list, setter, name) => {
        const value = prompt(`Ajouter un nouveau ${name}:`);
        if (value) setter([...list, value]);
    };

    const removeType = (list, setter, index) => {
        const newList = [...list];
        newList.splice(index, 1);
        setter(newList);
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Updated authService to include updateProfile if it doesn't exist
            const response = await authService.updateProfile({ name });
            toast.success("Profil mis à jour !");
            // Note: Since we don't have a global state update here besides context, 
            // the user might need to refresh or we update the context if useAuth provides an update method.
        } catch (error) {
            toast.error("Erreur lors de la mise à jour");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authService.updateProfile({ password: newPassword });
            toast.success("Mot de passe mis à jour !");
            setNewPassword('');
            setCurrentPassword('');
        } catch (error) {
            toast.error("Erreur lors du changement de mot de passe");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container fluid>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold">Paramètres</h3>
            </div>

            <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                <Row>
                    <Col md={3} className="mb-4">
                        <Card className="border-0 shadow-sm">
                            <Card.Body className="p-0">
                                <Nav className="flex-column nav-pills p-2">
                                    <Nav.Item>
                                        <Nav.Link eventKey="profile" className="d-flex align-items-center text-dark mb-1">
                                            <FeatherIcon icon="user" size="18" className="me-2" /> Profil
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="security" className="d-flex align-items-center text-dark mb-1">
                                            <FeatherIcon icon="lock" size="18" className="me-2" /> Sécurité
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="notifications" className="d-flex align-items-center text-dark mb-1">
                                            <FeatherIcon icon="bell" size="18" className="me-2" /> Notifications
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="appearance" className="d-flex align-items-center text-dark mb-1">
                                            <FeatherIcon icon="layout" size="18" className="me-2" /> Apparence
                                        </Nav.Link>
                                    </Nav.Item>
                                    {(user?.role?.name === 'Admin' || user?.role === 'Admin') && (
                                        <>
                                            <hr className="my-2" />
                                            <small className="text-muted px-3 mb-2">ADMIN</small>
                                            <Nav.Item>
                                                <Nav.Link eventKey="enterprise" className="d-flex align-items-center text-dark mb-1">
                                                    <FeatherIcon icon="briefcase" size="18" className="me-2" /> Entreprise
                                                </Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="email" className="d-flex align-items-center text-dark mb-1">
                                                    <FeatherIcon icon="mail" size="18" className="me-2" /> Serveur Email
                                                </Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="crm" className="d-flex align-items-center text-dark mb-1">
                                                    <FeatherIcon icon="settings" size="18" className="me-2" /> Configuration CRM
                                                </Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="backup" className="d-flex align-items-center text-dark mb-1">
                                                    <FeatherIcon icon="database" size="18" className="me-2" /> Sauvegarde
                                                </Nav.Link>
                                            </Nav.Item>
                                        </>
                                    )}
                                </Nav>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={9}>
                        <Tab.Content>
                            {/* PROFILE TAB */}
                            <Tab.Pane eventKey="profile">
                                <Card className="border-0 shadow-sm mb-4">
                                    <Card.Header className="bg-white py-3 fw-bold">Informations Personnelles</Card.Header>
                                    <Card.Body>
                                        <div className="d-flex align-items-center mb-4">
                                            <img
                                                src={user?.avatar || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                                                alt="Avatar"
                                                className="rounded-circle me-3"
                                                width="80"
                                                height="80"
                                            />
                                            <div>
                                                <Button variant="outline-primary" size="sm" className="me-2">Changer l'avatar</Button>
                                                <Button variant="outline-danger" size="sm">Supprimer</Button>
                                            </div>
                                        </div>

                                        <Form onSubmit={handleProfileUpdate}>
                                            <Row>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Nom Complet</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            value={name}
                                                            onChange={(e) => setName(e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Email</Form.Label>
                                                        <Form.Control
                                                            type="email"
                                                            value={email}
                                                            onChange={(e) => setEmail(e.target.value)}
                                                            disabled
                                                        />
                                                        <Form.Text className="text-muted">
                                                            L'email ne peut pas être modifié.
                                                        </Form.Text>
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Rôle</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            value={user?.role?.name || 'N/A'}
                                                            disabled
                                                            readOnly
                                                            className="bg-light"
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <Button variant="primary" type="submit" className="mt-2">Enregistrer les modifications</Button>
                                        </Form>
                                    </Card.Body>
                                </Card>
                            </Tab.Pane>

                            {/* SECURITY TAB */}
                            <Tab.Pane eventKey="security">
                                <Card className="border-0 shadow-sm mb-4">
                                    <Card.Header className="bg-white py-3 fw-bold">Mot de passe</Card.Header>
                                    <Card.Body>
                                        <Form onSubmit={handlePasswordChange}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Mot de passe actuel</Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    value={currentPassword}
                                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Nouveau mot de passe</Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Confirmer le nouveau mot de passe</Form.Label>
                                                <Form.Control type="password" />
                                            </Form.Group>
                                            <Button variant="primary" type="submit">Mettre à jour le mot de passe</Button>
                                        </Form>
                                    </Card.Body>
                                </Card>
                            </Tab.Pane>

                            {/* APPEARANCE TAB */}
                            <Tab.Pane eventKey="appearance">
                                <Card className="border-0 shadow-sm mb-4">
                                    <Card.Header className="bg-white py-3 fw-bold">Thème de l'interface</Card.Header>
                                    <Card.Body>
                                        <Form.Check
                                            type="radio"
                                            label="Thème Clair (Light)"
                                            name="themeGroup"
                                            id="themeLight"
                                            checked={!darkMode}
                                            onChange={() => { if (darkMode) toggleTheme(); }}
                                            className="mb-2"
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="Thème Sombre (Dark)"
                                            name="themeGroup"
                                            id="themeDark"
                                            checked={darkMode}
                                            onChange={() => { if (!darkMode) toggleTheme(); }}
                                        />
                                    </Card.Body>
                                </Card>
                            </Tab.Pane>

                            {/* NOTIFICATIONS TAB */}
                            <Tab.Pane eventKey="notifications">
                                <Card className="border-0 shadow-sm mb-4">
                                    <Card.Header className="bg-white py-3 fw-bold">Préférences de Notification</Card.Header>
                                    <Card.Body>
                                        <Form.Check
                                            type="switch"
                                            id="email-notif"
                                            label="Recevoir des notifications par email"
                                            checked={notificationsPrefs.emailNotif}
                                            onChange={(e) => setNotificationsPrefs({ ...notificationsPrefs, emailNotif: e.target.checked })}
                                            className="mb-3"
                                        />
                                        <Form.Check
                                            type="switch"
                                            id="push-notif"
                                            label="Activer les notifications push"
                                            checked={notificationsPrefs.pushNotif}
                                            onChange={(e) => setNotificationsPrefs({ ...notificationsPrefs, pushNotif: e.target.checked })}
                                            className="mb-3"
                                        />
                                        <Form.Check
                                            type="switch"
                                            id="weekly-report"
                                            label="Recevoir le rapport hebdomadaire"
                                            checked={notificationsPrefs.weeklyReport}
                                            onChange={(e) => setNotificationsPrefs({ ...notificationsPrefs, weeklyReport: e.target.checked })}
                                        />
                                        <Button variant="primary" className="mt-3" onClick={() => handleSaveSection({ notifications: notificationsPrefs }, 'Notifications')}>Enregistrer</Button>
                                    </Card.Body>
                                </Card>
                            </Tab.Pane>

                            {/* EMAIL TAB */}
                            <Tab.Pane eventKey="email">
                                <Card className="border-0 shadow-sm mb-4">
                                    <Card.Header className="bg-white py-3 fw-bold">Configuration SMTP</Card.Header>
                                    <Card.Body>
                                        <Form>
                                            <Row>
                                                <Col md={12} className="mb-3">
                                                    <Form.Label>Hôte SMTP</Form.Label>
                                                    <Form.Control type="text" value={emailConfig.host} onChange={e => setEmailConfig({ ...emailConfig, host: e.target.value })} />
                                                </Col>
                                                <Col md={6} className="mb-3">
                                                    <Form.Label>Utilisateur</Form.Label>
                                                    <Form.Control type="text" value={emailConfig.user} onChange={e => setEmailConfig({ ...emailConfig, user: e.target.value })} />
                                                </Col>
                                                <Col md={6} className="mb-3">
                                                    <Form.Label>Mot de passe</Form.Label>
                                                    <Form.Control type="password" value={emailConfig.password} onChange={e => setEmailConfig({ ...emailConfig, password: e.target.value })} />
                                                </Col>
                                                <Col md={6} className="mb-3">
                                                    <Form.Label>Port</Form.Label>
                                                    <Form.Control type="number" value={emailConfig.port} onChange={e => setEmailConfig({ ...emailConfig, port: e.target.value })} />
                                                </Col>
                                                <Col md={6} className="mb-3">
                                                    <Form.Label>Chiffrement</Form.Label>
                                                    <Form.Select value={emailConfig.encryption} onChange={e => setEmailConfig({ ...emailConfig, encryption: e.target.value })}>
                                                        <option>TLS</option>
                                                        <option>SSL</option>
                                                        <option>Aucun</option>
                                                    </Form.Select>
                                                </Col>
                                            </Row>
                                            <Button variant="primary" className="me-2">Tester la connexion</Button>
                                            <Button variant="primary" onClick={() => handleSaveSection({ emailConfig }, 'Serveur Email')}>Enregistrer</Button>
                                        </Form>
                                    </Card.Body>
                                </Card>
                            </Tab.Pane>

                            {/* ENTERPRISE TAB */}
                            <Tab.Pane eventKey="enterprise">
                                <Card className="border-0 shadow-sm mb-4">
                                    <Card.Header className="bg-white py-3 fw-bold">Informations de l'Entreprise</Card.Header>
                                    <Card.Body>
                                        <Form>
                                            <Row>
                                                <Col md={6} className="mb-3">
                                                    <Form.Label>Nom de l'Entreprise</Form.Label>
                                                    <Form.Control type="text" value={enterprise.name} onChange={e => setEnterprise({ ...enterprise, name: e.target.value })} />
                                                </Col>
                                                <Col md={6} className="mb-3">
                                                    <Form.Label>N° de TVA Intracommunautaire</Form.Label>
                                                    <Form.Control type="text" value={enterprise.vat} onChange={e => setEnterprise({ ...enterprise, vat: e.target.value })} />
                                                </Col>
                                                <Col md={12} className="mb-3">
                                                    <Form.Label>Adresse</Form.Label>
                                                    <Form.Control as="textarea" rows={2} value={enterprise.address} onChange={e => setEnterprise({ ...enterprise, address: e.target.value })} />
                                                </Col>
                                                <Col md={6} className="mb-3">
                                                    <Form.Label>Téléphone</Form.Label>
                                                    <Form.Control type="text" value={enterprise.phone} onChange={e => setEnterprise({ ...enterprise, phone: e.target.value })} />
                                                </Col>
                                                <Col md={6} className="mb-3">
                                                    <Form.Label>Devise par défaut</Form.Label>
                                                    <Form.Select value={enterprise.currency} onChange={e => setEnterprise({ ...enterprise, currency: e.target.value })}>
                                                        <option>Euro (€)</option>
                                                        <option>Dollar ($)</option>
                                                    </Form.Select>
                                                </Col>
                                            </Row>
                                            <Button variant="primary" onClick={() => handleSaveSection({ enterprise }, 'Entreprise')}>Mettre à jour les infos</Button>
                                        </Form>
                                    </Card.Body>
                                </Card>
                            </Tab.Pane>

                            {user?.role?.name === 'Admin' && (
                                <Tab.Pane eventKey="crm">
                                    <Card className="border-0 shadow-sm mb-4">
                                        <Card.Header className="bg-white py-3 fw-bold d-flex justify-content-between align-items-center">
                                            <span>Configuration CRM & Workflow</span>
                                            <Button variant="primary" size="sm" onClick={handleSaveCRM}>
                                                Enregistrer Configuration
                                            </Button>
                                        </Card.Header>
                                        <Card.Body>
                                            <div className="mb-4">
                                                <h6 className="fw-bold mb-3 d-flex align-items-center">
                                                    <FeatherIcon icon="activity" size="16" className="me-2 text-primary" />
                                                    Gestion des Types d'Activités
                                                </h6>
                                                <div className="d-flex flex-wrap gap-2 mb-2 p-3 bg-light rounded-3">
                                                    {activityTypes.map((type, idx) => (
                                                        <Badge key={idx} bg="white" text="dark" className="border px-3 py-2 d-flex align-items-center">
                                                            {type}
                                                            <FeatherIcon
                                                                icon="x"
                                                                size="12"
                                                                className="ms-2 text-danger cursor-pointer"
                                                                onClick={() => removeType(activityTypes, setActivityTypes, idx)}
                                                            />
                                                        </Badge>
                                                    ))}
                                                    <Button variant="outline-primary" size="sm" onClick={() => addType(activityTypes, setActivityTypes, "Type d'activité")}>
                                                        + Nouveau
                                                    </Button>
                                                </div>
                                            </div>

                                            <Row className="mb-4">
                                                <Col md={4}>
                                                    <h6 className="fw-bold mb-3 d-flex align-items-center">
                                                        <FeatherIcon icon="file-text" size="16" className="me-2 text-primary" />
                                                        Statuts des Offres
                                                    </h6>
                                                    <div className="d-flex flex-wrap gap-2 mb-2 p-3 bg-light rounded-3">
                                                        {offerStatuses.map((s, idx) => (
                                                            <Badge key={idx} bg="white" text="dark" className="border px-3 py-2">
                                                                {s}
                                                            </Badge>
                                                        ))}
                                                        <Button variant="link" size="sm" className="p-0 ms-2" onClick={() => addType(offerStatuses, setOfferStatuses, "Statut")}>Gérer</Button>
                                                    </div>
                                                </Col>
                                                <Col md={4}>
                                                    <h6 className="fw-bold mb-3 d-flex align-items-center">
                                                        <FeatherIcon icon="tag" size="16" className="me-2 text-primary" />
                                                        Types d'Offres
                                                    </h6>
                                                    <div className="d-flex flex-wrap gap-2 mb-2 p-3 bg-light rounded-3">
                                                        {offerTypes.map((t, idx) => (
                                                            <Badge key={idx} bg="white" text="dark" className="border px-3 py-2">
                                                                {t}
                                                            </Badge>
                                                        ))}
                                                        <Button variant="link" size="sm" className="p-0 ms-2" onClick={() => addType(offerTypes, setOfferTypes, "Type")}>Gérer</Button>
                                                    </div>
                                                </Col>
                                                <Col md={4}>
                                                    <h6 className="fw-bold mb-3 d-flex align-items-center">
                                                        <FeatherIcon icon="shopping-bag" size="16" className="me-2 text-primary" />
                                                        Statuts des Ordres
                                                    </h6>
                                                    <div className="d-flex flex-wrap gap-2 mb-2 p-3 bg-light rounded-3">
                                                        {orderStatuses.map((s, idx) => (
                                                            <Badge key={idx} bg="white" text="dark" className="border px-3 py-2">
                                                                {s}
                                                            </Badge>
                                                        ))}
                                                        <Button variant="link" size="sm" className="p-0 ms-2" onClick={() => addType(orderStatuses, setOrderStatuses, "Statut")}>Gérer</Button>
                                                    </div>
                                                </Col>
                                            </Row>

                                            <hr className="my-4" />

                                            <h6 className="fw-bold mb-3 d-flex align-items-center">
                                                <FeatherIcon icon="refresh-cw" size="16" className="me-2 text-primary" />
                                                Paramétrage des Workflows
                                            </h6>
                                            <div className="p-3 bg-light rounded-3">
                                                <Form.Check
                                                    type="switch"
                                                    id="auto-invoice"
                                                    label="Génération automatique de facture (Offre -> Ordre -> Facture)"
                                                    checked={workflow.autoInvoice}
                                                    onChange={(e) => setWorkflow({ ...workflow, autoInvoice: e.target.checked })}
                                                    className="mb-3"
                                                />
                                                <Form.Check
                                                    type="switch"
                                                    id="auto-order"
                                                    label="Conversion immédiate des offres acceptées en commandes"
                                                    checked={workflow.autoConvert}
                                                    onChange={(e) => setWorkflow({ ...workflow, autoConvert: e.target.checked })}
                                                    className="mb-3"
                                                />
                                                <Form.Check
                                                    type="switch"
                                                    id="strict-roles"
                                                    label="Activer le contrôle strict des autorisations par rôles"
                                                    defaultChecked
                                                />
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Tab.Pane>
                            )}

                            {/* BACKUP TAB */}
                            {(user?.role?.name === 'Admin' || user?.role === 'Admin') && (
                                <Tab.Pane eventKey="backup">
                                    <Card className="border-0 shadow-sm mb-4">
                                        <Card.Header className="bg-white py-3 fw-bold">Sauvegarde & Restauration</Card.Header>
                                        <Card.Body>
                                            <div className="mb-4">
                                                <h6 className="fw-bold mb-3">Sauvegarde Automatique</h6>
                                                <Form.Check
                                                    type="switch"
                                                    id="auto-backup"
                                                    label="Activer la sauvegarde automatique quotidienne"
                                                    checked={backupConfig.autoBackup}
                                                    onChange={e => setBackupConfig({ ...backupConfig, autoBackup: e.target.checked })}
                                                    className="mb-2"
                                                />
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Heure de sauvegarde</Form.Label>
                                                    <Form.Control type="time" value={backupConfig.time} onChange={e => setBackupConfig({ ...backupConfig, time: e.target.value })} style={{ maxWidth: '200px' }} />
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Conservation des sauvegardes (jours)</Form.Label>
                                                    <Form.Control type="number" value={backupConfig.retentionDays} onChange={e => setBackupConfig({ ...backupConfig, retentionDays: e.target.value })} style={{ maxWidth: '200px' }} />
                                                </Form.Group>
                                                <Button variant="primary" size="sm" onClick={() => handleSaveSection({ backupConfig }, 'Sauvegarde')}>Enregistrer Paramètres Sauvegarde</Button>
                                            </div>
                                            <hr />
                                            <div className="mb-4">
                                                <h6 className="fw-bold mb-3">Sauvegarde Manuelle</h6>
                                                <p className="text-muted">Dernière sauvegarde : <strong>01/02/2026 02:00</strong></p>
                                                <Button variant="primary" className="me-2">
                                                    <FeatherIcon icon="download" size="16" className="me-2" />
                                                    Télécharger une sauvegarde
                                                </Button>
                                                <Button variant="outline-secondary">
                                                    <FeatherIcon icon="upload" size="16" className="me-2" />
                                                    Restaurer
                                                </Button>
                                            </div>
                                            <hr />
                                            <div>
                                                <h6 className="fw-bold mb-3 text-danger">Zone Dangereuse</h6>
                                                <Button variant="outline-danger">
                                                    <FeatherIcon icon="trash-2" size="16" className="me-2" />
                                                    Réinitialiser toutes les données
                                                </Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Tab.Pane>
                            )}
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        </Container>
    );
};

export default Settings;
