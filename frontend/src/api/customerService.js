import apiClient from './apiClient'

export const customerService = {
    getAll: (params = {}) => {
        return apiClient.get('/customers', { params })
    },

    getById: (id) => {
        return apiClient.get(`/customers/${id}`)
    },

    create: (data) => {
        return apiClient.post('/customers', data)
    },

    update: (id, data) => {
        return apiClient.put(`/customers/${id}`, data)
    },

    delete: (id) => {
        return apiClient.delete(`/customers/${id}`)
    },

    search: (query) => {
        return apiClient.get('/customers/search', { params: { q: query } })
    },
}
