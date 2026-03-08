import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Box,
  useScrollTrigger,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import {
  Menu,
  X,
  ChevronDown,
  BookOpen,
  Home,
  Users,
  Info,
  Calendar,
  Phone,
  Layers,
  User,
} from 'lucide-react'
import { useQuery } from "@tanstack/react-query";
import { parametresApi } from '@/api/services'
import logo from '../assets/logo.jpeg'

// COULEUR ORANGE DU MINISTÈRE
const ORANGE     = '#FF7F27'
// Fond crème orangé (Petite Section)
const BG_CREAM   = '#fff8ee'
const BG_BORDER  = '#ffe082'
// Texte sombre sur fond clair
const TEXT_DARK  = '#5a3a00'
const TEXT_MID   = '#9a6a20'
const TEXT_MUTED = 'rgba(90,58,0,0.48)'

const NAV_ITEMS = [
  { label: 'Accueil',      href: '/',            icon: Home },
  { label: 'Présentation', href: '/presentation', icon: Info },
  {
    label: 'Sections',
    icon: Layers,
    children: [
      { label: 'Crèche',          href: '/sections/creche' },
      { label: 'Petite Section',  href: '/sections/petite-section' },
      { label: 'Moyenne Section', href: '/sections/moyenne-section' },
      { label: 'Grande Section',  href: '/sections/grande-section' },
    ],
  },
  { label: 'Inscription', href: '/inscription', icon: BookOpen, hidden: true },
  { label: 'Activités',   href: '/activites',   icon: Users },
  { label: 'Calendrier',  href: '/calendrier',  icon: Calendar },
  { label: 'Contact',     href: '/contact',     icon: Phone },
]

export default function PublicHeader() {
  const [mobileOpen,   setMobileOpen]   = useState(false)
  const [sectionsOpen, setSectionsOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const location = useLocation()
  const theme    = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const trigger  = useScrollTrigger({ disableHysteresis: true, threshold: 60 })

  const { data: parametresData } = useQuery({
    queryKey: ['parametres-public'],
    queryFn:  () => parametresApi.getAll(),
    staleTime: 5 * 60 * 1000,
  })

  const params = parametresData?.data?.data || {}

  return (
    <>
      <AppBar
        position="fixed"
        elevation={trigger ? 2 : 0}
        sx={{
          background: trigger
            ? `rgba(255, 248, 238, 0.99)`
            : `linear-gradient(to bottom, rgba(255,248,238,0.98), rgba(255,235,200,0.95))`,
          backdropFilter: 'blur(14px)',
          borderBottom: `1px solid ${trigger ? BG_BORDER : 'rgba(255,224,130,0.5)'}`,
          transition: 'all 0.35s ease',
        }}
      >
        <Toolbar
          sx={{
            px: { xs: 2, md: 5 },
            py: 0,
            minHeight: { xs: '64px !important', md: '76px !important' },
          }}
        >

          {/* ══ LOGO ══ */}
          <Link
            to="/"
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 11, flexShrink: 0 }}
          >
            <Box
              sx={{
                width:  { xs: 44, md: 52 },
                height: { xs: 44, md: 52 },
                borderRadius: '16px',
                overflow: 'hidden',
                border: `2px solid rgba(255,127,39,0.55)`,
                boxShadow: '0 2px 14px rgba(200,120,0,0.18)',
                flexShrink: 0,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'scale(1.04)',
                  boxShadow: `0 4px 20px rgba(255,127,39,0.3)`,
                },
              }}
            >
              <Box
                component="img"
                src={logo}
                alt="Logo CPPE Issia"
                sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </Box>

            {!isMobile && (
              <Box sx={{ lineHeight: 1.2 }}>
                <Box sx={{ fontSize: '13px', fontWeight: 800, color: TEXT_DARK, letterSpacing: '0.2px' }}>
                  CPPE d'Issia
                </Box>
                <Box sx={{ fontSize: '9.5px', color: TEXT_MUTED, letterSpacing: '1px', textTransform: 'uppercase', mt: '1px' }}>
                  Complexe Socio-Éducatif
                </Box>
              </Box>
            )}
          </Link>

          {/* ══ NAV DESKTOP ══ */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'stretch', ml: 4, flex: 1 }}>
              {NAV_ITEMS.map((item) => {
                if (item.hidden) return null

                return item.children ? (
                  <Box
                    key={item.label}
                    sx={{ position: 'relative', display: 'flex', alignItems: 'stretch' }}
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <Button
                      endIcon={
                        <ChevronDown
                          size={13}
                          style={{
                            transition: 'transform 0.2s',
                            transform: dropdownOpen ? 'rotate(180deg)' : 'none',
                          }}
                        />
                      }
                      sx={{
                        color: dropdownOpen ? ORANGE : TEXT_DARK,
                        fontSize: '12.5px',
                        fontWeight: 700,
                        px: 1.75,
                        borderRadius: 0,
                        borderBottom: dropdownOpen ? `2px solid ${ORANGE}` : '2px solid transparent',
                        transition: 'all 0.2s',
                        '&:hover': { color: ORANGE, background: 'rgba(255,127,39,0.06)' },
                      }}
                    >
                      {item.label}
                    </Button>

                    {dropdownOpen && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          background: '#fff8ee',
                          borderRadius: '0 0 14px 14px',
                          overflow: 'hidden',
                          minWidth: 195,
                          boxShadow: '0 16px 40px rgba(180,100,0,0.18)',
                          zIndex: 1000,
                          border: `1px solid ${BG_BORDER}`,
                          borderTop: 'none',
                        }}
                      >
                        {item.children.map((child, idx) => (
                          <NavLink
                            key={child.href}
                            to={child.href}
                            style={({ isActive }) => ({
                              display: 'block',
                              padding: '11px 18px',
                              color: isActive ? ORANGE : TEXT_DARK,
                              fontSize: '12.5px',
                              fontWeight: isActive ? 700 : 500,
                              textDecoration: 'none',
                              borderLeft: isActive ? `3px solid ${ORANGE}` : '3px solid transparent',
                              borderBottom: idx < item.children.length - 1 ? `1px solid ${BG_BORDER}` : 'none',
                              transition: 'all 0.15s',
                              background: isActive ? `rgba(255,127,39,0.08)` : 'transparent',
                            })}
                            onClick={() => setDropdownOpen(false)}
                          >
                            {child.label}
                          </NavLink>
                        ))}
                      </Box>
                    )}
                  </Box>
                ) : (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    style={({ isActive }) => ({
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 13px',
                      color: isActive ? ORANGE : TEXT_DARK,
                      fontSize: '12.5px',
                      fontWeight: 700,
                      textDecoration: 'none',
                      borderBottom: isActive ? `2px solid ${ORANGE}` : '2px solid transparent',
                      transition: 'all 0.2s',
                      whiteSpace: 'nowrap',
                    })}
                  >
                    {item.label}
                  </NavLink>
                )
              })}
            </Box>
          )}

          {/* ══ BOUTON ESPACE PARENT + BURGER MOBILE ══ */}
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
            {!isMobile && (
              <Button
                component={Link}
                to="/espace-parent"
                variant="contained"
                size="small"
                startIcon={<User size={14} />}
                sx={{
                  background: ORANGE,
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '12px',
                  px: 2.25,
                  py: 0.9,
                  borderRadius: '30px',
                  boxShadow: `0 3px 14px rgba(255,127,39,0.3)`,
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                  '&:hover': {
                    background: '#e66e00',
                    transform: 'translateY(-1px)',
                    boxShadow: `0 5px 18px rgba(255,127,39,0.4)`,
                  },
                }}
              >
                Espace parent
              </Button>
            )}

            {isMobile && (
              <IconButton
                onClick={() => setMobileOpen(true)}
                sx={{
                  color: TEXT_DARK,
                  background: 'rgba(255,127,39,0.1)',
                  borderRadius: '10px',
                  '&:hover': { background: 'rgba(255,127,39,0.18)' },
                }}
              >
                <Menu size={22} />
              </IconButton>
            )}
          </Box>

        </Toolbar>
      </AppBar>

      {/* ══ DRAWER MOBILE ══ */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: { width: 285, background: '#fff8ee', color: TEXT_DARK, pt: 1 },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, pb: 2, borderBottom: `1px solid ${BG_BORDER}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 38, height: 38,
                borderRadius: '12px',
                overflow: 'hidden',
                border: `1.5px solid rgba(255,127,39,0.5)`,
              }}
            >
              <Box component="img" src={logo} alt="Logo CPPE Issia" sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </Box>
            <Box>
              <Box sx={{ fontSize: '12.5px', fontWeight: 800, color: TEXT_DARK }}>CPPE d'Issia</Box>
              <Box sx={{ fontSize: '9px', color: TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Complexe Socio-Éducatif</Box>
            </Box>
          </Box>
          <IconButton onClick={() => setMobileOpen(false)} sx={{ color: TEXT_MID, p: 0.75 }}>
            <X size={20} />
          </IconButton>
        </Box>

        <List sx={{ py: 1 }}>
          {NAV_ITEMS.map((item) => {
            if (item.hidden) return null

            return item.children ? (
              <Box key={item.label}>
                <ListItem
                  button
                  onClick={() => setSectionsOpen(!sectionsOpen)}
                  sx={{ color: TEXT_DARK, py: 1.1, px: 2 }}
                >
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ fontSize: 13, fontWeight: 700, color: TEXT_DARK }}
                  />
                  <ChevronDown
                    size={15}
                    style={{ transform: sectionsOpen ? 'rotate(180deg)' : 'none', transition: '0.2s', color: TEXT_MID }}
                  />
                </ListItem>
                <Collapse in={sectionsOpen}>
                  {item.children.map((child) => (
                    <ListItem
                      key={child.href}
                      component={Link}
                      to={child.href}
                      onClick={() => setMobileOpen(false)}
                      sx={{ pl: 4, color: TEXT_MID, py: 0.85, borderLeft: `2px solid ${BG_BORDER}`, ml: 2 }}
                    >
                      <ListItemText primary={child.label} primaryTypographyProps={{ fontSize: 12.5, color: TEXT_MID }} />
                    </ListItem>
                  ))}
                </Collapse>
              </Box>
            ) : (
              <ListItem
                key={item.href}
                component={Link}
                to={item.href}
                onClick={() => setMobileOpen(false)}
                sx={{
                  color: location.pathname === item.href ? ORANGE : TEXT_DARK,
                  borderLeft: location.pathname === item.href ? `3px solid ${ORANGE}` : '3px solid transparent',
                  background: location.pathname === item.href ? `rgba(255,127,39,0.07)` : 'transparent',
                  py: 1.1,
                  transition: 'all 0.15s',
                }}
              >
                <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 13, fontWeight: 700, color: 'inherit' }} />
              </ListItem>
            )
          })}
        </List>

        <Box sx={{ px: 2, pt: 1, pb: 2 }}>
          <Button
            component={Link}
            to="/espace-parent"
            variant="contained"
            fullWidth
            startIcon={<User size={15} />}
            onClick={() => setMobileOpen(false)}
            sx={{
              background: ORANGE,
              color: '#fff',
              fontWeight: 800,
              fontSize: '13px',
              py: 1.25,
              borderRadius: '30px',
              '&:hover': { background: '#e66e00' },
            }}
          >
            Espace parent
          </Button>
        </Box>
      </Drawer>
    </>
  )
}