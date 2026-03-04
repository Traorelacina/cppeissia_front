// src/api/index.js
import axios from 'axios'

// Déterminer l'URL de base en fonction de l'environnement
const getBaseURL = () => {
  // En production (Netlify), utiliser l'URL complète de Koyeb
  if (import.meta.env.PROD) {
    return 'https://used-edyth-freelence-0891ef2c.koyeb.app/api'
  }
  // En développement, utiliser le proxy ou l'URL de développement
  return import.meta.env.VITE_API_URL || '/api'
}

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
})

// ─────────────────────────────────────────────
// FONCTION DE CORRECTION DES URLS D'IMAGES
// ─────────────────────────────────────────────
const API_BASE_URL = 'https://used-edyth-freelence-0891ef2c.koyeb.app';

const fixImageUrlsInData = (data) => {
  if (!data || typeof data !== 'object') return data;
  
  // Fonction récursive pour parcourir tous les niveaux de l'objet
  const traverse = (obj) => {
    if (!obj || typeof obj !== 'object') return;
    
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      
      // Vérifier si c'est une propriété qui pourrait contenir une URL d'image
      const isImageProperty = 
        key.toLowerCase().includes('photo') ||
        key.toLowerCase().includes('image') ||
        key.toLowerCase().includes('url') ||
        key.toLowerCase().includes('thumb') ||
        key.toLowerCase().includes('cover') ||
        key.toLowerCase().includes('media') ||
        (typeof value === 'string' && value.includes('/storage/'));
      
      if (isImageProperty && typeof value === 'string') {
        // Corriger l'URL si nécessaire
        if (value.includes('localhost') || value.includes('127.0.0.1')) {
          obj[key] = value.replace(/http:\/\/[^\/]+/, API_BASE_URL);
        }
        else if (value.startsWith('/storage')) {
          obj[key] = `${API_BASE_URL}${value}`;
        }
        else if (value.startsWith('http') && !value.includes(API_BASE_URL)) {
          // Si c'est une autre URL http, on garde telle quelle
          console.log('URL externe détectée:', value);
        }
      }
      // Récursion pour les objets et tableaux imbriqués
      else if (typeof value === 'object' && value !== null) {
        traverse(value);
      }
    });
  };
  
  traverse(data);
  return data;
};

// ─────────────────────────────────────────────
// REQUEST — log + injection token
// ─────────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cppe_token')

  console.group(`📤 [API] ${config.method?.toUpperCase()} ${config.url}`)
  console.log('BaseURL:', config.baseURL)
  console.log('Full URL:', `${config.baseURL}${config.url}`)
  console.log('Token présent :', !!token, token ? token.substring(0, 20) + '...' : '(aucun)')
  console.log('Environnement :', import.meta.env.MODE)
  console.groupEnd()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ─────────────────────────────────────────────
// RESPONSE — log + correction URLs images + gestion 401
// ─────────────────────────────────────────────
api.interceptors.response.use(
  (response) => {
    // Corriger les URLs des images dans la réponse
    if (response.data) {
      fixImageUrlsInData(response.data);
    }
    
    console.group(`📥 [API] ${response.status} ${response.config?.method?.toUpperCase()} ${response.config?.url}`)
    console.log('Data :', response.data)
    console.groupEnd()
    return response
  },
  (error) => {
    const status   = error.response?.status
    const url      = error.config?.url || ''
    const method   = error.config?.method?.toUpperCase()
    const isLogin  = url.includes('/auth/login')
    const onLogin  = window.location.pathname.includes('/admin/login')

    console.group(`❌ [API ERROR] ${status} ${method} ${url}`)
    console.log('BaseURL:', error.config?.baseURL)
    console.log('Full URL:', `${error.config?.baseURL}${url}`)
    console.log('Message backend :', error.response?.data?.message)
    console.log('Est requête login  :', isLogin)
    console.log('Sur page /login    :', onLogin)
    console.log('Pathname actuel    :', window.location.pathname)
    console.log('Token localStorage :', !!localStorage.getItem('cppe_token'))
    console.log('Environnement :', import.meta.env.MODE)
    console.log('Réponse complète   :', error.response?.data)
    console.groupEnd()

    // Ne jamais rediriger si c'est la requête de login ou si on est déjà sur /login
    if (status === 401 && !isLogin && !onLogin) {
      console.warn('🚨 [AUTH] 401 non-login → purge session + redirect /admin/login')
      localStorage.removeItem('cppe_token')
      localStorage.removeItem('cppe_user')
      window.location.href = '/admin/login'
    }

    return Promise.reject(error)
  }
)

export default api