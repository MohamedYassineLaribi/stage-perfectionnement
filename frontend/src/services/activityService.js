import api from './api';

const getAll = async () => {
    const response = await api.get('/activities');
    return response.data;
};

const getById = async (id) => {
    const response = await api.get(`/activities/${id}`);
    return response.data;
};

const create = async (data) => {
    const response = await api.post('/activities', data);
    return response.data;
};

const update = async (id, data) => {
    const response = await api.put(`/activities/${id}`, data);
    return response.data;
};

const remove = async (id) => {
    const response = await api.delete(`/activities/${id}`);
    return response.data;
};

const activityService = {
    getAll,
    getById,
    create,
    update,
    remove
};

export default activityService;
