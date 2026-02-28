import api from './index'

// ========================
// AUTH
// ========================
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
}

// ========================
// ACTUALITÉS
// ========================
export const actualitesApi = {
  // Public
  getAll: (params) => api.get('/actualites', { params }),
  getOne: (id) => api.get(`/actualites/${id}`),
  // Admin
  adminGetAll: (params) => api.get('/admin/actualites', { params }),
  create: (data) => api.post('/admin/actualites', data),
  update: (id, data) => api.put(`/admin/actualites/${id}`, data),
  delete: (id) => api.delete(`/admin/actualites/${id}`),
  updateStatut: (id, statut) => api.patch(`/admin/actualites/${id}/statut`, { statut }),
}

// ========================
// ACTIVITÉS
// ========================
export const activitesApi = {
  // Public
  getAll: (params) => api.get('/activites', { params }),
  getBySlug: (slug) => api.get(`/activites/${slug}`),
  // Admin
  adminGetAll: (params) => api.get('/admin/activites', { params }),
  create: (data) => api.post('/admin/activites', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, data) => api.post(`/admin/activites/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => api.delete(`/admin/activites/${id}`),
}

// ========================
// INSCRIPTIONS
// ========================
export const inscriptionsApi = {
  // Public
  submit: (data) => api.post('/inscriptions', data),
  // Admin
  getAll: (params) => api.get('/admin/inscriptions', { params }),
  getOne: (id) => api.get(`/admin/inscriptions/${id}`),
  updateStatut: (id, data) => api.patch(`/admin/inscriptions/${id}/statut`, data),
  exportPdf: (id) => api.get(`/admin/inscriptions/${id}/pdf`, { responseType: 'blob' }),
  exportExcel: (params) => api.get('/admin/inscriptions/export/excel', {
    params,
    responseType: 'blob',
  }),
}

// ========================
// MÉDIAS
// ========================
export const mediasApi = {
  getAll: (params) => api.get('/admin/medias', { params }),
  upload: (data) => api.post('/admin/medias', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => api.delete(`/admin/medias/${id}`),
}

// ========================
// MESSAGES
// ========================
export const messagesApi = {
  getAll: (params) => api.get('/admin/messages', { params }),
  getOne: (id) => api.get(`/admin/messages/${id}`),
  marquerLu: (id) => api.patch(`/admin/messages/${id}/lu`),
  delete: (id) => api.delete(`/admin/messages/${id}`),
}

// ========================
// CALENDRIER
// ========================
export const calendrierApi = {
  // Public
  getAll: (params) => api.get('/calendrier', { params }),
  // Admin
  adminGetAll: (params) => api.get('/admin/calendrier', { params }),
  create: (data) => api.post('/admin/calendrier', data),
  update: (id, data) => api.put(`/admin/calendrier/${id}`, data),
  delete: (id) => api.delete(`/admin/calendrier/${id}`),
}

// ========================
// PARAMÈTRES
// ========================
export const parametresApi = {
  // Public
  getAll: () => api.get('/parametres'),
  getOne: (cle) => api.get(`/parametres/${cle}`),
  // Admin
  adminGetAll: () => api.get('/admin/parametres'),
  update: (cle, valeur) => api.put(`/admin/parametres/${cle}`, { valeur }),
}

// ========================
// UTILISATEURS
// ========================
export const usersApi = {
  getAll: () => api.get('/admin/users'),
  create: (data) => api.post('/admin/users', data),
  getOne: (id) => api.get(`/admin/users/${id}`),
  update: (id, data) => api.put(`/admin/users/${id}`, data),
  delete: (id) => api.delete(`/admin/users/${id}`),
  updateRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  resetPassword: (id) => api.post(`/admin/users/${id}/reset-password`),
}

// ========================
// DASHBOARD
// ========================
export const dashboardApi = {
  getStats: () => api.get('/admin/dashboard'),
}