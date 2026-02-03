import api from './api';

const getAll = async () => {
    const response = await api.get('/invoices');
    return response.data;
};

const getById = async (id) => {
    const response = await api.get(`/invoices/${id}`);
    return response.data;
};

const create = async (invoiceData) => {
    const response = await api.post('/invoices', invoiceData);
    return response.data;
};

const downloadPdf = async (id) => {
    const response = await api.get(`/invoices/${id}/pdf`, { responseType: 'blob' });
    return response.data; // Blob
};

const invoiceService = {
    getAll,
    getById,
    create,
    downloadPdf
};

export default invoiceService;
