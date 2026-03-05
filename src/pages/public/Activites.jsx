// ============================================================
// ACTIVITES LIST - redesign éditorial épuré (sans sections)
// ============================================================
import { useState } from 'react'
import { Box, Container, Grid, Typography, Chip } from '@mui/material'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { activitesApi } from '@/api/services'
import { LoadingSpinner } from '@/components/common'
import { ArrowRight, Sparkles, Camera } from 'lucide-react'
import { getImageUrl } from '@/utils/imageHelper'

const ORANGE = '#FF7F27'

const ACT_STYLES = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse-dot {
    0%, 100% { box-shadow: 0 0 0 0 rgba(255,127,39,0.5); }
    50%       { box-shadow: 0 0 0 8px rgba(255,127,39,0); }
  }
  .act-card { animation: fadeInUp 0.55s ease both; }
  .act-card:nth-child(1) { animation-delay: 0.05s; }
  .act-card:nth-child(2) { animation-delay: 0.12s; }
  .act-card:nth-child(3) { animation-delay: 0.19s; }
  .act-card:nth-child(4) { animation-delay: 0.26s; }
  .act-card:nth-child(5) { animation-delay: 0.33s; }
  .act-card:nth-child(6) { animation-delay: 0.40s; }

  .act-img { transition: transform 0.55s cubic-bezier(0.4,0,0.2,1); }
  .act-card-wrap:hover .act-img { transform: scale(1.07); }
  .act-overlay { transition: opacity 0.3s; opacity: 0; }
  .act-card-wrap:hover .act-overlay { opacity: 1; }
  .act-arrow { transition: transform 0.2s; }
  .act-link:hover .act-arrow { transform: translateX(4px); }
`

function ActCard({ act, index }) {
  const isFeatured = index === 0
  const [imageError, setImageError] = useState(false)
  const imageUrl = act.photo_couverture ? getImageUrl(act.photo_couverture) : null

  return (
    <Box className="act-card" sx={{ height: '100%' }}>
      <Box
        className="act-card-wrap"
        sx={{
          background: '#fff',
          borderRadius: isFeatured ? '28px' : '24px',
          overflow: 'hidden',
          border: '1px solid rgba(27,122,62,0.1)',
          height: '100%',
          display: 'flex',
          flexDirection: isFeatured ? { xs: 'column', md: 'row' } : 'column',
          transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
          '&:hover': {
            boxShadow: '0 28px 72px rgba(27,122,62,0.18)',
            transform: 'translateY(-8px)',
            border: '1px solid rgba(27,122,62,0.25)',
          },
        }}
      >
        {/* ── IMAGE ── */}
        <Box sx={{
          position: 'relative', overflow: 'hidden', flexShrink: 0,
          height: isFeatured ? { xs: 320, md: '100%' } : 300,
          width: isFeatured ? { xs: '100%', md: '50%' } : '100%',
          background: '#eaf4ee',
          minHeight: isFeatured ? { md: 420 } : 'auto',
        }}>
          {imageUrl && !imageError ? (
            <Box
              component="img"
              src={imageUrl}
              alt={act.titre}
              className="act-img"
              onError={() => setImageError(true)}
              sx={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0, display: 'block' }}
            />
          ) : (
            <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eaf4ee' }}>
              <Sparkles size={isFeatured ? 64 : 44} color="#1B7A3E" style={{ opacity: 0.15 }} />
            </Box>
          )}

          {/* Overlay hover */}
          <Box className="act-overlay" sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(15,74,37,0.75), rgba(0,0,0,0.35))' }} />

          {/* Compteur photos */}
          {act.media_count > 0 && (
            <Box sx={{
              position: 'absolute', bottom: 14, right: 14,
              display: 'flex', alignItems: 'center', gap: 0.75,
              px: 1.5, py: 0.5, borderRadius: '20px',
              background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)',
            }}>
              <Camera size={12} color="rgba(255,255,255,0.9)" />
              <Typography sx={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>
                {act.media_count}
              </Typography>
            </Box>
          )}

          {/* Numéro décoratif carte vedette */}
          {isFeatured && (
            <Box sx={{
              position: 'absolute', bottom: -12, right: -8,
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 140, fontWeight: 700, lineHeight: 1,
              color: 'rgba(255,255,255,0.05)', userSelect: 'none', pointerEvents: 'none',
            }}>
              01
            </Box>
          )}
        </Box>

        {/* ── CONTENU ── */}
        <Box sx={{ p: isFeatured ? { xs: 3, md: 4 } : 3, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <Box>
            {isFeatured && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2 }}>
                <Box sx={{ width: 28, height: 2, background: ORANGE, borderRadius: 2 }} />
                <Typography sx={{ fontSize: 10, fontWeight: 800, color: ORANGE, letterSpacing: '2.5px', textTransform: 'uppercase' }}>
                  À la une
                </Typography>
              </Box>
            )}

            <Typography sx={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: isFeatured ? { xs: 28, md: 38 } : { xs: 22, md: 26 },
              fontWeight: 700, color: '#0c1a10', lineHeight: 1.2, mb: 1.75,
            }}>
              {act.titre}
            </Typography>

            <Box
              sx={{
                fontSize: 14.5, color: '#6b7c70', lineHeight: 1.85,
                display: '-webkit-box', WebkitLineClamp: isFeatured ? 5 : 4,
                WebkitBoxOrient: 'vertical', overflow: 'hidden',
                '& p': { m: 0 }, '& *': { fontSize: 'inherit', color: 'inherit' },
              }}
              dangerouslySetInnerHTML={{ __html: act.description || '' }}
            />
          </Box>

          {/* Footer carte */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2.5, pt: 2.5, borderTop: '1px solid rgba(27,122,62,0.08)' }}>
            <Link to={`/activites/${act.slug}`} className="act-link" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Box sx={{
                width: isFeatured ? 40 : 34, height: isFeatured ? 40 : 34,
                borderRadius: '50%', background: 'linear-gradient(135deg, #0f4a25, #1B7A3E)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(15,74,37,0.3)', transition: 'all 0.2s',
                '&:hover': { transform: 'scale(1.08)', boxShadow: '0 6px 20px rgba(15,74,37,0.4)' },
              }}>
                <ArrowRight size={isFeatured ? 17 : 14} color="#fff" className="act-arrow" />
              </Box>
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#1B7A3E', ml: 0.5 }}>
                Voir l'activité
              </Typography>
            </Link>

            {isFeatured && (
              <Chip
                label="Activité vedette"
                size="small"
                sx={{ background: 'linear-gradient(135deg, #0f4a25, #1B7A3E)', color: '#fff', fontWeight: 700, fontSize: 10.5, border: 'none' }}
              />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default function Activites() {
  const { data, isLoading } = useQuery({
    queryKey: ['activites-public'],
    queryFn:  () => activitesApi.getAll(),
  })

  const activites = data?.data?.data?.data || []

  return (
    <Box>
      <style>{ACT_STYLES}</style>

      {/* ══════════ HERO ══════════ */}
      <Box sx={{
        background: 'linear-gradient(135deg, #0a2e18 0%, #0f4a25 50%, #1a5e32 100%)',
        pt: { xs: 9, md: 12 }, pb: { xs: 7, md: 9 },
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Grille de fond */}
        <Box sx={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '48px 48px', pointerEvents: 'none',
        }} />
        {/* Halos décoratifs */}
        <Box sx={{ position: 'absolute', width: 700, height: 700, right: -250, top: -250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,127,39,0.09) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', width: 400, height: 400, left: -100, bottom: -100, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,195,74,0.06) 0%, transparent 65%)', pointerEvents: 'none' }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { md: 'flex-end' }, justifyContent: 'space-between', gap: 4 }}>
            <Box>
              {/* Badge */}
              <Box sx={{
                display: 'inline-flex', alignItems: 'center', gap: 1.25,
                px: 2, py: 0.65, borderRadius: '30px',
                background: 'rgba(255,127,39,0.12)', border: '1px solid rgba(255,127,39,0.28)',
                mb: 2.5,
              }}>
                <Box sx={{ width: 7, height: 7, borderRadius: '50%', background: ORANGE, animation: 'pulse-dot 2.2s ease infinite' }} />
                <Typography sx={{ fontSize: 10.5, fontWeight: 800, color: ORANGE, letterSpacing: '2.5px', textTransform: 'uppercase' }}>
                  Vie scolaire
                </Typography>
              </Box>

              <Typography variant="h1" sx={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: { xs: 42, md: 66 }, fontWeight: 700,
                color: '#fff', lineHeight: 1.0, mb: 2,
              }}>
                Nos{' '}
                <Box component="em" sx={{ color: ORANGE, fontStyle: 'italic' }}>Activités</Box>
              </Typography>

              <Typography sx={{
                color: 'rgba(255,255,255,0.55)', fontSize: { xs: 13, md: 14.5 },
                lineHeight: 1.8, maxWidth: 480,
                borderLeft: `3px solid ${ORANGE}`, pl: 2,
              }}>
                Découvrez toutes les activités éducatives, artistiques et sportives proposées par le CPPE d'Issia.
              </Typography>
            </Box>

            {/* Stats rapides */}
            <Box sx={{ display: 'flex', gap: 2, flexShrink: 0, flexWrap: 'wrap' }}>
              {[
                { num: '+20', label: 'Activités' },
                { num: '∞',   label: 'Souvenirs' },
              ].map(({ num, label }) => (
                <Box key={label} sx={{
                  px: 2.5, py: 2, borderRadius: '16px',
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                  textAlign: 'center', minWidth: 72,
                }}>
                  <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 700, color: ORANGE, lineHeight: 1 }}>
                    {num}
                  </Typography>
                  <Typography sx={{ fontSize: 10.5, color: 'rgba(255,255,255,0.45)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', mt: 0.25 }}>
                    {label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ══════════ LISTE ══════════ */}
      <Box sx={{ py: 8, background: '#f4f8f5' }}>
        <Container maxWidth="lg">

          {/* Titre de section */}
          <Box sx={{ mb: 5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
              <Box sx={{ width: 28, height: 2, background: ORANGE }} />
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: ORANGE, letterSpacing: '3px', textTransform: 'uppercase' }}>
                Catalogue
              </Typography>
            </Box>
            <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: { xs: 22, md: 32 }, fontWeight: 700, color: '#0c1a10' }}>
              Toutes les activités
            </Typography>
          </Box>

          {/* Contenu */}
          {isLoading ? (
            <LoadingSpinner />
          ) : activites.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 10, background: '#fff', borderRadius: '24px', border: '1px solid rgba(27,122,62,0.1)' }}>
              <Box sx={{ width: 72, height: 72, borderRadius: '20px', background: '#eaf4ee', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2.5 }}>
                <Sparkles size={32} color="#1B7A3E" style={{ opacity: 0.5 }} />
              </Box>
              <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color: '#0c1a10', mb: 1 }}>
                Aucune activité
              </Typography>
              <Typography sx={{ color: '#6b7c70', fontSize: 14 }}>
                Aucune activité disponible pour le moment.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {activites.map((act, index) => (
                <Grid
                  item xs={12} md={index === 0 ? 12 : 6}
                  key={act.id} className="act-card"
                  style={{ animationDelay: `${index * 0.07}s` }}
                >
                  <ActCard act={act} index={index} />
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
    </Box>
  )
}