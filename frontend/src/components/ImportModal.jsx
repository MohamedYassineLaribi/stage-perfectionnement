import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import FeatherIcon from 'feather-icons-react';

const ImportModal = ({ show, onHide, onImport, title = "Importer des données" }) => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setError('');
    };

    const handleImport = () => {
        if (!file) {
            setError('Veuillez sélectionner un fichier CSV.');
            return;
        }
        if (!file.name.endsWith('.csv')) {
            setError('Seuls les fichiers .csv sont acceptés.');
            return;
        }

        // In a real app, we'd parse this here or send to backend
        // For now, we simulate success
        onImport(file);
        setFile(null);
        onHide();
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton className="border-0">
                <Modal.Title className="fw-bold">{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="py-4 text-center">
                <div className="mb-4">
                    <div className="p-4 rounded-circle bg-primary bg-opacity-10 d-inline-flex mx-auto mb-3">
                        <FeatherIcon icon="file-plus" size="32" className="text-primary" />
                    </div>
                    <p className="text-muted small">Sélectionnez un fichier CSV structuré avec les colonnes correspondantes (Nom, Email, Entreprise).</p>
                    <a href="#" className="small text-decoration-none fw-bold" onClick={(e) => { e.preventDefault(); alert('Téléchargement du modèle template.csv (simulation)'); }}>
                        <FeatherIcon icon="download" size="12" className="me-1" />
                        Télécharger le modèle (.csv)
                    </a>
                </div>

                {error && <Alert variant="danger" className="text-start py-2 small">{error}</Alert>}

                <Form.Group className="mb-3 text-start">
                    <Form.Label className="small fw-bold">Fichier CSV</Form.Label>
                    <Form.Control type="file" accept=".csv" onChange={handleFileChange} className="rounded-3" />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer className="border-0">
                <Button variant="light" onClick={onHide} className="rounded-pill px-4">Annuler</Button>
                <Button variant="primary" onClick={handleImport} className="rounded-pill px-4">Lancer l'import</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ImportModal;
