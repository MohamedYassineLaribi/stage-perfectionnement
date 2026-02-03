import api from './api';

const getAll = async () => {
    const response = await api.get('/articles');
    return response.data;
};

const getById = async (id) => {
    const response = await api.get(`/articles/${id}`);
    return response.data;
};

const createArticle = async (data) => {
    const response = await api.post('/articles', data);
    return response.data;
};

const update = async (id, data) => {
    const response = await api.put(`/articles/${id}`, data);
    return response.data;
};

const deleteArticle = async (id) => {
    const response = await api.delete(`/articles/${id}`);
    return response.data;
};

const articleService = {
    getAll,
    getById,
    create: createArticle,
    update,
    delete: deleteArticle
};

export default articleService;
