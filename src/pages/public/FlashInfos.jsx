import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import {
  Box,
  Container,
  Grid,
  Typography,
  Chip,
  Select,
  MenuItem,
  FormControl,
  Button,
  IconButton,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { actualitesApi } from '@/api/services'
import { LoadingSpinner, EmptyState } from '@/components/common'
import { Bell, Calendar, Users, BookOpen, Megaphone, ArrowLeft, Clock, Tag, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const TYPE_CONFIG = {
  flash:       { label: 'Flash Info',  icon: Bell,      color: '#1B7A3E', bg: '#eaf4ee',  border: '#c3dfc9' },
  convocation: { label: 'Convocation', icon: Users,     color: '#1565c0', bg: '#dbeafe',  border: '#93c5fd' },
  evenement:   { label: 'Événement',   icon: Calendar,  color: '#b87b0f', bg: '#fff3e0',  border: '#fbbf24' },
  inscription: { label: 'Inscription', icon: BookOpen,  color: '#7c3d00', bg: '#fef3c7',  border: '#f59e0b' },
}

// ─── BADGE TYPE ──────────────────────────────────────────────
function TypeBadge({ type, size = 'md' }) {
  const tc   = TYPE_CONFIG[type] || TYPE_CONFIG.flash
  const Icon = tc.icon
  const px   = size === 'sm' ? 1.25 : 1.75
  const py   = size === 'sm' ? 0.35 : 0.6
  const fs   = size === 'sm' ? 10   : 11.5
  const is   = size === 'sm' ? 11   : 14

  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, px, py, borderRadius: '20px', background: tc.bg, border: `1px solid ${tc.border}`, flexShrink: 0 }}>
      <Icon size={is} color={tc.color} />
      <Typography sx={{ fontSize: fs, fontWeight: 700, color: tc.color, letterSpacing: '0.3px' }}>
        {tc.label}
      </Typography>
    </Box>
  )
}

// ─── VUE DÉTAIL ───────────────────────────────────────────────
function ArticleDetail({ actu, onBack }) {
  const tc   = TYPE_CONFIG[actu.type] || TYPE_CONFIG.flash

  return (
    <Box sx={{ minHeight: '100vh', background: '#f4f8f5' }}>

      {/* ── HERO DÉTAIL ── */}
      <Box
        sx={{
          background: `linear-gradient(160deg, #0a2e18 0%, #0f4a25 55%, #1B7A3E 100%)`,
          pt: { xs: 5, md: 7 },
          pb: { xs: 6, md: 8 },
          px: 3,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Motif de fond */}
        <Box sx={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', width: 500, height: 500, right: -150, top: -150, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,166,35,0.08) 0%, transparent 65%)', pointerEvents: 'none' }} />

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Bouton retour */}
          <Button
            onClick={onBack}
            startIcon={<ArrowLeft size={15} />}
            sx={{
              color: 'rgba(255,255,255,0.65)',
              mb: 3,
              fontSize: 13,
              fontWeight: 600,
              pl: 0,
              '&:hover': { color: '#fff', background: 'none' },
            }}
          >
            Retour aux actualités
          </Button>

          {/* Badge type */}
          <Box sx={{ mb: 2.5 }}>
            <TypeBadge type={actu.type} />
          </Box>

          {/* Titre */}
          <Typography
            sx={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: { xs: 30, md: 46 },
              fontWeight: 700,
              color: '#fff',
              lineHeight: 1.15,
              mb: 3,
            }}
          >
            {actu.titre}
          </Typography>

          {/* Meta */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, flexWrap: 'wrap' }}>
            {actu.date_publication && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Calendar size={14} color="rgba(255,255,255,0.45)" />
                <Typography sx={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>
                  {format(new Date(actu.date_publication), "dd MMMM yyyy", { locale: fr })}
                </Typography>
              </Box>
            )}
            {actu.updated_at && actu.updated_at !== actu.date_publication && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Clock size={14} color="rgba(255,255,255,0.35)" />
                <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                  Mis à jour le {format(new Date(actu.updated_at), "dd MMM yyyy", { locale: fr })}
                </Typography>
              </Box>
            )}
          </Box>
        </Container>
      </Box>

      {/* ── CONTENU ARTICLE ── */}
      <Container maxWidth="md" sx={{ py: { xs: 5, md: 7 } }}>
        <Box
          sx={{
            background: '#fff',
            borderRadius: '24px',
            border: '1px solid #dae8df',
            overflow: 'hidden',
            boxShadow: '0 8px 40px rgba(27,122,62,0.08)',
          }}
        >
          {/* Bande colorée */}
          <Box sx={{ height: 5, background: `linear-gradient(90deg, ${tc.color}, transparent)` }} />

          <Box sx={{ p: { xs: 3, md: 5 } }}>
            {/* Corps de l'article */}
            <Box
              sx={{
                fontSize: { xs: 15, md: 16 },
                lineHeight: 1.9,
                color: '#2d3a30',
                '& p': { mb: 2 },
                '& strong': { color: '#0c1a10', fontWeight: 700 },
                '& em': { fontStyle: 'italic', color: '#4b5e52' },
                '& ul': { pl: 2.5, mb: 2 },
                '& li': { mb: 0.75, lineHeight: 1.75 },
                '& a': { color: '#1B7A3E', fontWeight: 600, textDecoration: 'underline' },
              }}
              dangerouslySetInnerHTML={{ __html: actu.contenu || '<p>Aucun contenu disponible.</p>' }}
            />
          </Box>

          {/* Footer carte */}
          <Box
            sx={{
              px: { xs: 3, md: 5 },
              py: 2.5,
              background: '#f9fbf9',
              borderTop: '1px solid #e8f0ea',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 1.5,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Tag size={13} color="#9ca3af" />
              <Typography sx={{ fontSize: 12, color: '#9ca3af' }}>CPPE d'Issia — Communication officielle</Typography>
            </Box>
            <Button
              onClick={onBack}
              startIcon={<ArrowLeft size={14} />}
              size="small"
              sx={{ color: '#1B7A3E', fontWeight: 700, fontSize: 12.5, '&:hover': { background: '#eaf4ee' } }}
            >
              Toutes les actualités
            </Button>
          </Box>
        </Box>

        {/* Lien inscription si type = inscription */}
        {actu.type === 'inscription' && (
          <Box
            sx={{
              mt: 3,
              p: 3,
              background: 'linear-gradient(135deg, #0f4a25, #1B7A3E)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            <Box>
              <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 15, mb: 0.25 }}>Prêt à inscrire votre enfant ?</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: 13 }}>Constituez votre dossier d'inscription en ligne.</Typography>
            </Box>
            <Button
              component={Link}
              to="/inscription"
              variant="contained"
              endIcon={<ChevronRight size={14} />}
              sx={{ background: '#F5A623', color: '#0f4a25', fontWeight: 800, fontSize: 13, px: 2.5, '&:hover': { background: '#e0951f' } }}
            >
              Dossier d'inscription
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  )
}

// ─── CARTE ACTU (liste) ───────────────────────────────────────
function ActuCard({ actu, onClick }) {
  const tc   = TYPE_CONFIG[actu.type] || TYPE_CONFIG.flash
  const Icon = tc.icon
  const raw  = actu.contenu?.replace(/<[^>]+>/g, '') || ''
  const excerpt = raw.trim().split(/\s+/).slice(0, 28).join(' ') + (raw.split(/\s+/).length > 28 ? '…' : '')

  return (
    <Box
      onClick={() => onClick(actu)}
      sx={{
        background: '#fff',
        borderRadius: '20px',
        p: 3,
        border: `1px solid #dae8df`,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'all 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          boxShadow: `0 12px 32px rgba(27,122,62,0.13)`,
          transform: 'translateY(-4px)',
          borderColor: tc.border,
        },
        '&:hover .actu-arrow': { opacity: 1, transform: 'translateX(0)' },
      }}
    >
      {/* Bande couleur en haut */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${tc.color}, transparent)` }} />

      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, flex: 1 }}>
        {/* Icône */}
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: '14px',
            background: tc.bg,
            border: `1px solid ${tc.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            mt: 0.25,
          }}
        >
          <Icon size={19} color={tc.color} />
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Badge + Date */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.25, flexWrap: 'wrap' }}>
            <TypeBadge type={actu.type} size="sm" />
            {actu.date_publication && (
              <Typography sx={{ fontSize: 11, color: '#9ca3af' }}>
                {format(new Date(actu.date_publication), 'dd MMM yyyy', { locale: fr })}
              </Typography>
            )}
          </Box>

          {/* Titre */}
          <Typography sx={{ fontWeight: 700, fontSize: 15.5, color: '#0c1a10', mb: 1, lineHeight: 1.35 }}>
            {actu.titre}
          </Typography>

          {/* Extrait */}
          <Typography sx={{ fontSize: 13, color: '#6b7c70', lineHeight: 1.75, flex: 1 }}>
            {excerpt || 'Cliquez pour lire l\'article complet.'}
          </Typography>
        </Box>
      </Box>

      {/* Lire la suite */}
      <Box
        sx={{
          mt: 2.5,
          pt: 2,
          borderTop: '1px solid #e8f0ea',
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
        }}
      >
        <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: tc.color }}>Lire l'article</Typography>
        <Box
          className="actu-arrow"
          sx={{
            opacity: 0,
            transform: 'translateX(-4px)',
            transition: 'all 0.2s',
          }}
        >
          <ChevronRight size={14} color={tc.color} />
        </Box>
      </Box>
    </Box>
  )
}

// ─── PAGE PRINCIPALE ──────────────────────────────────────────
export default function FlashInfos() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [type, setType]                 = useState('')
  const [selectedActu, setSelectedActu] = useState(null)

  const articleId = searchParams.get('id')

  // Chargement de la liste
  const { data, isLoading } = useQuery({
    queryKey: ['flash-infos', type],
    queryFn:  () => actualitesApi.getAll({ type: type || undefined, per_page: 50 }),
  })

  const actualites = data?.data?.data?.data || []

  // Si un ?id= est présent, on sélectionne automatiquement l'article
  useEffect(() => {
    if (articleId && actualites.length > 0) {
      const found = actualites.find((a) => String(a.id) === String(articleId))
      if (found) setSelectedActu(found)
    }
  }, [articleId, actualites])

  const handleOpen = (actu) => {
    setSelectedActu(actu)
    setSearchParams({ id: actu.id })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBack = () => {
    setSelectedActu(null)
    setSearchParams({})
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ── Vue détail ──
  if (selectedActu) {
    return <ArticleDetail actu={selectedActu} onBack={handleBack} />
  }

  // ── Vue liste ──
  return (
    <Box>
      {/* HEADER */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0f4a25, #1B7A3E)',
          py: { xs: 8, md: 11 },
          px: 3,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Box sx={{ width: 56, height: 56, background: '#F5A623', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Megaphone size={26} color="#0f4a25" />
            </Box>
          </Box>
          <Typography
            variant="h1"
            sx={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: { xs: 36, md: 54 },
              fontWeight: 700,
              color: '#fff',
              lineHeight: 1.1,
              mb: 1.5,
            }}
          >
            Flash Infos & Actualités
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 14.5, maxWidth: 480, mx: 'auto' }}>
            Toutes les annonces, convocations et informations du CPPE d'Issia.
          </Typography>
        </Container>
      </Box>

      {/* CONTENU */}
      <Box sx={{ py: 7, background: '#f4f8f5' }}>
        <Container maxWidth="lg">

          {/* FILTRE */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: 13, color: '#0c1a10' }}>
                {actualites.length} publication{actualites.length > 1 ? 's' : ''}
              </Typography>
            </Box>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <Select
                value={type}
                onChange={(e) => setType(e.target.value)}
                displayEmpty
                sx={{ background: '#fff', borderRadius: '12px', fontSize: 13 }}
              >
                <MenuItem value="">Toutes les catégories</MenuItem>
                {Object.entries(TYPE_CONFIG).map(([val, { label }]) => (
                  <MenuItem key={val} value={val}>{label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {isLoading ? (
            <LoadingSpinner />
          ) : actualites.length === 0 ? (
            <EmptyState icon={Bell} title="Aucune actualité" description="Aucune information disponible pour le moment." />
          ) : (
            <Grid container spacing={2.5}>
              {actualites.map((actu) => (
                <Grid item xs={12} md={6} key={actu.id}>
                  <ActuCard actu={actu} onClick={handleOpen} />
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
    </Box>
  )
}