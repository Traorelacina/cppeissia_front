// ============================================================
// ACTIVITE DETAIL - avec galerie photos album
// ============================================================
import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { Box, Container, Grid, Typography, Button, Modal, IconButton } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { activitesApi } from '@/api/services'
import { LoadingSpinner } from '@/components/common'
import {
  ArrowLeft, ArrowRight, X, ChevronLeft, ChevronRight,
  Camera, ZoomIn, Images,
} from 'lucide-react'

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
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
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

  .gallery-thumb {
    position: relative;
    overflow: hidden;
    border-radius: 12px;
    cursor: pointer;
    background: #e0ebe4;
  }
  .gallery-thumb img {
    width: 100%; height: 100%;
    object-fit: cover; display: block;
    transition: transform 0.45s cubic-bezier(0.4,0,0.2,1);
  }
  .gallery-thumb:hover img { transform: scale(1.1); }
  .gallery-thumb .overlay {
    position: absolute; inset: 0;
    background: rgba(10,26,14,0);
    display: flex; align-items: center; justify-content: center;
    transition: background 0.3s;
  }
  .gallery-thumb:hover .overlay {
    background: rgba(10,26,14,0.45);
  }
  .gallery-thumb .overlay-icon {
    opacity: 0; transform: scale(0.7);
    transition: all 0.3s;
  }
  .gallery-thumb:hover .overlay-icon {
    opacity: 1; transform: scale(1);
  }

  .lightbox-img {
    animation: fadeIn 0.25s ease both;
  }

  .lb-nav {
    transition: all 0.2s ease;
  }
  .lb-nav:hover { transform: scale(1.08); }
  .lb-nav:active { transform: scale(0.95); }
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
    id:     m.id ?? m.uuid ?? i,
    thumb:  m.thumb  || m.conversions_urls?.thumb  || m.original_url || m.url || null,
    medium: m.medium || m.conversions_urls?.medium || m.original_url || m.url || null,
    full:   m.url    || m.original_url             || m.conversions_urls?.medium || null,
  }
}

/* ─── Lightbox ─── */
function Lightbox({ photos, startIndex, onClose }) {
  const [idx, setIdx] = useState(startIndex)
  const current = photos[idx]

  const prev = () => setIdx(i => (i === 0 ? photos.length - 1 : i - 1))
  const next = () => setIdx(i => (i === photos.length - 1 ? 0 : i + 1))

  // Fermer avec Échap
  const handleKey = (e) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'ArrowLeft')  prev()
    if (e.key === 'ArrowRight') next()
  }

  return (
    <Modal open onClose={onClose}>
      <Box
        onKeyDown={handleKey}
        tabIndex={0}
        autoFocus
        sx={{
          position: 'fixed', inset: 0,
          background: 'rgba(4,12,7,0.95)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          outline: 'none',
        }}
      >
        {/* Fermer */}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute', top: 16, right: 16,
            color: '#fff', background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            '&:hover': { background: 'rgba(255,255,255,0.15)' },
          }}
        >
          <X size={20} />
        </IconButton>

        {/* Compteur */}
        <Typography sx={{ position: 'absolute', top: 22, left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.55)', fontSize: 13, fontWeight: 600 }}>
          {idx + 1} / {photos.length}
        </Typography>

        {/* Image */}
        <Box sx={{ position: 'relative', maxWidth: '90vw', maxHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {current?.full ? (
            <Box
              key={idx}
              component="img"
              src={current.full}
              alt={`Photo ${idx + 1}`}
              className="lightbox-img"
              sx={{
                maxWidth: '90vw', maxHeight: '80vh',
                objectFit: 'contain', borderRadius: '12px',
                boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
                display: 'block',
              }}
            />
          ) : (
            <Box sx={{ width: 400, height: 300, background: '#1a3a22', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Camera size={48} color="rgba(255,255,255,0.2)" />
            </Box>
          )}
        </Box>

        {/* Navigation */}
        {photos.length > 1 && (
          <>
            <IconButton
              className="lb-nav"
              onClick={prev}
              sx={{
                position: 'absolute', left: { xs: 8, md: 24 },
                color: '#fff', background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.18)',
                width: 48, height: 48,
                '&:hover': { background: 'rgba(255,255,255,0.18)' },
              }}
            >
              <ChevronLeft size={24} />
            </IconButton>
            <IconButton
              className="lb-nav"
              onClick={next}
              sx={{
                position: 'absolute', right: { xs: 8, md: 24 },
                color: '#fff', background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.18)',
                width: 48, height: 48,
                '&:hover': { background: 'rgba(255,255,255,0.18)' },
              }}
            >
              <ChevronRight size={24} />
            </IconButton>
          </>
        )}

        {/* Bande de miniatures */}
        {photos.length > 1 && (
          <Box sx={{
            position: 'absolute', bottom: 20,
            display: 'flex', gap: 1, alignItems: 'center',
            maxWidth: '90vw', overflowX: 'auto', px: 2,
            pb: 1,
            '&::-webkit-scrollbar': { height: 4 },
            '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.2)', borderRadius: 4 },
          }}>
            {photos.map((p, i) => (
              <Box
                key={p.id}
                onClick={() => setIdx(i)}
                sx={{
                  width: 52, height: 36, flexShrink: 0,
                  borderRadius: '8px', overflow: 'hidden', cursor: 'pointer',
                  border: `2px solid ${i === idx ? '#FF7F27' : 'transparent'}`,
                  opacity: i === idx ? 1 : 0.45,
                  transition: 'all 0.2s',
                  background: '#1a3a22',
                  '&:hover': { opacity: 0.85 },
                }}
              >
                {p.thumb && (
                  <Box component="img" src={p.thumb} alt="" sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                )}
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Modal>
  )
}

/* ─── Grille album ─── */
function PhotoAlbum({ photos }) {
  const [lightboxIdx, setLightboxIdx] = useState(null)

  if (!photos.length) return null

  // Disposition : 1ère grande, puis grille
  const [first, ...rest] = photos

  return (
    <Box sx={{ mt: { xs: 5, md: 8 } }}>
      {/* En-tête section */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ width: 40, height: 2.5, background: '#FF7F27', borderRadius: 2 }} />
          <Typography sx={{ fontSize: 10.5, fontWeight: 800, color: '#FF7F27', letterSpacing: '3px', textTransform: 'uppercase' }}>
            Album photos
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.75, py: 0.65, borderRadius: '20px', background: 'rgba(27,122,62,0.08)', border: '1px solid rgba(27,122,62,0.15)' }}>
          <Camera size={13} color="#1B7A3E" />
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#1B7A3E' }}>
            {photos.length} photo{photos.length > 1 ? 's' : ''}
          </Typography>
        </Box>
      </Box>

      {/* Layout galerie */}
      <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' }, gridAutoRows: '180px' }}>
        {/* Photo principale — double colonne + double ligne */}
        <Box
          className="gallery-thumb"
          onClick={() => setLightboxIdx(0)}
          sx={{ gridColumn: { xs: 'span 2', sm: 'span 2' }, gridRow: 'span 2', borderRadius: '16px !important' }}
        >
          {first.medium ? (
            <img src={first.medium} alt="Photo principale" />
          ) : (
            <Box sx={{ width: '100%', height: '100%', background: '#dde8e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Camera size={40} color="#9ab8a5" />
            </Box>
          )}
          <div className="overlay">
            <div className="overlay-icon">
              <ZoomIn size={32} color="#fff" />
            </div>
          </div>
        </Box>

        {/* Photos secondaires */}
        {rest.map((photo, i) => {
          const isLastVisible = i === 4 && photos.length > 6
          return (
            <Box
              key={photo.id}
              className="gallery-thumb"
              onClick={() => setLightboxIdx(i + 1)}
              sx={{ borderRadius: '12px !important' }}
            >
              {photo.thumb ? (
                <img src={photo.thumb} alt={`Photo ${i + 2}`} />
              ) : (
                <Box sx={{ width: '100%', height: '100%', background: '#dde8e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Camera size={24} color="#9ab8a5" />
                </Box>
              )}

              {/* "+N" sur la dernière visible si plus de 6 photos */}
              {isLastVisible ? (
                <Box sx={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(4,12,7,0.72)',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: 0.5,
                }}>
                  <Images size={22} color="#fff" />
                  <Typography sx={{ fontSize: 20, fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                    +{photos.length - 5}
                  </Typography>
                  <Typography sx={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                    photos
                  </Typography>
                </Box>
              ) : (
                <div className="overlay">
                  <div className="overlay-icon">
                    <ZoomIn size={22} color="#fff" />
                  </div>
                </div>
              )}
            </Box>
          )
        })}
      </Box>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <Lightbox
          photos={photos}
          startIndex={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
        />
      )}
    </Box>
  )
}

/* ─── Page principale ─── */
export default function ActiviteDetail() {
  const { slug } = useParams()

  const { data, isLoading } = useQuery({
    queryKey: ['activite-detail', slug],
    queryFn:  () => activitesApi.getBySlug(slug),
  })

  const act = data?.data?.data

  const rawPhotos = act?.photos || act?.media || act?.images || []
  const photos    = rawPhotos.map(normalizePhoto).filter(p => p.thumb || p.full)

  // Photo de couverture : première photo ou champ dédié
  const coverUrl = act?.photo_couverture
    || photos[0]?.medium
    || photos[0]?.full
    || null

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

      {/* ══════════ HERO ══════════ */}
      {coverUrl ? (
        <Box
          className="photo-container"
          sx={{
            position: 'relative', width: '100%',
            height: { xs: 280, sm: 420, md: 560 },
            overflow: 'hidden', background: '#0a2e18',
          }}
        >
          <Box
            component="img" src={coverUrl} alt={act.titre}
            className="main-photo d-hero"
            sx={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
            onError={(e) => { e.target.style.display = 'none' }}
          />
          <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, transparent 30%, rgba(4,16,9,0.80) 100%)' }} />

          {/* Badge nb photos */}
          {photos.length > 1 && (
            <Box sx={{
              position: 'absolute', top: 20, right: 20,
              display: 'flex', alignItems: 'center', gap: 0.75,
              px: 1.75, py: 0.75, borderRadius: '20px',
              background: 'rgba(10,26,14,0.75)', backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.15)',
            }}>
              <Camera size={14} color="#fff" />
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>
                {photos.length} photos
              </Typography>
            </Box>
          )}

          {/* Titre overlay bas */}
          <Container maxWidth="lg" sx={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', pb: { xs: 4, md: 5.5 }, width: '100%' }}>
            <Box className="d-fade-1" sx={{ mb: 1.5 }}>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 1.5, py: 0.5, borderRadius: '20px', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.22)', backdropFilter: 'blur(10px)' }}>
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: sc.dot }} />
                <Typography sx={{ fontSize: 10, fontWeight: 800, color: '#fff', letterSpacing: '1.5px', textTransform: 'uppercase' }}>{sc.label}</Typography>
              </Box>
            </Box>
            <Typography className="d-fade-2" component="h1" sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: { xs: 32, sm: 44, md: 58 }, fontWeight: 700, color: '#fff', lineHeight: 1.05, maxWidth: 820, textShadow: '0 2px 24px rgba(0,0,0,0.25)' }}>
              {act.titre}
            </Typography>
          </Container>
        </Box>
      ) : (
        <Box sx={{ background: 'linear-gradient(135deg, #0a2e18 0%, #0f4a25 60%, #1B7A3E 100%)', pt: { xs: 10, md: 14 }, pb: { xs: 5, md: 7 }, position: 'relative', overflow: 'hidden' }}>
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
            component={Link} to="/activites"
            className="back-btn"
            startIcon={<ArrowLeft size={14} />}
            sx={{ color: '#8fa99b', fontWeight: 600, fontSize: 13, px: 0, '&:hover': { color: '#1B7A3E', background: 'transparent' } }}
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

            {coverUrl && (
              <Typography className="d-fade-2" sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: { xs: 28, md: 40 }, fontWeight: 700, color: '#0c1a10', lineHeight: 1.12, mb: 3.5 }}>
                {act.titre}
              </Typography>
            )}

            <Box
              className="d-fade-3"
              sx={{
                fontSize: { xs: 15, md: 16.5 }, color: '#3d5244', lineHeight: 1.95,
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
              <Box sx={{ background: '#fff', borderRadius: '24px', border: '1px solid rgba(27,122,62,0.1)', overflow: 'hidden', boxShadow: '0 8px 40px rgba(27,122,62,0.07)', mb: 3 }}>
                {/* Bandeau section */}
                <Box sx={{ background: `linear-gradient(120deg, ${sc.color}14 0%, ${sc.dot}0d 100%)`, borderBottom: `3px solid ${sc.dot}20`, px: 3.5, py: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 42, height: 42, borderRadius: '50%', background: sc.bg, border: `2px solid ${sc.dot}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', background: sc.dot }} />
                  </Box>
                  <Typography sx={{ fontSize: 15, fontWeight: 700, color: sc.color, lineHeight: 1 }}>{sc.label}</Typography>
                </Box>

                <Box sx={{ px: 3.5, py: 2.5 }}>
                  {act.date_activite && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2, borderBottom: '1px solid #f0f5f2' }}>
                      <Typography sx={{ fontSize: 12.5, color: '#8fa99b', fontWeight: 500 }}>Date</Typography>
                      <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: '#0c1a10' }}>
                        {act.date_formatted || new Date(act.date_activite).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </Typography>
                    </Box>
                  )}

                  {/* Nombre de photos */}
                  {photos.length > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
                      <Typography sx={{ fontSize: 12.5, color: '#8fa99b', fontWeight: 500 }}>Album</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <Camera size={14} color="#1B7A3E" />
                        <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: '#0c1a10' }}>
                          {photos.length} photo{photos.length > 1 ? 's' : ''}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>

                <Box sx={{ px: 3.5, pb: 3.5 }}>
                  <Button
                    component={Link} to="/activites" fullWidth
                    endIcon={<ArrowRight size={15} />}
                    sx={{
                      background: 'linear-gradient(135deg, #0f4a25, #1B7A3E)',
                      color: '#fff', fontWeight: 700, fontSize: 13.5,
                      py: 1.5, borderRadius: '14px',
                      boxShadow: '0 6px 20px rgba(15,74,37,0.22)',
                      transition: 'all 0.22s',
                      '&:hover': { background: 'linear-gradient(135deg, #0a2e18, #0f4a25)', transform: 'translateY(-1px)', boxShadow: '0 10px 28px rgba(15,74,37,0.32)' },
                    }}
                  >
                    Voir toutes les activités
                  </Button>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* ══════════ ALBUM PHOTOS ══════════ */}
        <PhotoAlbum photos={photos} />

      </Container>

      {/* ══════════ FOOTER ══════════ */}
      <Box sx={{ background: 'linear-gradient(135deg, #0a2e18 0%, #0f4a25 100%)', mt: { xs: 4, md: 6 }, py: { xs: 4, md: 5 } }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 3 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                <Box sx={{ width: 24, height: 2, background: '#F5A623' }} />
                <Typography sx={{ fontSize: 9.5, fontWeight: 800, color: '#F5A623', letterSpacing: '2.5px', textTransform: 'uppercase' }}>CPPE Issia</Typography>
              </Box>
              <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: { xs: 20, md: 24 }, fontWeight: 700, color: '#fff' }}>
                Découvrez nos autres activités
              </Typography>
            </Box>
            <Button
              component={Link} to="/activites"
              endIcon={<ArrowRight size={15} />}
              sx={{
                background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.2)',
                color: '#fff', fontWeight: 700, fontSize: 13,
                px: 3, py: 1.3, borderRadius: '30px', backdropFilter: 'blur(8px)',
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