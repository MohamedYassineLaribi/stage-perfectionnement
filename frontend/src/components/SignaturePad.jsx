import React, { useRef, useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import FeatherIcon from 'feather-icons-react';

const SignaturePad = ({ onSave, onClear }) => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
    }, []);

    const startDrawing = (e) => {
        const { offsetX, offsetY } = getCoordinates(e);
        const ctx = canvasRef.current.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = getCoordinates(e);
        const ctx = canvasRef.current.getContext('2d');
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const getCoordinates = (e) => {
        if (e.type.includes('touch')) {
            const rect = canvasRef.current.getBoundingClientRect();
            return {
                offsetX: e.touches[0].clientX - rect.left,
                offsetY: e.touches[0].clientY - rect.top
            };
        }
        return { offsetX: e.nativeEvent.offsetX, offsetY: e.nativeEvent.offsetY };
    };

    const clear = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (onClear) onClear();
    };

    const save = () => {
        const dataUrl = canvasRef.current.toDataURL();
        onSave(dataUrl);
    };

    return (
        <div className="signature-pad-container">
            <canvas
                ref={canvasRef}
                width={500}
                height={200}
                className="border rounded-4 bg-white cursor-crosshair w-100"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseOut={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                style={{ touchAction: 'none' }}
            />
            <div className="d-flex justify-content-between mt-3">
                <Button variant="light" size="sm" onClick={clear} className="rounded-pill px-3">
                    <FeatherIcon icon="refresh-cw" size="14" className="me-2" />
                    Effacer
                </Button>
                <Button variant="primary" size="sm" onClick={save} className="rounded-pill px-4">
                    <FeatherIcon icon="check" size="14" className="me-2" />
                    Valider la signature
                </Button>
            </div>
        </div>
    );
};

export default SignaturePad;
