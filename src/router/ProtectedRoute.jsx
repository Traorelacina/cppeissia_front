import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { CircularProgress, Box } from '@mui/material'

export default function ProtectedRoute({ children, roles = [] }) {
  const { user, initialLoading } = useAuth()
  const location = useLocation()

  console.log('🛡️  [PROTECTED ROUTE]', location.pathname, '| initialLoading:', initialLoading, '| user:', user)

  if (initialLoading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: '#1B7A3E' }} />
      </Box>
    )
  }

  if (!user) {
    console.log('🛡️  [PROTECTED ROUTE] user null → redirect /admin/login')
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  if (roles.length > 0 && !roles.some((r) => user.roles?.includes(r))) {
    console.log('🛡️  [PROTECTED ROUTE] rôle insuffisant → redirect /admin/dashboard')
    return <Navigate to="/admin/dashboard" replace />
  }

  return children
}