import { NavLink } from 'react-router-dom'
import { Box, Drawer, Divider, Tooltip } from '@mui/material'
import {
  LayoutDashboard,
  Newspaper,
  Image,
  ClipboardList,
  MessageSquare,
  CalendarDays,
  Users,
  Settings,
  Drama,
  BookOpen,
  Lock,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export const DRAWER_WIDTH = 240

const MENU = [
  {
    section: 'Tableau de bord',
    items: [
      { label: 'Vue générale', href: '/admin/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    section: 'Contenu du site',
    items: [
      { label: 'Flash Infos',    href: '/admin/actualites', icon: Newspaper },
      { label: 'Activités',      href: '/admin/activites',  icon: Drama },
      { label: 'Galerie Médias', href: '/admin/galerie',    icon: Image },
      { label: 'Calendrier',     href: '/admin/calendrier', icon: CalendarDays },
    ],
  },
  {
    section: 'Gestion',
    items: [
      { label: 'Inscriptions', href: '/admin/inscriptions', icon: ClipboardList },
      { label: 'Messages',     href: '/admin/messages',           icon: MessageSquare },
    ],
  },
  {
    section: 'Administration',
    items: [
      { label: 'Utilisateurs & Rôles', href: '/admin/utilisateurs', icon: Users, superAdmin: true },
      { label: 'Paramètres',           href: '/admin/parametres',   icon: Settings },
    ],
  },
]

function SidebarContent() {
  const { user, isSuperAdmin } = useAuth()

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* ── Logo ── */}
      <Box sx={{ p: 2.5, pb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 34,
              height: 34,
              background: '#F5A623',
              borderRadius: '9px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <BookOpen size={17} color="#0f4a25" strokeWidth={2.5} />
          </Box>
          <Box>
            <Box sx={{ color: '#fff', fontWeight: 800, fontSize: 13.5, lineHeight: 1 }}>
              CPPE Admin
            </Box>
            <Box sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 9.5, mt: 0.3 }}>
              Panneau d'administration
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ── Profil utilisateur ── */}
      <Box
        sx={{
          mx: 1.5,
          mb: 2,
          p: 1.5,
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '10px',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#F5A623',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: 13,
              color: '#0f4a25',
              flexShrink: 0,
            }}
          >
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </Box>
          <Box>
            <Box
              sx={{
                color: 'rgba(255,255,255,0.85)',
                fontWeight: 600,
                fontSize: 12.5,
                lineHeight: 1.2,
              }}
            >
              {user?.name || 'Utilisateur'}
            </Box>
            <Box
              sx={{
                display: 'inline-block',
                mt: 0.4,
                px: 1,
                py: 0.2,
                borderRadius: '4px',
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.5px',
                ...(isSuperAdmin?.()
                  ? { background: 'rgba(27,122,62,0.3)', color: '#4ade80' }
                  : { background: 'rgba(245,166,35,0.2)', color: '#F5A623' }),
              }}
            >
              {user?.roles?.[0]?.toUpperCase() || 'UTILISATEUR'}
            </Box>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mx: 2, mb: 1 }} />

      {/* ── Navigation ── */}
      <Box sx={{ flex: 1, overflowY: 'auto', pb: 2 }}>
        {MENU.map((group) => (
          <Box key={group.section} sx={{ mb: 1 }}>
            <Box
              sx={{
                px: 2,
                py: 0.75,
                fontSize: 9,
                fontWeight: 700,
                color: 'rgba(255,255,255,0.2)',
                letterSpacing: '2px',
                textTransform: 'uppercase',
              }}
            >
              {group.section}
            </Box>

            {group.items.map((item) => {
              const isLocked = item.superAdmin && !isSuperAdmin?.()
              const Icon = item.icon

              if (isLocked) {
                return (
                  <Tooltip key={item.href} title="Accès Super Admin uniquement" placement="right">
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        px: 2,
                        py: 1.1,
                        fontSize: 12.5,
                        color: 'rgba(255,255,255,0.2)',
                        cursor: 'not-allowed',
                        mr: 1,
                      }}
                    >
                      <Lock size={14} />
                      <span>{item.label}</span>
                    </Box>
                  </Tooltip>
                )
              }

              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  end
                  className={({ isActive }) =>
                    `admin-sidebar-item${isActive ? ' active' : ''}`
                  }
                >
                  <Icon size={15} strokeWidth={2} />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default function AdminSidebar({ mobileOpen, onMobileClose }) {
  const drawerStyles = {
    width: DRAWER_WIDTH,
    '& .MuiDrawer-paper': {
      width: DRAWER_WIDTH,
      background: '#0f1f14',
      boxSizing: 'border-box',
      border: 'none',
    },
  }

  return (
    <>
      {/* Desktop — permanent */}
      <Drawer
        variant="permanent"
        sx={{ ...drawerStyles, display: { xs: 'none', md: 'block' }, flexShrink: 0 }}
      >
        <SidebarContent />
      </Drawer>

      {/* Mobile — temporaire */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{ ...drawerStyles, display: { xs: 'block', md: 'none' } }}
      >
        <SidebarContent />
      </Drawer>
    </>
  )
}