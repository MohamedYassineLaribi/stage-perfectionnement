import apiClient from './apiClient'

export const leadService = {
    getAll: (params = {}) => {
        return apiClient.get('/leads', { params })
    },

    getById: (id) => {
        return apiClient.get(`/leads/${id}`)
    },

    create: (data) => {
        return apiClient.post('/leads', data)
    },

    update: (id, data) => {
        return apiClient.put(`/leads/${id}`, data)
    },

    delete: (id) => {
        return apiClient.delete(`/leads/${id}`)
    },

    convertToCustomer: (id) => {
        return apiClient.post(`/leads/${id}/convert`)
    },
}
