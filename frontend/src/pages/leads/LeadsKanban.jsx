import React from 'react';
import { Row, Col, Card, Badge } from 'react-bootstrap';
import FeatherIcon from 'feather-icons-react';

const LeadsKanban = ({ leads, onStatusChange, onEdit, onView }) => {
    const statuses = [
        { key: 'New', label: 'Nouveau', color: 'primary' },
        { key: 'Contacted', label: 'Contacté', color: 'info' },
        { key: 'Qualified', label: 'Qualifié', color: 'success' },
        { key: 'Lost', label: 'Perdu', color: 'danger' },
        { key: 'Converted', label: 'Converti', color: 'secondary' }
    ];

    const onDragStart = (e, leadId) => {
        e.dataTransfer.setData("leadId", leadId);
    };

    const onDragOver = (e) => {
        e.preventDefault();
    };

    const onDrop = (e, status) => {
        const leadId = e.dataTransfer.getData("leadId");
        onStatusChange(leadId, status);
    };

    return (
        <Row className="g-3 overflow-auto flex-nowrap pb-4" style={{ minHeight: 'calc(100vh - 250px)' }}>
            {statuses.map(status => (
                <Col key={status.key} style={{ minWidth: '300px', maxWidth: '300px' }}>
                    <div
                        className="kanban-column"
                        onDragOver={onDragOver}
                        onDrop={(e) => onDrop(e, status.key)}
                    >
                        <div className="d-flex justify-content-between align-items-center mb-3 px-2">
                            <h6 className="fw-bold mb-0 d-flex align-items-center">
                                <span className={`badge bg-${status.color} rounded-circle p-1 me-2`} style={{ width: '8px', height: '8px', display: 'inline-block' }}></span>
                                {status.label}
                                <Badge bg="light" text="dark" className="ms-2 opacity-50">{leads.filter(l => l.status === status.key).length}</Badge>
                            </h6>
                            <FeatherIcon icon="more-horizontal" size="16" className="text-muted cursor-pointer" />
                        </div>

                        <div className="kanban-cards-container d-flex flex-column gap-3 p-2 bg-light bg-opacity-25 rounded-4" style={{ minHeight: '500px' }}>
                            {leads.filter(l => l.status === status.key).map(lead => (
                                <Card
                                    key={lead._id}
                                    className="border-0 shadow-sm rounded-4 cursor-grab transition-all hover-shadow"
                                    draggable
                                    onDragStart={(e) => onDragStart(e, lead._id)}
                                    style={{ transition: 'all 0.2s' }}
                                >
                                    <Card.Body className="p-3">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <h6 className="fw-bold mb-0 fs-14">{lead.name}</h6>
                                            <div className="dropdown">
                                                <FeatherIcon
                                                    icon="edit-2"
                                                    size="12"
                                                    className="text-muted cursor-pointer hover-primary"
                                                    onClick={() => onEdit(lead)}
                                                />
                                            </div>
                                        </div>
                                        <div className="text-muted small mb-3">{lead.company || 'Sans entreprise'}</div>

                                        <div className="d-flex justify-content-between align-items-center mt-auto">
                                            <div className="d-flex align-items-center">
                                                <Badge bg="white" text="muted" className="border small fw-normal py-1 px-2">
                                                    {lead.source || 'Web'}
                                                </Badge>
                                            </div>
                                            <div className="avatar-group d-flex">
                                                <div className="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center border border-white" style={{ width: '24px', height: '24px', fontSize: '10px' }}>
                                                    {lead.name.charAt(0)}
                                                </div>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            ))}
                        </div>
                    </div>
                </Col>
            ))}
        </Row>
    );
};

export default LeadsKanban;
