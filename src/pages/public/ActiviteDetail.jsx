// ============================================================
// ACTIVITE DETAIL - redesign éditorial épuré
// ============================================================
import { useParams, Link } from 'react-router-dom'
import { Box, Container, Grid, Typography, Button } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { activitesApi, parametresApi } from '@/api/services'
import { LoadingSpinner } from '@/components/common'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const DETAIL_STYLES = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes scaleReveal {
    from { opacity: 0; transform: scale(1.04); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes lineGrow {
    from { width: 0; opacity: 0; }
    to   { width: 48px; opacity: 1; }
  }

  .d-hero   { animation: scaleReveal 0.9s cubic-bezier(0.4,0,0.2,1) both; }
  .d-fade-1 { animation: fadeInUp 0.6s 0.10s ease both; }
  .d-fade-2 { animation: fadeInUp 0.6s 0.22s ease both; }
  .d-fade-3 { animation: fadeInUp 0.6s 0.34s ease both; }
  .d-fade-4 { animation: fadeInUp 0.6s 0.46s ease both; }
  .d-line   { animation: lineGrow  0.7s 0.50s ease both; }

  .back-btn { transition: all 0.2s ease; }
  .back-btn:hover { transform: translateX(-3px); }

  .main-photo { transition: transform 0.7s cubic-bezier(0.4,0,0.2,1); }
  .photo-container:hover .main-photo { transform: scale(1.03); }
`

const SECTION_META = {
  creche:          { label: 'Crèche',          color: '#a11460', bg: '#fce4ec', dot: '#e91e8c', light: '#fff5f9' },
  petite_section:  { label: 'Petite Section',   color: '#b87b0f', bg: '#fff3e0', dot: '#F5A623', light: '#fffcf0' },
  moyenne_section: { label: 'Moyenne Section',  color: '#1B7A3E', bg: '#eaf4ee', dot: '#4CAF50', light: '#f2faf5' },
  grande_section:  { label: 'Grande Section',   color: '#6b21a8', bg: '#f3e8ff', dot: '#9c27b0', light: '#fbf4ff' },
  toutes:          { label: 'Toutes sections',  color: '#3949ab', bg: '#e8eaf6', dot: '#5c6bc0', light: '#f2f3ff' },
}

function normalizePhoto(m, i) {
  return {
    id:  m.id ?? m.uuid ?? i,
    src: m.conversions_urls?.medium
      || m.conversions_urls?.thumb
      || m.original_url
      || m.preview_url
      || m.url
      || m.thumb
      || null,
  }
}

export default function ActiviteDetail() {
  const { slug } = useParams()

  const { data, isLoading } = useQuery({
    queryKey: ['activite-detail', slug],
    queryFn:  () => activitesApi.getBySlug(slug),
  })

  const act = data?.data?.data

  const rawPhotos = act?.photos || act?.media || act?.images || []
  const mainPhoto = rawPhotos.map(normalizePhoto).find(p => p.src) ?? null
  const coverUrl  = act?.photo_couverture || mainPhoto?.src || null

  if (isLoading) return <LoadingSpinner />

  if (!act) return (
    <Box sx={{ py: 16, textAlign: 'center' }}>
      <Typography sx={{ color: '#6b7c70', fontFamily: "'Cormorant Garamond', serif", fontSize: 26, mb: 3 }}>
        Activité introuvable.
      </Typography>
      <Button component={Link} to="/activites" startIcon={<ArrowLeft size={15} />} sx={{ color: '#1B7A3E', fontWeight: 700 }}>
        Retour aux activités
      </Button>
    </Box>
  )

  const sc = SECTION_META[act.section] || {
    label: act.section, color: '#374151', bg: '#f3f4f6', dot: '#9e9e9e', light: '#f9f9f9',
  }

  return (
    <Box sx={{ background: '#f7faf8', minHeight: '100vh' }}>
      <style>{DETAIL_STYLES}</style>

      {/* ══════════ HERO — PHOTO PRINCIPALE ══════════ */}
      {coverUrl ? (
        <Box
          className="photo-container"
          sx={{
            position: 'relative',
            width: '100%',
            height: { xs: 280, sm: 420, md: 560 },
            overflow: 'hidden',
            background: '#0a2e18',
          }}
        >
          <Box
            component="img"
            src={coverUrl}
            alt={act.titre}
            className="main-photo d-hero"
            sx={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
            onError={(e) => { e.target.style.display = 'none' }}
          />

          {/* Dégradé bas vers haut */}
          <Box sx={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, transparent 30%, rgba(4,16,9,0.80) 100%)',
          }} />

          {/* Grain subtil */}
          <Box sx={{
            position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.5,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E")`,
          }} />

          {/* Titre en overlay bas */}
          <Container maxWidth="lg" sx={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', pb: { xs: 4, md: 5.5 }, width: '100%' }}>
            <Box className="d-fade-1" sx={{ mb: 1.5 }}>
              <Box sx={{
                display: 'inline-flex', alignItems: 'center', gap: 1,
                px: 1.5, py: 0.5, borderRadius: '20px',
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.22)',
                backdropFilter: 'blur(10px)',
              }}>
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: sc.dot }} />
                <Typography sx={{ fontSize: 10, fontWeight: 800, color: '#fff', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                  {sc.label}
                </Typography>
              </Box>
            </Box>

            <Typography
              className="d-fade-2"
              component="h1"
              sx={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: { xs: 32, sm: 44, md: 58 },
                fontWeight: 700, color: '#fff',
                lineHeight: 1.05, maxWidth: 820,
                textShadow: '0 2px 24px rgba(0,0,0,0.25)',
              }}
            >
              {act.titre}
            </Typography>
          </Container>
        </Box>

      ) : (
        /* ── Fallback sans photo ── */
        <Box sx={{
          background: 'linear-gradient(135deg, #0a2e18 0%, #0f4a25 60%, #1B7A3E 100%)',
          pt: { xs: 10, md: 14 }, pb: { xs: 5, md: 7 },
          position: 'relative', overflow: 'hidden',
        }}>
          <Box sx={{ position: 'absolute', width: 600, height: 600, right: -200, top: -200, borderRadius: '50%', background: `radial-gradient(circle, ${sc.dot}12 0%, transparent 65%)`, pointerEvents: 'none' }} />
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <Box className="d-fade-1" sx={{ mb: 1.5 }}>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 1.5, py: 0.5, borderRadius: '20px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}>
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: sc.dot }} />
                <Typography sx={{ fontSize: 10, fontWeight: 800, color: '#fff', letterSpacing: '1.5px', textTransform: 'uppercase' }}>{sc.label}</Typography>
              </Box>
            </Box>
            <Typography className="d-fade-2" component="h1" sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: { xs: 36, md: 58 }, fontWeight: 700, color: '#fff', lineHeight: 1.05, maxWidth: 720 }}>
              {act.titre}
            </Typography>
          </Container>
        </Box>
      )}

      {/* ══════════ CONTENU ══════════ */}
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>

        {/* Retour */}
        <Box className="d-fade-1" sx={{ mb: { xs: 4, md: 5 } }}>
          <Button
            component={Link}
            to="/activites"
            className="back-btn"
            startIcon={<ArrowLeft size={14} />}
            sx={{
              color: '#8fa99b', fontWeight: 600, fontSize: 13, px: 0,
              '&:hover': { color: '#1B7A3E', background: 'transparent' },
            }}
          >
            Retour aux activités
          </Button>
        </Box>

        <Grid container spacing={{ xs: 4, md: 7 }}>

          {/* ── DESCRIPTION ── */}
          <Grid item xs={12} md={7}>

            <Box className="d-fade-2" sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3.5 }}>
              <Box className="d-line" sx={{ width: 48, height: 2.5, background: '#F5A623', borderRadius: 2, flexShrink: 0 }} />
              <Typography sx={{ fontSize: 10.5, fontWeight: 800, color: '#F5A623', letterSpacing: '3px', textTransform: 'uppercase' }}>
                À propos
              </Typography>
            </Box>

            {/* Titre affiché ici aussi si pas de photo hero (évite la répétition sinon) */}
            {coverUrl && (
              <Typography className="d-fade-2" sx={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: { xs: 28, md: 40 }, fontWeight: 700,
                color: '#0c1a10', lineHeight: 1.12, mb: 3.5,
              }}>
                {act.titre}
              </Typography>
            )}

            {/* Corps */}
            <Box
              className="d-fade-3"
              sx={{
                fontSize: { xs: 15, md: 16.5 },
                color: '#3d5244',
                lineHeight: 1.95,
                '& p':        { mb: 2, '&:last-child': { mb: 0 } },
                '& ul, & ol': { pl: 2.5, mb: 2 },
                '& li':       { mb: 0.75 },
                '& strong':   { color: '#0c1a10', fontWeight: 700 },
                '& em':       { color: '#1B7A3E', fontStyle: 'italic' },
              }}
              dangerouslySetInnerHTML={{ __html: act.description || '<p>Aucune description disponible.</p>' }}
            />
          </Grid>

          {/* ── SIDEBAR ── */}
          <Grid item xs={12} md={5}>
            <Box className="d-fade-4" sx={{ position: { md: 'sticky' }, top: { md: 96 } }}>

              {/* Carte méta */}
              <Box sx={{
                background: '#fff',
                borderRadius: '24px',
                border: '1px solid rgba(27,122,62,0.1)',
                overflow: 'hidden',
                boxShadow: '0 8px 40px rgba(27,122,62,0.07)',
                mb: 3,
              }}>
                {/* Bandeau section */}
                <Box sx={{
                  background: `linear-gradient(120deg, ${sc.color}14 0%, ${sc.dot}0d 100%)`,
                  borderBottom: `3px solid ${sc.dot}20`,
                  px: 3.5, py: 3,
                  display: 'flex', alignItems: 'center', gap: 2,
                }}>
                  <Box sx={{
                    width: 42, height: 42, borderRadius: '50%',
                    background: sc.bg,
                    border: `2px solid ${sc.dot}50`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', background: sc.dot }} />
                  </Box>
                  <Box>
                    
                    <Typography sx={{ fontSize: 15, fontWeight: 700, color: sc.color, lineHeight: 1 }}>
                      {sc.label}
                    </Typography>
                  </Box>
                </Box>

                {/* Champs */}
                <Box sx={{ px: 3.5, py: 2.5 }}>
                  {act.date_activite && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2, borderBottom: '1px solid #f0f5f2' }}>
                      <Typography sx={{ fontSize: 12.5, color: '#8fa99b', fontWeight: 500 }}>
                        Date
                      </Typography>
                      <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: '#0c1a10' }}>
                        {act.date_formatted
                          || new Date(act.date_activite).toLocaleDateString('fr-FR', {
                              day: 'numeric', month: 'long', year: 'numeric',
                             })}
                      </Typography>
                    </Box>
                  )}

                </Box>

                {/* Bouton */}
                <Box sx={{ px: 3.5, pb: 3.5 }}>
                  <Button
                    component={Link}
                    to="/activites"
                    fullWidth
                    endIcon={<ArrowRight size={15} />}
                    sx={{
                      background: 'linear-gradient(135deg, #0f4a25, #1B7A3E)',
                      color: '#fff', fontWeight: 700, fontSize: 13.5,
                      py: 1.5, borderRadius: '14px',
                      boxShadow: '0 6px 20px rgba(15,74,37,0.22)',
                      transition: 'all 0.22s',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #0a2e18, #0f4a25)',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 10px 28px rgba(15,74,37,0.32)',
                      },
                    }}
                  >
                    Voir toutes les activités
                  </Button>
                </Box>
              </Box>

              {/* Citation décorative */}
              <Box sx={{
                px: 3, py: 2.5,
                borderLeft: `4px solid ${sc.dot}`,
                background: sc.light,
                borderRadius: '0 16px 16px 0',
              }}>
               
              </Box>

            </Box>
          </Grid>

        </Grid>
      </Container>

      {/* ══════════ BANDE FOOTER ══════════ */}
      <Box sx={{
        background: 'linear-gradient(135deg, #0a2e18 0%, #0f4a25 100%)',
        mt: { xs: 4, md: 6 },
        py: { xs: 4, md: 5 },
      }}>
        <Container maxWidth="lg">
          <Box sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 3,
          }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                <Box sx={{ width: 24, height: 2, background: '#F5A623' }} />
                <Typography sx={{ fontSize: 9.5, fontWeight: 800, color: '#F5A623', letterSpacing: '2.5px', textTransform: 'uppercase' }}>
                  CPPE Issia
                </Typography>
              </Box>
              <Typography sx={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: { xs: 20, md: 24 }, fontWeight: 700, color: '#fff',
              }}>
                Découvrez nos autres activités
              </Typography>
            </Box>
            <Button
              component={Link}
              to="/activites"
              endIcon={<ArrowRight size={15} />}
              sx={{
                background: 'rgba(255,255,255,0.08)',
                border: '1.5px solid rgba(255,255,255,0.2)',
                color: '#fff', fontWeight: 700, fontSize: 13,
                px: 3, py: 1.3, borderRadius: '30px',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.2s',
                '&:hover': { background: '#F5A623', borderColor: '#F5A623', color: '#0f4a25' },
              }}
            >
              Toutes les activités
            </Button>
          </Box>
        </Container>
      </Box>

    </Box>
  )
}