import React from 'react';
import { Card } from 'react-bootstrap';
import FeatherIcon from 'feather-icons-react';

const ActivityTimeline = ({ activities = [] }) => {
    // Dummy data if none provided
    const timeline = activities.length > 0 ? activities : [
        { id: 1, type: 'status', label: 'Statut mis à jour : Qualifié', date: 'il y a 2 heures', icon: 'zap', color: 'success' },
        { id: 2, type: 'note', label: 'Appel téléphonique : Client très intéressé par le pack Pro.', date: 'Hier à 14:20', icon: 'phone', color: 'primary' },
        { id: 3, type: 'document', label: 'Nouveau document : Devis_V1.pdf envoyé', date: '01 Fév 2024', icon: 'file-text', color: 'info' },
        { id: 4, type: 'creation', label: 'Lead créé depuis le site Web', date: '28 Jan 2024', icon: 'plus-circle', color: 'warning' }
    ];

    return (
        <Card className="border-0 shadow-sm rounded-4">
            <Card.Header className="bg-transparent border-0 py-3">
                <h6 className="fw-bold mb-0">Historique des Activités</h6>
            </Card.Header>
            <Card.Body className="pt-0">
                <div className="timeline-container position-relative ps-4">
                    <div className="timeline-line position-absolute top-0 start-0 h-100 border-start opacity-25" style={{ left: '9px' }}></div>
                    {timeline.map((item, idx) => (
                        <div key={item.id || idx} className="timeline-item position-relative mb-4">
                            <div
                                className={`timeline-icon position-absolute rounded-circle bg-${item.color} text-white d-flex align-items-center justify-content-center border border-white border-2 shadow-sm`}
                                style={{
                                    left: '-23px',
                                    width: '24px',
                                    height: '24px',
                                    zIndex: 1,
                                    fontSize: '10px'
                                }}
                            >
                                <FeatherIcon icon={item.icon} size="10" />
                            </div>
                            <div className="ps-2">
                                <p className="mb-0 fw-bold small text-dark">{item.label}</p>
                                <p className="text-muted smaller mb-0">{item.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Card.Body>
        </Card>
    );
};

export default ActivityTimeline;
