import React from 'react';
import { Card } from 'react-bootstrap';

const PlaceholderPage = ({ title }) => {
    return (
        <div>
            <h3 className="fw-bold mb-4">{title}</h3>
            <Card className="border-0 shadow-sm">
                <Card.Body>
                    <p className="text-muted">Module {title} en cours de construction...</p>
                </Card.Body>
            </Card>
        </div>
    );
};

export default PlaceholderPage;
