import React, { useState } from 'react';
import { Card, Button, ListGroup, Form, ProgressBar } from 'react-bootstrap';
import FeatherIcon from 'feather-icons-react';

const DocumentManager = ({ entityId, entityType }) => {
    const [files, setFiles] = useState([
        { id: 1, name: 'Contrat_Vente.pdf', size: '2.4 MB', date: '2024-02-01', extension: 'pdf' },
        { id: 2, name: 'Devis_Signe.jpg', size: '1.1 MB', date: '2024-01-28', extension: 'jpg' }
    ]);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [filter, setFilter] = useState('');

    const filteredFiles = files.filter(f => f.name.toLowerCase().includes(filter.toLowerCase()));

    const handleUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        let p = 0;
        const interval = setInterval(() => {
            p += 20;
            setProgress(p);
            if (p >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    setFiles([...files, {
                        id: Date.now(),
                        name: file.name,
                        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
                        date: new Date().toISOString().split('T')[0],
                        extension: file.name.split('.').pop()
                    }]);
                    setUploading(false);
                    setProgress(0);
                }, 500);
            }
        }, 200);
    };

    const deleteFile = (id) => {
        setFiles(files.filter(f => f.id !== id));
    };

    const getIcon = (ext) => {
        switch (ext) {
            case 'pdf': return 'file-text';
            case 'jpg':
            case 'png': return 'image';
            default: return 'file';
        }
    };

    return (
        <Card className="border-0 shadow-sm rounded-4">
            <Card.Header className="bg-transparent border-0 d-flex justify-content-between align-items-center py-3">
                <h6 className="fw-bold mb-0">Documents & GED</h6>
                <div className="position-relative">
                    <input
                        type="file"
                        className="position-absolute opacity-0 w-100 h-100 cursor-pointer"
                        onChange={handleUpload}
                        disabled={uploading}
                    />
                    <Button variant="primary" size="sm" disabled={uploading}>
                        <FeatherIcon icon="upload-cloud" size="14" className="me-2" />
                        Transférer
                    </Button>
                </div>
            </Card.Header>
            <Card.Body>
                <div className="mb-4 d-flex align-items-center bg-light rounded-pill px-3 py-1">
                    <FeatherIcon icon="search" size="14" className="text-muted me-2" />
                    <Form.Control
                        type="text"
                        placeholder="Rechercher un document..."
                        className="border-0 bg-transparent shadow-none small"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>

                {uploading && (
                    <div className="mb-4">
                        <div className="d-flex justify-content-between small mb-1">
                            <span>Téléchargement en cours...</span>
                            <span>{progress}%</span>
                        </div>
                        <ProgressBar now={progress} size="sm" variant="primary" animated />
                    </div>
                )}

                {files.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                        <FeatherIcon icon="folder" size="48" className="opacity-25 mb-3" />
                        <p>Aucun document pour le moment.</p>
                    </div>
                ) : (
                    <ListGroup variant="flush">
                        {filteredFiles.map(file => (
                            <ListGroup.Item key={file.id} className="px-0 py-3 border-0 d-flex align-items-center justify-content-between bg-transparent border-bottom-light">
                                <div className="d-flex align-items-center">
                                    <div className="p-2 bg-light rounded-3 text-primary me-3">
                                        <FeatherIcon icon={getIcon(file.extension)} size="20" />
                                    </div>
                                    <div>
                                        <h6 className="mb-0 fw-bold small">{file.name}</h6>
                                        <span className="text-muted smaller">{file.size} • Ajouté le {file.date}</span>
                                    </div>
                                </div>
                                <div className="d-flex gap-2">
                                    <Button variant="light" size="sm" className="p-1 text-muted">
                                        <FeatherIcon icon="download" size="14" />
                                    </Button>
                                    <Button variant="light" size="sm" className="p-1 text-danger" onClick={() => deleteFile(file.id)}>
                                        <FeatherIcon icon="trash-2" size="14" />
                                    </Button>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Card.Body>
        </Card>
    );
};

export default DocumentManager;
