import React, { useState } from 'react';
import { Table, Button, Badge, Form, Row, Col, InputGroup } from 'react-bootstrap';
import FeatherIcon from 'feather-icons-react';

const DataTable = ({ columns, data, onEdit, onDelete, onView, actions }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Filtering logic
    const filteredData = data.filter(item => {
        return Object.values(item).some(val =>
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const exportToCSV = () => {
        const headers = columns.map(col => col.header).join(',');
        const csvRows = filteredData.map(row =>
            columns.map(col => {
                const val = col.render ? "" : row[col.accessor]; // Simple text export for now
                return `"${String(val).replace(/"/g, '""')}"`;
            }).join(',')
        );
        const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + csvRows.join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "export_data.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="datatable-container">
            <Row className="mb-3 align-items-center">
                <Col md={5}>
                    <InputGroup className="shadow-sm rounded border-0 bg-white">
                        <InputGroup.Text className="bg-white border-0">
                            <FeatherIcon icon="search" size="16" className="text-muted" />
                        </InputGroup.Text>
                        <Form.Control
                            placeholder="Rechercher..."
                            className="border-0 ps-0"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </InputGroup>
                </Col>
                <Col md={7} className="text-md-end d-flex align-items-center justify-content-md-end gap-3 mt-3 mt-md-0">
                    <Button variant="outline-light" size="sm" className="bg-white border text-muted px-3 rounded-pill" onClick={exportToCSV}>
                        <FeatherIcon icon="download" size="14" className="me-2" />
                        Exporter CSV
                    </Button>
                    <span className="text-muted small">
                        {Math.min(indexOfFirstItem + 1, filteredData.length)}-{Math.min(indexOfLastItem, filteredData.length)} sur {filteredData.length}
                    </span>
                </Col>
            </Row>

            <Table hover responsive className="align-middle shadow-sm bg-white rounded overflow-hidden">
                <thead className="bg-light">
                    <tr style={{ borderBottom: '2px solid #f8f9fa' }}>
                        {columns.map((col, index) => (
                            <th key={index} className="py-3 px-4 border-0 fs-11 text-uppercase text-muted fw-bold" style={{ letterSpacing: '0.5px' }}>
                                {col.header}
                            </th>
                        ))}
                        <th className="py-3 px-4 border-0 text-end fs-11 text-uppercase text-muted fw-bold">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length + 1} className="text-center py-5 text-muted">
                                {searchTerm ? "Aucun résultat trouvé pour votre recherche." : "Aucune donnée disponible."}
                            </td>
                        </tr>
                    ) : (
                        currentItems.map((row, rowIndex) => (
                            <tr key={rowIndex} className="border-bottom">
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex} className="py-3 px-4">
                                        {col.render ? col.render(row) : row[col.accessor]}
                                    </td>
                                ))}
                                <td className="text-end px-4">
                                    <div className="d-flex justify-content-end gap-1">
                                        {onView && (
                                            <Button variant="link" size="sm" className="btn-icon text-info" onClick={() => onView(row)} title="Voir">
                                                <FeatherIcon icon="eye" size="16" />
                                            </Button>
                                        )}
                                        {onEdit && (
                                            <Button variant="link" size="sm" className="btn-icon text-primary" onClick={() => onEdit(row)} title="Modifier">
                                                <FeatherIcon icon="edit-2" size="16" />
                                            </Button>
                                        )}
                                        {onDelete && (
                                            <Button variant="link" size="sm" className="btn-icon text-danger" onClick={() => onDelete(row)} title="Supprimer">
                                                <FeatherIcon icon="trash-2" size="16" />
                                            </Button>
                                        )}
                                        {actions && actions(row)}
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>

            {totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-3">
                    <Button
                        variant="light"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                    >
                        Précédent
                    </Button>
                    <div className="text-muted small">
                        Page {currentPage} sur {totalPages}
                    </div>
                    <Button
                        variant="light"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                    >
                        Suivant
                    </Button>
                </div>
            )}
        </div>
    );
};

export default DataTable;
