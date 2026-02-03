import api from './api';

const getAll = async () => {
    const response = await api.get('/contacts');
    return response.data;
};

const getById = async (id) => {
    const response = await api.get(`/contacts/${id}`);
    return response.data;
};

const create = async (data) => {
    const response = await api.post('/contacts', data);
    return response.data;
};

const update = async (id, data) => {
    const response = await api.put(`/contacts/${id}`, data);
    return response.data;
};

const deleteContact = async (id) => {
    const response = await api.delete(`/contacts/${id}`);
    return response.data;
};

const contactService = {
    getAll,
    getById,
    create,
    update,
    delete: deleteContact
};

export default contactService;
