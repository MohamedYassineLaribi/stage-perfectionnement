import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingSpinner = ({ fullScreen = true }) => {
    if (fullScreen) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100 bg-white">
                <Spinner animation="border" role="status" variant="primary" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Chargement...</span>
                </Spinner>
            </div>
        );
    }

    return (
        <div className="d-flex justify-content-center p-5">
            <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Chargement...</span>
            </Spinner>
        </div>
    );
};

export default LoadingSpinner;
