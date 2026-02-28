import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Box,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Badge,
} from '@mui/material'
import { Menu as MenuIcon, Bell, Globe, LogOut, Settings, ChevronDown } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'

export const DRAWER_WIDTH = 240

export default function AdminHeader({ onMenuClick }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null)

  const handleLogout = async () => {
    setAnchorEl(null)
    await logout()
    toast.success('Déconnexion réussie')
    navigate('/admin/login')
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        background: '#fff',
        borderBottom: '1px solid #dae8df',
        px: { xs: 2, md: 3 },
        minHeight: 60,
        position: 'sticky',
        top: 0,
        zIndex: 10,
        flexShrink: 0,
      }}
    >
      {/* HAMBURGER MOBILE */}
      <IconButton
        edge="start"
        onClick={onMenuClick}
        sx={{ mr: 2, display: { md: 'none' }, color: '#2d3a30' }}
      >
        <MenuIcon size={20} />
      </IconButton>

      {/* BREADCRUMB / TITLE */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
          sx={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#1B7A3E',
          }}
        />
        <Typography sx={{ fontWeight: 600, fontSize: 13, color: '#6b7c70' }}>
          Administration CPPE Issia
        </Typography>
      </Box>

      <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
        {/* LIEN SITE PUBLIC */}
        <IconButton
          component={Link}
          to="/"
          target="_blank"
          size="small"
          title="Voir le site public"
          sx={{ color: '#6b7c70', '&:hover': { color: '#1B7A3E' } }}
        >
          <Globe size={18} />
        </IconButton>

        {/* NOTIFICATIONS */}
        <IconButton size="small" sx={{ color: '#6b7c70' }}>
          <Badge
            badgeContent={3}
            color="error"
            sx={{ '& .MuiBadge-badge': { fontSize: 9, height: 14, minWidth: 14 } }}
          >
            <Bell size={18} />
          </Badge>
        </IconButton>

        {/* USER MENU */}
        <Box
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
            px: 1.5,
            py: 0.5,
            borderRadius: '10px',
            border: '1px solid #dae8df',
            ml: 0.5,
            '&:hover': { background: '#f3f7f4' },
          }}
        >
          <Avatar
            sx={{
              width: 28,
              height: 28,
              background: '#F5A623',
              color: '#0f4a25',
              fontWeight: 900,
              fontSize: 12,
            }}
          >
            {user?.name?.[0]?.toUpperCase()}
          </Avatar>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography sx={{ fontWeight: 700, fontSize: 12.5, lineHeight: 1.2 }}>
              {user?.name}
            </Typography>
            <Typography sx={{ fontSize: 10, color: '#6b7c70', lineHeight: 1 }}>
              {user?.roles?.[0]}
            </Typography>
          </Box>
          <ChevronDown size={14} color="#6b7c70" />
        </Box>
      </Box>

      {/* USER DROPDOWN */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            mt: 0.5,
            minWidth: 180,
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            border: '1px solid #dae8df',
            '& .MuiMenuItem-root': { fontSize: 13, py: 1.2, px: 2, gap: 1.5 },
          },
        }}
      >
        <MenuItem onClick={() => { setAnchorEl(null); navigate('/admin/parametres') }}>
          <Settings size={15} color="#6b7c70" />
          Paramètres
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={handleLogout} sx={{ color: '#dc2626' }}>
          <LogOut size={15} color="#dc2626" />
          Se déconnecter
        </MenuItem>
      </Menu>
    </Box>
  )
}