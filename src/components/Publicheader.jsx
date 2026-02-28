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
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { parametresApi } from '@/api/services'
import logo from '../assets/logo.jpeg'

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
  { label: 'Inscription', href: '/inscription', icon: BookOpen },
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
  const isOpen = params.inscriptions_ouvertes !== 'false'
  const annee  = params.annee_scolaire_courante || '2025-2026'

  return (
    <>
      <AppBar
        position="fixed"
        elevation={trigger ? 3 : 0}
        sx={{
          background: trigger
            ? 'rgba(10, 46, 24, 0.98)'
            : 'linear-gradient(to bottom, rgba(10,46,24,0.97), rgba(15,74,37,0.82))',
          backdropFilter: 'blur(14px)',
          borderBottom: trigger ? 'none' : '1px solid rgba(255,255,255,0.06)',
          transition: 'all 0.35s ease',
        }}
      >
        <Toolbar
          sx={{
            px: { xs: 2, md: 5 },
            py: 0,
            // ── Hauteur augmentée : 72px (au lieu de 64px) ──
            minHeight: { xs: '64px !important', md: '76px !important' },
          }}
        >

          {/* ══ LOGO ══ */}
          <Link
            to="/"
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 11, flexShrink: 0 }}
          >
            {/* Conteneur avec fond blanc léger + border-radius → logo arrondi */}
            <Box
              sx={{
                width:  { xs: 44, md: 52 },
                height: { xs: 44, md: 52 },
                borderRadius: '16px',           // arrondi, pas carré, pas cercle parfait
                overflow: 'hidden',
                border: '2px solid rgba(245,166,35,0.55)',
                boxShadow: '0 2px 14px rgba(0,0,0,0.28)',
                flexShrink: 0,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'scale(1.04)',
                  boxShadow: '0 4px 20px rgba(245,166,35,0.25)',
                },
              }}
            >
              <Box
                component="img"
                src={logo}
                alt="Logo CPPE Issia"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </Box>

            {/* Nom institution à côté du logo — optionnel, visible desktop uniquement */}
            {!isMobile && (
              <Box sx={{ lineHeight: 1.2 }}>
                <Box sx={{ fontSize: '13px', fontWeight: 800, color: '#fff', letterSpacing: '0.2px' }}>
                  CPPE d'Issia
                </Box>
                <Box sx={{ fontSize: '9.5px', color: 'rgba(255,255,255,0.45)', letterSpacing: '1px', textTransform: 'uppercase', mt: '1px' }}>
                  Complexe Socio-Éducatif
                </Box>
              </Box>
            )}
          </Link>

          {/* ══ NAV DESKTOP ══ */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'stretch', ml: 4, flex: 1 }}>
              {NAV_ITEMS.map((item) =>
                item.children ? (
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
                        color: dropdownOpen ? '#fff' : 'rgba(255,255,255,0.72)',
                        fontSize: '12.5px',
                        fontWeight: 600,
                        px: 1.75,
                        borderRadius: 0,
                        borderBottom: dropdownOpen ? '2px solid #F5A623' : '2px solid transparent',
                        transition: 'all 0.2s',
                        '&:hover': { color: '#fff', background: 'rgba(255,255,255,0.05)' },
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
                          background: '#0a2e18',
                          borderRadius: '0 0 14px 14px',
                          overflow: 'hidden',
                          minWidth: 195,
                          boxShadow: '0 16px 40px rgba(0,0,0,0.4)',
                          zIndex: 1000,
                          border: '1px solid rgba(255,255,255,0.07)',
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
                              color: isActive ? '#F5A623' : 'rgba(255,255,255,0.68)',
                              fontSize: '12.5px',
                              fontWeight: isActive ? 700 : 500,
                              textDecoration: 'none',
                              borderLeft: isActive ? '3px solid #F5A623' : '3px solid transparent',
                              borderBottom: idx < item.children.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                              transition: 'all 0.15s',
                              background: isActive ? 'rgba(245,166,35,0.06)' : 'transparent',
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
                      color: isActive ? '#F5A623' : 'rgba(255,255,255,0.72)',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      textDecoration: 'none',
                      borderBottom: isActive ? '2px solid #F5A623' : '2px solid transparent',
                      transition: 'all 0.2s',
                      whiteSpace: 'nowrap',
                    })}
                  >
                    {item.label}
                  </NavLink>
                )
              )}
            </Box>
          )}

          {/* ══ CTA DESKTOP + BURGER MOBILE ══ */}
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
            {!isMobile && isOpen && (
              <Button
                component={Link}
                to="/inscription"
                variant="contained"
                size="small"
                sx={{
                  background: '#F5A623',
                  color: '#0f4a25',
                  fontWeight: 800,
                  fontSize: '12px',
                  px: 2.25,
                  py: 0.9,
                  borderRadius: '30px',
                  boxShadow: '0 3px 14px rgba(245,166,35,0.35)',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                  '&:hover': {
                    background: '#e0951f',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 5px 18px rgba(245,166,35,0.4)',
                  },
                }}
              >
                S'inscrire {annee}
              </Button>
            )}

            {isMobile && (
              <IconButton
                onClick={() => setMobileOpen(true)}
                sx={{
                  color: '#fff',
                  background: 'rgba(255,255,255,0.07)',
                  borderRadius: '10px',
                  '&:hover': { background: 'rgba(255,255,255,0.13)' },
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
          sx: { width: 285, background: '#0a2e18', color: '#fff', pt: 1 },
        }}
      >
        {/* En-tête drawer */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, pb: 2, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 38, height: 38,
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1.5px solid rgba(245,166,35,0.5)',
              }}
            >
              <Box component="img" src={logo} alt="Logo CPPE Issia" sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </Box>
            <Box>
              <Box sx={{ fontSize: '12.5px', fontWeight: 800, color: '#fff' }}>CPPE d'Issia</Box>
              <Box sx={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Complexe Socio-Éducatif</Box>
            </Box>
          </Box>
          <IconButton onClick={() => setMobileOpen(false)} sx={{ color: 'rgba(255,255,255,0.55)', p: 0.75 }}>
            <X size={20} />
          </IconButton>
        </Box>

        <List sx={{ py: 1 }}>
          {NAV_ITEMS.map((item) =>
            item.children ? (
              <Box key={item.label}>
                <ListItem
                  button
                  onClick={() => setSectionsOpen(!sectionsOpen)}
                  sx={{ color: 'rgba(255,255,255,0.72)', py: 1.1, px: 2 }}
                >
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ fontSize: 13, fontWeight: 600 }}
                  />
                  <ChevronDown
                    size={15}
                    style={{ transform: sectionsOpen ? 'rotate(180deg)' : 'none', transition: '0.2s', color: 'rgba(255,255,255,0.4)' }}
                  />
                </ListItem>
                <Collapse in={sectionsOpen}>
                  {item.children.map((child) => (
                    <ListItem
                      key={child.href}
                      component={Link}
                      to={child.href}
                      onClick={() => setMobileOpen(false)}
                      sx={{ pl: 4, color: 'rgba(255,255,255,0.5)', py: 0.85, borderLeft: '2px solid rgba(245,166,35,0.2)', ml: 2 }}
                    >
                      <ListItemText primary={child.label} primaryTypographyProps={{ fontSize: 12.5 }} />
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
                  color: location.pathname === item.href ? '#F5A623' : 'rgba(255,255,255,0.72)',
                  borderLeft: location.pathname === item.href ? '3px solid #F5A623' : '3px solid transparent',
                  background: location.pathname === item.href ? 'rgba(245,166,35,0.05)' : 'transparent',
                  py: 1.1,
                  transition: 'all 0.15s',
                }}
              >
                <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 13, fontWeight: 600 }} />
              </ListItem>
            )
          )}
        </List>

        {isOpen && (
          <Box sx={{ px: 2, pt: 1, pb: 2 }}>
            <Button
              component={Link}
              to="/inscription"
              variant="contained"
              fullWidth
              onClick={() => setMobileOpen(false)}
              sx={{
                background: '#F5A623',
                color: '#0f4a25',
                fontWeight: 800,
                fontSize: '13px',
                py: 1.25,
                borderRadius: '30px',
                '&:hover': { background: '#e0951f' },
              }}
            >
              S'inscrire {annee}
            </Button>
          </Box>
        )}
      </Drawer>
    </>
  )
}