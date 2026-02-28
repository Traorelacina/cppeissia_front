import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { authApi } from '@/api/services'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // ⚠️ CLÉ DU FIX : on attend de savoir si l'user est connecté avant de rendre les routes
  const [initialLoading, setInitialLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const justLoggedIn = useRef(false)

  // ─────────────────────────────────────────────
  // Au montage : restaure la session
  // ─────────────────────────────────────────────
  useEffect(() => {
    const token     = localStorage.getItem('cppe_token')
    const savedUser = localStorage.getItem('cppe_user')

    console.log('🔍 [AUTH INIT] token     :', token ? token.substring(0, 20) + '...' : 'aucun')
    console.log('🔍 [AUTH INIT] savedUser :', savedUser ? JSON.parse(savedUser) : null)

    if (!token) {
      console.log('🔍 [AUTH INIT] Pas de token → initialLoading = false')
      setInitialLoading(false)
      return
    }

    // Restaure depuis localStorage immédiatement pour éviter le flash blanc
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }

    // Valide le token côté serveur
    authApi.me()
      .then(({ data }) => {
        const userData = data?.data?.user || data?.data
        console.log('✅ [AUTH INIT] /auth/me OK :', userData)
        setUser(userData)
        localStorage.setItem('cppe_user', JSON.stringify(userData))
      })
      .catch((err) => {
        console.warn('⚠️ [AUTH INIT] /auth/me échoué :', err.response?.status)
        if (err.response?.status === 401) {
          localStorage.removeItem('cppe_token')
          localStorage.removeItem('cppe_user')
          setUser(null)
        }
      })
      .finally(() => {
        setInitialLoading(false)
        console.log('🔍 [AUTH INIT] initialLoading = false')
      })
  }, [])

  // ─────────────────────────────────────────────
  // LOGIN
  // ─────────────────────────────────────────────
  const login = useCallback(async (credentials) => {
    setLoading(true)
    console.group('🔐 [LOGIN] Tentative...')
    console.log('Email :', credentials.email)

    try {
      const { data } = await authApi.login(credentials)
      console.log('📦 [LOGIN] Réponse brute :', data)

      const userData = data?.data?.user
      const token    = data?.data?.token

      console.log('👤 [LOGIN] userData :', userData)
      console.log('🎟️  [LOGIN] token    :', token ? token.substring(0, 20) + '...' : '❌ ABSENT — mauvaise structure ?')

      if (!token) {
        console.error('❌ [LOGIN] Structure reçue :', JSON.stringify(data))
        return { success: false, message: 'Erreur serveur : token manquant.' }
      }

      justLoggedIn.current = true
      setTimeout(() => { justLoggedIn.current = false }, 5000)

      localStorage.setItem('cppe_token', token)
      localStorage.setItem('cppe_user', JSON.stringify(userData))
      setUser(userData)

      console.log('✅ [LOGIN] user défini :', userData)
      console.log('✅ [LOGIN] localStorage token :', localStorage.getItem('cppe_token')?.substring(0, 20))
      console.groupEnd()
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Identifiants incorrects.'
      console.error('❌ [LOGIN] Erreur', error.response?.status, ':', message)
      console.error('❌ [LOGIN] Réponse complète :', error.response?.data)
      console.groupEnd()
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }, [])

  // ─────────────────────────────────────────────
  // LOGOUT
  // ─────────────────────────────────────────────
  const logout = useCallback(async () => {
    console.log('🚪 [LOGOUT] Déconnexion...')
    try { await authApi.logout() } catch (_) {}
    localStorage.removeItem('cppe_token')
    localStorage.removeItem('cppe_user')
    setUser(null)
    console.log('✅ [LOGOUT] Session effacée')
  }, [])

  const hasRole = useCallback((role) => {
    if (!user) return false
    if (Array.isArray(role)) return role.some((r) => user.roles?.includes(r))
    return user.roles?.includes(role)
  }, [user])

  const hasPermission = useCallback((permission) => {
    if (!user) return false
    return user.permissions?.includes(permission)
  }, [user])

  const isSuperAdmin = useCallback(() => hasRole('super-admin'), [hasRole])
  const isDirecteur  = useCallback(() => hasRole(['super-admin', 'directeur']), [hasRole])

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      initialLoading,
      login,
      logout,
      hasRole,
      hasPermission,
      isSuperAdmin,
      isDirecteur,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// ⚠️ Export nommé séparé obligatoire pour Vite Fast Refresh
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}