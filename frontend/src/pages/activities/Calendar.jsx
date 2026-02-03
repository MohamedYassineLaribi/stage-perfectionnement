import React, { useState } from 'react';
import { Container, Card, Row, Col, Button, Badge } from 'react-bootstrap';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import FeatherIcon from 'feather-icons-react';
import PageHeader from '../../components/PageHeader';

const Calendar = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    const renderHeader = () => {
        return (
            <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-white rounded shadow-sm">
                <div className="d-flex align-items-center">
                    <Button variant="outline-primary" size="sm" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="me-2 rounded-circle p-2 d-flex align-items-center">
                        <FeatherIcon icon="chevron-left" size="18" />
                    </Button>
                    <h4 className="mb-0 fw-bold text-capitalize mx-3" style={{ minWidth: '180px', textAlign: 'center' }}>
                        {format(currentMonth, 'MMMM yyyy', { locale: fr })}
                    </h4>
                    <Button variant="outline-primary" size="sm" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="rounded-circle p-2 d-flex align-items-center">
                        <FeatherIcon icon="chevron-right" size="18" />
                    </Button>
                </div>
                <div className="d-flex gap-2">
                    <Button variant="outline-secondary" size="sm" onClick={() => setCurrentMonth(new Date())}>Aujourd'hui</Button>
                    <Button variant="primary" size="sm">
                        <FeatherIcon icon="plus" size="16" className="me-2" />
                        Nouvelle Activité
                    </Button>
                </div>
            </div>
        );
    };

    const renderDays = () => {
        const days = [];
        const date = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
        for (let i = 0; i < 7; i++) {
            days.push(
                <div className="col text-center py-2 fw-bold text-muted small text-uppercase" key={i} style={{ letterSpacing: '1px' }}>
                    {date[i]}
                </div>
            );
        }
        return <div className="row g-0 border-bottom bg-light bg-opacity-50">{days}</div>;
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const rows = [];
        let days = [];
        let day = startDate;
        let formattedDate = "";

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, "d");
                const cloneDay = day;
                days.push(
                    <div
                        className={`col border-end border-bottom p-0 d-flex flex-column bg-white transition-all hover-bg-light ${!isSameMonth(day, monthStart)
                                ? "text-muted opacity-25"
                                : isSameDay(day, selectedDate) ? "bg-primary bg-opacity-10" : ""
                            }`}
                        key={day.toString()}
                        style={{ minHeight: '120px', cursor: 'pointer' }}
                        onClick={() => setSelectedDate(cloneDay)}
                    >
                        <div className="p-2 d-flex justify-content-between align-items-start">
                            <span className={`fw-bold small rounded-circle d-flex align-items-center justify-content-center ${isSameDay(day, new Date()) ? 'bg-primary text-white' : ''}`} style={{ width: '28px', height: '28px' }}>
                                {formattedDate}
                            </span>
                        </div>
                        <div className="flex-grow-1 px-2 pb-2">
                            {/* Dummy Activities */}
                            {isSameDay(day, addDays(monthStart, 5)) && (
                                <Badge bg="info" className="d-block text-start mb-1 fw-medium py-1 px-2 border-0 shadow-sm" style={{ fontSize: '10px' }}>
                                    Appel Client - Devis #12
                                </Badge>
                            )}
                            {isSameDay(day, addDays(monthStart, 12)) && (
                                <Badge bg="success" className="d-block text-start mb-1 fw-medium py-1 px-2 border-0 shadow-sm" style={{ fontSize: '10px' }}>
                                    Signature Contrat
                                </Badge>
                            )}
                        </div>
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div className="row g-0" key={day.toString()}>
                    {days}
                </div>
            );
            days = [];
        }
        return <div className="calendar-body shadow-sm rounded overflow-hidden border-top border-start">{rows}</div>;
    };

    return (
        <Container fluid>
            <PageHeader title="Calendrier des Activités" breadcrumb={[{ label: 'Calendrier' }]} />

            <div className="calendar-container">
                {renderHeader()}
                <Card className="border-0 shadow-sm overflow-hidden">
                    <Card.Body className="p-0">
                        {renderDays()}
                        {renderCells()}
                    </Card.Body>
                </Card>
            </div>

            <style jsx>{`
                .hover-bg-light:hover {
                    background-color: rgba(248, 249, 250, 1) !important;
                }
                .transition-all {
                    transition: all 0.2s ease-in-out;
                }
            `}</style>
        </Container>
    );
};

export default Calendar;
