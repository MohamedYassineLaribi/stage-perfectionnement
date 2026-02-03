import api from './api';

const getAll = async () => {
    const response = await api.get('/offers');
    return response.data;
};

const getById = async (id) => {
    const response = await api.get(`/offers/${id}`);
    return response.data;
};

const create = async (data) => {
    const response = await api.post('/offers', data);
    return response.data;
};

const update = async (id, data) => {
    const response = await api.put(`/offers/${id}`, data);
    return response.data;
};

const remove = async (id) => {
    const response = await api.delete(`/offers/${id}`);
    return response.data;
};

const convert = async (id) => {
    const response = await api.post(`/offers/${id}/convert`);
    return response.data;
};

const offerService = {
    getAll,
    getById,
    create,
    update,
    remove,
    convert
};

export default offerService;
