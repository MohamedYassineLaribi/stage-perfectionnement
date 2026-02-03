import apiClient from './apiClient'

export const authService = {
    login: (email, password) => {
        return apiClient.post('/auth/login', { email, password })
    },

    register: (userData) => {
        return apiClient.post('/auth/register', userData)
    },

    logout: () => {
        return apiClient.post('/auth/logout')
    },

    forgotPassword: (email) => {
        return apiClient.post('/auth/forgot-password', { email })
    },

    resetPassword: (token, password) => {
        return apiClient.post('/auth/reset-password', { token, password })
    },

    getCurrentUser: () => {
        return apiClient.get('/auth/me')
    },
}
