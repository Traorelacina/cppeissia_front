import { Outlet } from 'react-router-dom'
import { Box } from '@mui/material'
import PublicHeader from '@/components/Publicheader'
import PublicFooter from '@/components/Publicfooter'

export default function PublicLayout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <PublicHeader />
      <Box component="main" sx={{ flex: 1, pt: '64px' }}>
        <Outlet />
      </Box>
      <PublicFooter />
    </Box>
  )
}