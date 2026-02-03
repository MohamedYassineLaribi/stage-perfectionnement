import api from './api';

const getAll = async () => {
    const response = await api.get('/leads');
    return response.data;
};

const getById = async (id) => {
    const response = await api.get(`/leads/${id}`);
    return response.data;
};

const create = async (data) => {
    const response = await api.post('/leads', data);
    return response.data;
};

const update = async (id, data) => {
    const response = await api.put(`/leads/${id}`, data);
    return response.data;
};

const deleteLead = async (id) => {
    const response = await api.delete(`/leads/${id}`);
    return response.data;
};

const leadService = {
    getAll,
    getById,
    create,
    update,
    deleteLead
};

export default leadService;
