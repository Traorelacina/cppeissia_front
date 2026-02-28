import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Box } from '@mui/material'
import AdminSidebar, { DRAWER_WIDTH } from '../../components/Adminsidebar'
import AdminHeader from '../../components/Adminheader'

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#f4f7f5' }}>

      {/* ── Sidebar (gère elle-même desktop/mobile) ── */}
      <AdminSidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* ── Zone principale ──
            • flex:1 + minWidth:0  → prend tout l'espace disponible sans déborder
            • width calc()         → force la bonne largeur sur desktop
            • overflow:hidden      → évite le scroll horizontal parasite
      ── */}
      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
          width: { xs: '100%', md: `calc(100% - ${DRAWER_WIDTH}px)` },
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header sticky (passe onMenuClick pour le burger mobile) */}
        <AdminHeader onMenuClick={() => setMobileOpen(true)} />

        {/* Contenu de la page */}
        <Box sx={{ flex: 1, minWidth: 0, p: { xs: 2, md: 3 } }}>
          <Outlet />
        </Box>
      </Box>

    </Box>
  )
}