import api from './api';

const getAll = async () => {
    const response = await api.get('/orders');
    return response.data;
};

const getById = async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
};

const deleteOrder = async (id) => {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
};

const updateStatus = async (id, status) => {
    const response = await api.put(`/orders/${id}/status`, { status });
    return response.data;
};

const orderService = {
    getAll,
    getById,
    delete: deleteOrder,
    updateStatus
};

export default orderService;
