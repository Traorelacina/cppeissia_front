// ============================================================
// ACTIVITE DETAIL - redesign éditorial
// ============================================================
import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Box, Container, Grid, Typography, Chip, Button, Dialog } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { activitesApi, parametresApi } from '@/api/services'
import { LoadingSpinner } from '@/components/common'
import { ArrowLeft, Image as ImageIcon, X, Camera, ChevronRight, Calendar, Users } from 'lucide-react'

const DETAIL_STYLES = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse-dot {
    0%, 100% { box-shadow: 0 0 0 0 rgba(245,166,35,0.5); }
    50%       { box-shadow: 0 0 0 7px rgba(245,166,35,0); }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.94); }
    to   { opacity: 1; transform: scale(1); }
  }
  .d-fade-1 { animation: fadeInUp 0.5s 0.05s ease both; }
  .d-fade-2 { animation: fadeInUp 0.5s 0.13s ease both; }
  .d-fade-3 { animation: fadeInUp 0.5s 0.21s ease both; }
  .d-fade-4 { animation: fadeInUp 0.5s 0.29s ease both; }

  .photo-thumb { transition: transform 0.35s cubic-bezier(0.4,0,0.2,1); }
  .photo-wrap:hover .photo-thumb { transform: scale(1.08); }
  .photo-overlay { opacity: 0; transition: opacity 0.25s; }
  .photo-wrap:hover .photo-overlay { opacity: 1; }

  .lightbox-enter { animation: scaleIn 0.25s ease both; }
`

const SECTION_META = {
  creche:          { label: 'Crèche',          color: '#a11460', bg: '#fce4ec', dot: '#e91e8c' },
  petite_section:  { label: 'Petite Section',   color: '#b87b0f', bg: '#fff3e0', dot: '#F5A623' },
  moyenne_section: { label: 'Moyenne Section',  color: '#1B7A3E', bg: '#eaf4ee', dot: '#4CAF50' },
  grande_section:  { label: 'Grande Section',   color: '#6b21a8', bg: '#f3e8ff', dot: '#9c27b0' },
  toutes:          { label: 'Toutes sections',  color: '#3949ab', bg: '#e8eaf6', dot: '#5c6bc0' },
}

export default function ActiviteDetail() {
  const { slug } = useParams()
  const [lightbox, setLightbox] = useState(null)
  const [lightboxIdx, setLightboxIdx] = useState(0)

  const { data, isLoading } = useQuery({
    queryKey: ['activite-detail', slug],
    queryFn:  () => activitesApi.getBySlug(slug),
  })

  // Récupère les paramètres (pour date rentrée, annee scolaire, etc.)
  const { data: paramsData } = useQuery({
    queryKey: ['parametres-public'],
    queryFn:  () => parametresApi.getAll(),
    staleTime: 5 * 60 * 1000,
  })

  const act    = data?.data?.data
  const params = paramsData?.data?.data || {}

  const annee     = params?.annee_scolaire_courante || '2025-2026'
  const dateRentree = params?.date_rentree         || '06 octobre 2025'
  const isOpen    = params?.inscriptions_ouvertes  !== 'false'

  const openLightbox = (photo, idx) => { setLightbox(photo.fullUrl || photo.displayUrl); setLightboxIdx(idx) }
  const prevPhoto = (photos) => {
    const newIdx = (lightboxIdx - 1 + photos.length) % photos.length
    const p = photos[newIdx]
    setLightbox(p.fullUrl || p.displayUrl); setLightboxIdx(newIdx)
  }
  const nextPhoto = (photos) => {
    const newIdx = (lightboxIdx + 1) % photos.length
    const p = photos[newIdx]
    setLightbox(p.fullUrl || p.displayUrl); setLightboxIdx(newIdx)
  }

  if (isLoading) return <LoadingSpinner />
  if (!act) return (
    <Box sx={{ py: 12, textAlign: 'center' }}>
      <Typography sx={{ color: '#6b7c70', fontFamily: "'Cormorant Garamond', serif", fontSize: 24 }}>Activité introuvable.</Typography>
      <Button component={Link} to="/activites" sx={{ mt: 2, color: '#1B7A3E' }}>Retour aux activités</Button>
    </Box>
  )

  const sc = SECTION_META[act.section] || { label: act.section, color: '#374151', bg: '#f3f4f6', dot: '#9e9e9e' }

  // Spatie Media Library stocke les médias dans `media` avec original_url
  // Fallback sur act.photos ou act.images (autres formats possibles)
  const rawMedia = act.media || act.photos || act.images || []

  // Normalise chaque media en { id, displayUrl, fullUrl }
  const photos = rawMedia.map((m, i) => ({
    id:         m.id || m.uuid || i,
    displayUrl: m.conversions_urls?.thumb
                || m.conversions_urls?.preview
                || m.preview_url
                || m.thumb
                || m.medium
                || m.original_url
                || m.url
                || null,
    fullUrl:    m.original_url
                || m.url
                || m.conversions_urls?.large
                || m.conversions_urls?.thumb
                || m.preview_url
                || null,
  })).filter(p => p.displayUrl || p.fullUrl)

  const coverUrl = act.photo_couverture
    || photos[0]?.fullUrl
    || photos[0]?.displayUrl
    || null

  return (
    <Box>
      <style>{DETAIL_STYLES}</style>

      {/* ══════════ HERO ══════════ */}
      <Box sx={{
        position: 'relative',
        minHeight: { xs: 320, md: 480 },
        background: coverUrl
          ? `url(${coverUrl}) center/cover no-repeat`
          : 'linear-gradient(135deg, #0a2e18 0%, #0f4a25 50%, #1a5e32 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        overflow: 'hidden',
      }}>
        {/* Dégradé bas vers haut */}
        <Box sx={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.25) 40%, rgba(5,20,10,0.88) 100%)',
        }} />

        {/* Grille subtile sur photo */}
        <Box sx={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)',
          backgroundSize: '48px 48px', pointerEvents: 'none',
        }} />

        {/* Halo décoratif */}
        <Box sx={{ position: 'absolute', width: 500, height: 500, right: -150, top: -150, borderRadius: '50%', background: `radial-gradient(circle, ${sc.dot}15 0%, transparent 65%)`, pointerEvents: 'none' }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, pb: { xs: 4, md: 6 } }}>
          {/* Retour */}
          <Button
            component={Link}
            to="/activites"
            startIcon={<ArrowLeft size={14} />}
            className="d-fade-1"
            sx={{
              color: 'rgba(255,255,255,0.65)', mb: 3, mt: { xs: 10, md: 12 },
              fontSize: 12.5, fontWeight: 600,
              '&:hover': { color: '#fff', background: 'rgba(255,255,255,0.08)' },
              borderRadius: '20px', px: 1.5,
            }}
          >
            Retour aux activités
          </Button>

          {/* Badge section */}
          <Box className="d-fade-2" sx={{ mb: 1.75 }}>
            <Box sx={{
              display: 'inline-flex', alignItems: 'center', gap: 1,
              px: 1.75, py: 0.55,
              borderRadius: '20px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(8px)',
            }}>
              <Box sx={{ width: 7, height: 7, borderRadius: '50%', background: sc.dot, flexShrink: 0 }} />
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: '1px' }}>
                {sc.label}
              </Typography>
            </Box>
          </Box>

          {/* Titre */}
          <Typography
            className="d-fade-3"
            variant="h1"
            sx={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: { xs: 34, md: 58 }, fontWeight: 700,
              color: '#fff', lineHeight: 1.05, mb: 2, maxWidth: 720,
            }}
          >
            {act.titre}
          </Typography>

          {/* Infos rapides */}
          {photos.length > 0 && (
            <Box className="d-fade-4" sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Camera size={13} color="rgba(255,255,255,0.6)" />
                <Typography sx={{ fontSize: 12.5, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
                  {photos.length} photo{photos.length > 1 ? 's' : ''}
                </Typography>
              </Box>
            </Box>
          )}
        </Container>
      </Box>

      {/* ══════════ CONTENU PRINCIPAL ══════════ */}
      <Box sx={{ background: '#f4f8f5', py: { xs: 5, md: 8 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>

            {/* DESCRIPTION */}
            <Grid item xs={12} md={8}>
              <Box className="d-fade-2" sx={{
                background: '#fff', borderRadius: '24px',
                border: '1px solid rgba(27,122,62,0.1)',
                overflow: 'hidden',
                boxShadow: '0 4px 24px rgba(27,122,62,0.06)',
              }}>
                {/* En-tête description */}
                <Box sx={{
                  px: { xs: 3, md: 4 }, pt: { xs: 3, md: 4 }, pb: 2.5,
                  borderBottom: '1px solid rgba(27,122,62,0.08)',
                  display: 'flex', alignItems: 'center', gap: 1.5,
                }}>
                  <Box sx={{ width: 28, height: 2, background: '#F5A623' }} />
                  <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#F5A623', letterSpacing: '3px', textTransform: 'uppercase' }}>
                    Description
                  </Typography>
                </Box>
                <Box sx={{ px: { xs: 3, md: 4 }, py: 3.5 }}>
                  <Typography sx={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: { xs: 20, md: 26 }, fontWeight: 700,
                    color: '#0c1a10', mb: 2.5, lineHeight: 1.25,
                  }}>
                    À propos de cette activité
                  </Typography>
                  <Box
                    sx={{
                      fontSize: 14.5, color: '#4b5563', lineHeight: 1.9,
                      '& p': { mb: 1.5 },
                      '& ul, & ol': { pl: 2.5 },
                      '& strong': { color: '#0c1a10', fontWeight: 700 },
                    }}
                    dangerouslySetInnerHTML={{ __html: act.description || '<p>Aucune description disponible.</p>' }}
                  />
                </Box>
              </Box>
            </Grid>

            {/* SIDEBAR */}
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>

                {/* Infos carte */}
                <Box className="d-fade-3" sx={{
                  background: '#fff', borderRadius: '20px', p: 3,
                  border: '1px solid rgba(27,122,62,0.1)',
                  boxShadow: '0 4px 24px rgba(27,122,62,0.06)',
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                    <Box sx={{ width: 28, height: 2, background: '#F5A623' }} />
                    <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#F5A623', letterSpacing: '3px', textTransform: 'uppercase' }}>
                      Informations
                    </Typography>
                  </Box>

                  {[
                    { label: 'Section concernée', value: sc.label, valueColor: sc.color },
                    { label: 'Nombre de photos', value: `${photos.length} photo${photos.length > 1 ? 's' : ''}`, valueColor: '#0c1a10' },
                    { label: 'Année scolaire', value: annee, valueColor: '#1B7A3E' },
                  ].map(({ label, value, valueColor }, i) => (
                    <Box key={label} sx={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      py: 1.5,
                      borderBottom: i < 2 ? '1px solid #f4f8f5' : 'none',
                    }}>
                      <Typography sx={{ fontSize: 12.5, color: '#6b7c70' }}>{label}</Typography>
                      <Typography sx={{ fontSize: 13, fontWeight: 700, color: valueColor }}>{value}</Typography>
                    </Box>
                  ))}

                  {/* Badge section coloré */}
                  <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #f4f8f5' }}>
                    <Box sx={{
                      display: 'inline-flex', alignItems: 'center', gap: 1,
                      px: 1.75, py: 0.75, borderRadius: '20px',
                      background: sc.bg, border: `1px solid ${sc.dot}30`,
                    }}>
                      <Box sx={{ width: 7, height: 7, borderRadius: '50%', background: sc.dot }} />
                      <Typography sx={{ fontSize: 12, fontWeight: 700, color: sc.color }}>{sc.label}</Typography>
                    </Box>
                  </Box>
                </Box>

                {/* CTA Inscription — même style que Home InscriptionCTA */}
                <Box className="d-fade-4" sx={{
                  background: 'linear-gradient(160deg, #0a2e18 0%, #0f4a25 55%, #1B7A3E 100%)',
                  borderRadius: '20px', p: 3,
                  position: 'relative', overflow: 'hidden',
                }}>
                  <Box sx={{ position: 'absolute', width: 200, height: 200, right: -60, bottom: -60, borderRadius: '50%', background: 'rgba(245,166,35,0.06)', pointerEvents: 'none' }} />

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <Box sx={{ width: 28, height: 2, background: '#F5A623' }} />
                    <Typography sx={{ fontSize: 10, fontWeight: 800, color: '#F5A623', letterSpacing: '2.5px', textTransform: 'uppercase' }}>
                      {isOpen ? 'Inscriptions ouvertes' : 'Dossier'}
                    </Typography>
                  </Box>

                  <Typography sx={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 22, fontWeight: 700, color: '#fff', mb: 1, lineHeight: 1.2,
                  }}>
                    Inscrire mon enfant
                  </Typography>

                  <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 12.5, mb: 0.5, lineHeight: 1.65 }}>
                    Année scolaire{' '}
                    <Box component="strong" sx={{ color: '#F5A623' }}>{annee}</Box>
                  </Typography>

                  {/* Rentrée avec paramètre réel */}
                  <Box sx={{
                    display: 'flex', alignItems: 'center', gap: 1,
                    mb: 2.5, mt: 0.5,
                    px: 1.5, py: 0.75, borderRadius: '10px',
                    background: 'rgba(245,166,35,0.1)',
                    border: '1px solid rgba(245,166,35,0.2)',
                  }}>
                    <Calendar size={13} color="#F5A623" />
                    <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
                      Rentrée le{' '}
                      <Box component="strong" sx={{ color: '#F5A623' }}>{dateRentree}</Box>
                    </Typography>
                  </Box>

                  {isOpen ? (
                    <Button
                      component={Link}
                      to="/inscription"
                      variant="contained"
                      fullWidth
                      endIcon={<ChevronRight size={15} />}
                      sx={{
                        background: '#F5A623', color: '#0f4a25',
                        fontWeight: 800, py: 1.3, fontSize: 13,
                        borderRadius: '12px',
                        '&:hover': { background: '#e0951f', transform: 'translateY(-1px)' },
                        transition: 'all 0.2s',
                        boxShadow: '0 6px 20px rgba(245,166,35,0.3)',
                      }}
                    >
                      Constituer mon dossier
                    </Button>
                  ) : (
                    <Box sx={{ px: 2, py: 1.5, borderRadius: '12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                      <Typography sx={{ fontSize: 12.5, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
                        Les inscriptions sont actuellement fermées.<br />
                        <Box component="strong" sx={{ color: 'rgba(255,255,255,0.7)' }}>Préparez votre dossier dès maintenant.</Box>
                      </Typography>
                    </Box>
                  )}
                </Box>

              </Box>
            </Grid>
          </Grid>

          {/* ══════════ GALERIE ══════════ */}
          {photos.length > 0 && (
            <Box sx={{ mt: 6 }}>
              {/* Titre galerie */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3.5, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                    <Box sx={{ width: 28, height: 2, background: '#F5A623' }} />
                    <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#F5A623', letterSpacing: '3px', textTransform: 'uppercase' }}>
                      Galerie
                    </Typography>
                  </Box>
                  <Typography sx={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: { xs: 26, md: 36 }, fontWeight: 700, color: '#0c1a10',
                  }}>
                    Photos de l'activité
                  </Typography>
                </Box>
                <Box sx={{
                  display: 'flex', alignItems: 'center', gap: 0.75,
                  px: 2, py: 0.75, borderRadius: '20px',
                  background: 'rgba(27,122,62,0.08)', border: '1px solid rgba(27,122,62,0.15)',
                }}>
                  <Camera size={13} color="#1B7A3E" />
                  <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: '#1B7A3E' }}>
                    {photos.length} photo{photos.length > 1 ? 's' : ''}
                  </Typography>
                </Box>
              </Box>

              {/* Grille photos — toutes en taille uniforme */}
              <Grid container spacing={1.5}>
                {photos.map((photo, idx) => (
                  <Grid
                    item
                    xs={6}
                    sm={4}
                    md={3}
                    key={photo.id}
                  >
                    <Box
                      className="photo-wrap"
                      onClick={() => openLightbox(photo, idx)}
                      sx={{
                        paddingTop: '75%',
                        position: 'relative', borderRadius: '16px',
                        overflow: 'hidden', cursor: 'pointer',
                        background: '#eaf4ee',
                        border: '2px solid transparent',
                        transition: 'border-color 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          borderColor: 'rgba(27,122,62,0.3)',
                          boxShadow: '0 8px 28px rgba(27,122,62,0.18)',
                        },
                      }}
                    >
                      {(photo.displayUrl || photo.fullUrl) ? (
                        <Box
                          component="img"
                          src={photo.displayUrl || photo.fullUrl}
                          alt={`Photo ${idx + 1}`}
                          className="photo-thumb"
                          sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => { e.target.style.display = 'none' }}
                        />
                      ) : (
                        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <ImageIcon size={28} color="#9ca3af" />
                        </Box>
                      )}
                      <Box
                        className="photo-overlay"
                        sx={{
                          position: 'absolute', inset: 0,
                          background: 'linear-gradient(135deg, rgba(15,74,37,0.6), rgba(0,0,0,0.3))',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        <Box sx={{
                          width: 44, height: 44, borderRadius: '50%',
                          background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)',
                          border: '1.5px solid rgba(255,255,255,0.4)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <ImageIcon size={18} color="#fff" />
                        </Box>
                      </Box>

                      {/* Numéro de la photo */}
                      <Box sx={{
                        position: 'absolute', bottom: 8, right: 8,
                        px: 1.25, py: 0.4, borderRadius: '12px',
                        background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
                      }}>
                        <Typography sx={{ fontSize: 10.5, fontWeight: 700, color: '#fff' }}>
                          {idx + 1}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Container>
      </Box>

      {/* ══════════ LIGHTBOX ══════════ */}
      <Dialog
        open={!!lightbox}
        onClose={() => setLightbox(null)}
        maxWidth="md" fullWidth
        PaperProps={{ sx: { background: 'transparent', boxShadow: 'none' } }}
      >
        <Box className="lightbox-enter" sx={{ position: 'relative' }}>
          <Box
            component="img"
            src={lightbox}
            alt="Photo"
            sx={{ width: '100%', borderRadius: '16px', display: 'block', maxHeight: '85vh', objectFit: 'contain' }}
          />

          {/* Fermer */}
          <Box
            onClick={() => setLightbox(null)}
            sx={{
              position: 'absolute', top: 12, right: 12,
              width: 40, height: 40, borderRadius: '50%',
              background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#fff',
              border: '1px solid rgba(255,255,255,0.15)',
              transition: 'background 0.2s',
              '&:hover': { background: 'rgba(0,0,0,0.85)' },
            }}
          >
            <X size={18} />
          </Box>

          {/* Navigation si plusieurs photos */}
          {photos.length > 1 && (
            <>
              <Box
                onClick={() => prevPhoto(photos)}
                sx={{
                  position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  border: '1px solid rgba(255,255,255,0.15)',
                  '&:hover': { background: 'rgba(0,0,0,0.8)' },
                }}
              >
                <ArrowLeft size={16} color="#fff" />
              </Box>
              <Box
                onClick={() => nextPhoto(photos)}
                sx={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  border: '1px solid rgba(255,255,255,0.15)',
                  '&:hover': { background: 'rgba(0,0,0,0.8)' },
                }}
              >
                <ChevronRight size={16} color="#fff" />
              </Box>

              {/* Compteur */}
              <Box sx={{
                position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)',
                px: 2, py: 0.6, borderRadius: '20px',
                background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
              }}>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>
                  {lightboxIdx + 1} / {photos.length}
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </Dialog>
    </Box>
  )
}