import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
})

// ─────────────────────────────────────────────
// REQUEST — log + injection token
// ─────────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cppe_token')

  console.group(`📤 [API] ${config.method?.toUpperCase()} ${config.url}`)
  console.log('Token présent :', !!token, token ? token.substring(0, 20) + '...' : '(aucun)')
  console.groupEnd()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ─────────────────────────────────────────────
// RESPONSE — log + gestion 401
// ─────────────────────────────────────────────
api.interceptors.response.use(
  (response) => {
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
    console.log('Message backend :', error.response?.data?.message)
    console.log('Est requête login  :', isLogin)
    console.log('Sur page /login    :', onLogin)
    console.log('Pathname actuel    :', window.location.pathname)
    console.log('Token localStorage :', !!localStorage.getItem('cppe_token'))
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