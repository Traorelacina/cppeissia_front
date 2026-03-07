// ============================================================
// ACTIVITES LIST - Activités de l'école (événements, sorties, ateliers)
// ============================================================
import { useState, useEffect, useRef, useCallback } from 'react'
import { Box, Container, Typography, Chip, IconButton } from '@mui/material'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { activitesApi } from '@/api/services'
import { LoadingSpinner } from '@/components/common'
import { 
  ArrowRight, 
  Sparkles, 
  Camera, 
  Calendar,
  MapPin,
  Image as ImageIcon,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from 'lucide-react'
import { getImageUrl } from '@/utils/imageHelper'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const ORANGE = '#FF7F27'
const GREEN  = '#1B7A3E'

const ACT_STYLES = `
  @keyframes pulse-dot {
    0%, 100% { box-shadow: 0 0 0 0 rgba(255,127,39,0.5); }
    50%       { box-shadow: 0 0 0 6px rgba(255,127,39,0); }
  }

  .act-track {
    display: flex;
    transition: transform 0.55s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform;
  }

  .act-slide {
    flex: 0 0 auto;
    padding: 0 10px;
    box-sizing: border-box;
  }

  .act-card-inner {
    background: #fff;
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid rgba(27,122,62,0.08);
    display: flex;
    flex-direction: column;
    height: 100%;
    box-shadow: 0 6px 20px -6px rgba(27,122,62,0.12);
    transition: box-shadow 0.35s ease, transform 0.35s ease;
  }
  .act-card-inner:hover {
    box-shadow: 0 22px 48px -10px rgba(27,122,62,0.28);
    transform: translateY(-6px);
  }
  .act-card-inner:hover .act-img {
    transform: scale(1.06);
  }

  .act-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.7s cubic-bezier(0.4,0,0.2,1);
  }

  .nav-btn {
    transition: all 0.25s ease !important;
  }
  .nav-btn:hover  { transform: scale(1.08); }
  .nav-btn:active { transform: scale(0.95); }

  .carousel-dot {
    transition: all 0.3s ease;
    cursor: pointer;
  }
  .carousel-dot:hover { opacity: 0.75; }
`

/* ─── Carte individuelle ─── */
function ActCard({ act, cardWidth }) {
  const [imgErr, setImgErr] = useState(false)
  const imageUrl  = act.photo_couverture ? getImageUrl(act.photo_couverture) : null
  const isUpcoming = act.date_activite && new Date(act.date_activite) > new Date()

  const dateFormatee = act.date_activite
    ? format(new Date(act.date_activite), 'dd MMM yyyy', { locale: fr })
    : 'Date à confirmer'

  return (
    <div className="act-slide" style={{ width: cardWidth }}>
      <div className="act-card-inner" style={{ minHeight: 375 }}>

        {/* IMAGE */}
        <Box sx={{ position: 'relative', height: 190, flexShrink: 0, overflow: 'hidden' }}>
          {imageUrl && !imgErr ? (
            <>
              <img
                className="act-img"
                src={imageUrl}
                alt={act.titre}
                onError={() => setImgErr(true)}
              />
              <Box sx={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(10,26,14,0.45) 0%, transparent 55%)',
                pointerEvents: 'none',
              }} />
            </>
          ) : (
            <Box sx={{
              width: '100%', height: '100%',
              background: 'linear-gradient(145deg, #f0f7f2, #e0ebe4)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 0.75,
            }}>
              <ImageIcon size={32} color={GREEN} style={{ opacity: 0.18 }} />
              <Typography sx={{ color: GREEN, opacity: 0.35, fontSize: 11, fontWeight: 500 }}>
                Image à venir
              </Typography>
            </Box>
          )}

          {/* Badge À VENIR */}
          {isUpcoming && (
            <Box sx={{
              position: 'absolute', top: 11, left: 11,
              px: 1.1, py: 0.35, borderRadius: '10px',
              background: GREEN, color: '#fff',
              fontSize: 9.5, fontWeight: 700, letterSpacing: '0.5px',
              boxShadow: '0 3px 10px rgba(27,122,62,0.35)',
            }}>
              À VENIR
            </Box>
          )}

          {/* Badge photos */}
          {act.media_count > 0 && (
            <Box sx={{
              position: 'absolute', top: 11, right: 11,
              display: 'flex', alignItems: 'center', gap: 0.5,
              px: 1, py: 0.35, borderRadius: '14px',
              background: 'rgba(10,26,14,0.78)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.14)',
            }}>
              <Camera size={11} color="#fff" />
              <Typography sx={{ fontSize: 10.5, fontWeight: 600, color: '#fff' }}>
                {act.media_count} {act.media_count > 1 ? 'photos' : 'photo'}
              </Typography>
            </Box>
          )}
        </Box>

        {/* CONTENU */}
        <Box sx={{ p: 2.25, pt: 1.75, flex: 1, display: 'flex', flexDirection: 'column' }}>

          {/* Meta date + lieu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.85, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.45 }}>
              <Calendar size={12} color={ORANGE} />
              <Typography sx={{ fontSize: 11, color: '#6b7c70' }}>{dateFormatee}</Typography>
            </Box>
            {act.lieu && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                <MapPin size={12} color={ORANGE} />
                <Typography sx={{ fontSize: 11, color: '#6b7c70', maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {act.lieu}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Titre */}
          <Typography sx={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 19, fontWeight: 700, lineHeight: 1.22,
            mb: 0.85, color: '#0c1a10',
          }}>
            <Link to={`/activites/${act.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              {act.titre}
            </Link>
          </Typography>

          {/* Description */}
          <Box
            sx={{
              fontSize: 12.5, color: '#5a6b5e', lineHeight: 1.6, mb: 1.5,
              display: '-webkit-box', WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}
            dangerouslySetInnerHTML={{
              __html: act.description?.substring(0, 95) + (act.description?.length > 95 ? '…' : '') || '',
            }}
          />

          {/* Bouton */}
          <Box sx={{ mt: 'auto', pt: 1.25, borderTop: '1px solid rgba(27,122,62,0.07)', display: 'flex', justifyContent: 'flex-end' }}>
            <Link to={`/activites/${act.slug}`} style={{ textDecoration: 'none' }}>
              <Box sx={{
                display: 'inline-flex', alignItems: 'center', gap: 0.55,
                px: 1.5, py: 0.6, borderRadius: '14px',
                border: '1.5px solid rgba(27,122,62,0.22)',
                fontSize: 11.5, fontWeight: 700, color: GREEN,
                transition: 'all 0.25s',
                '&:hover': { background: ORANGE, borderColor: ORANGE, color: '#0f4a25' },
              }}>
                Voir l'activité
                <ArrowRight size={12} />
              </Box>
            </Link>
          </Box>
        </Box>
      </div>
    </div>
  )
}

/* ─── Carrousel ─── */
function Carousel({ activites }) {
  const [current, setCurrent] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [cardW,   setCardW]   = useState(320)
  const [visible, setVisible] = useState(3)
  const containerRef          = useRef(null)
  const timerRef              = useRef(null)

  // Tri du plus récent au plus ancien
  const sorted = [...activites].sort((a, b) => {
    if (!a.date_activite) return 1
    if (!b.date_activite) return -1
    return new Date(b.date_activite) - new Date(a.date_activite)
  })

  const getVisible = useCallback((w) => {
    if (w < 600)  return 1
    if (w < 900)  return 2
    if (w < 1200) return 3
    return 4
  }, [])

  const maxIndex = Math.max(0, sorted.length - visible)

  // Responsive : recalcul largeur carte
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => {
      const w = el.clientWidth
      const v = getVisible(w)
      setVisible(v)
      setCardW(Math.floor(w / v))
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [getVisible])

  // Clamp current si maxIndex change
  useEffect(() => {
    setCurrent(c => Math.min(c, maxIndex))
  }, [maxIndex])

  // Démarrer / arrêter le timer
  const startTimer = useCallback(() => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCurrent(c => (c >= maxIndex ? 0 : c + 1))
    }, 3500)
  }, [maxIndex])

  useEffect(() => {
    if (playing) startTimer()
    else clearInterval(timerRef.current)
    return () => clearInterval(timerRef.current)
  }, [playing, startTimer])

  const goTo = (idx) => {
    const clamped = Math.max(0, Math.min(idx, maxIndex))
    setCurrent(clamped)
    if (playing) startTimer() // reset timer
  }
  const prev = () => goTo(current === 0 ? maxIndex : current - 1)
  const next = () => goTo(current >= maxIndex ? 0 : current + 1)

  return (
    <Box>
      {/* Barre de contrôles */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5, px: 0.5 }}>

        {/* Compteur */}
        <Typography sx={{ fontSize: 13, color: '#6b7c70', fontWeight: 500 }}>
          <Box component="span" sx={{ fontWeight: 800, color: GREEN, fontSize: 15 }}>
            {current + 1}
          </Box>
          {' / '}{sorted.length}
        </Typography>

        {/* Boutons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Play / Pause */}
          <IconButton
            className="nav-btn"
            onClick={() => setPlaying(p => !p)}
            size="small"
            title={playing ? 'Pause' : 'Lecture'}
            sx={{
              width: 36, height: 36,
              border: '1.5px solid rgba(27,122,62,0.2)',
              color: GREEN, background: '#fff',
              '&:hover': { background: '#f0f7f2' },
            }}
          >
            {playing ? <Pause size={14} /> : <Play size={14} />}
          </IconButton>

          {/* Précédent */}
          <IconButton
            className="nav-btn"
            onClick={prev}
            disabled={sorted.length <= visible}
            size="small"
            sx={{
              width: 40, height: 40,
              border: '1.5px solid rgba(27,122,62,0.22)',
              color: GREEN, background: '#fff',
              '&:hover': { background: '#f0f7f2', borderColor: GREEN },
              '&.Mui-disabled': { opacity: 0.3 },
            }}
          >
            <ChevronLeft size={20} />
          </IconButton>

          {/* Suivant */}
          <IconButton
            className="nav-btn"
            onClick={next}
            disabled={sorted.length <= visible}
            size="small"
            sx={{
              width: 40, height: 40,
              border: `1.5px solid ${GREEN}`,
              color: '#fff', background: GREEN,
              '&:hover': { background: '#0f4a25', borderColor: '#0f4a25' },
              '&.Mui-disabled': { opacity: 0.3 },
            }}
          >
            <ChevronRight size={20} />
          </IconButton>
        </Box>
      </Box>

      {/* Piste carrousel */}
      <Box
        ref={containerRef}
        sx={{ overflow: 'hidden', borderRadius: '16px', pb: 1 }}
      >
        <div
          className="act-track"
          style={{ transform: `translateX(${-(current * cardW)}px)` }}
        >
          {sorted.map((act) => (
            <ActCard key={act.id} act={act} cardWidth={cardW} />
          ))}
        </div>
      </Box>

      {/* Dots de navigation */}
      {maxIndex > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.75, mt: 2.5 }}>
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <Box
              key={i}
              className="carousel-dot"
              onClick={() => goTo(i)}
              sx={{
                height: 8,
                width: i === current ? 24 : 8,
                borderRadius: '8px',
                background: i === current ? ORANGE : 'rgba(27,122,62,0.2)',
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  )
}

/* ─── Page principale ─── */
export default function Activites() {
  const { data, isLoading } = useQuery({
    queryKey: ['activites-public'],
    queryFn:  () => activitesApi.getAll(),
  })

  const activites      = data?.data?.data?.data || []
  const totalActivites = activites.length

  return (
    <Box>
      <style>{ACT_STYLES}</style>

      {/* ══════════ HERO ══════════ */}
      <Box sx={{
        background: 'linear-gradient(135deg, #0f4a25, #1B7A3E)',
        py: { xs: 8, md: 11 },
        px: 3,
        textAlign: 'center',
      }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Box sx={{
              width: 56, height: 56,
              background: ORANGE, borderRadius: '14px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <CalendarDays size={26} color="#0f4a25" />
            </Box>
          </Box>

          <Typography variant="h1" sx={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: { xs: 36, md: 54 }, fontWeight: 700,
            color: '#fff', lineHeight: 1.1, mb: 1.5,
          }}>
            Activités et événements
          </Typography>

          <Typography sx={{
            color: 'rgba(255,255,255,0.65)', fontSize: 14.5,
            maxWidth: 560, mx: 'auto', lineHeight: 1.8, mb: 2.5,
          }}>
            Découvrez toutes les activités organisées par l'école : sorties scolaires, ateliers spéciaux, célébrations et événements pédagogiques.
          </Typography>

          {totalActivites > 0 && (
            <Box sx={{
              display: 'inline-flex', alignItems: 'center', gap: 1,
              px: 2, py: 0.65, borderRadius: '30px',
              background: 'rgba(255,127,39,0.12)',
              border: '1px solid rgba(255,127,39,0.28)',
            }}>
              <Box sx={{ width: 7, height: 7, borderRadius: '50%', background: ORANGE, animation: 'pulse-dot 2.2s ease infinite' }} />
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: ORANGE, letterSpacing: '1px' }}>
                {totalActivites} activité{totalActivites > 1 ? 's' : ''} au programme
              </Typography>
            </Box>
          )}
        </Container>
      </Box>

      {/* ══════════ CARROUSEL ══════════ */}
      <Box sx={{ py: 7, background: '#f8faf9' }}>
        <Container maxWidth="lg">

          {/* En-tête */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Chip
              label="PROGRAMME SCOLAIRE"
              sx={{ bgcolor: 'rgba(255,127,39,0.1)', color: ORANGE, fontWeight: 700, fontSize: 11, letterSpacing: '1.5px', mb: 1.5 }}
            />
            <Typography variant="h2" sx={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: { xs: 28, md: 38 }, fontWeight: 700, color: '#0c1a10', mb: 0.75,
            }}>
              Nos <Box component="span" sx={{ color: ORANGE }}>activités</Box>
            </Typography>
            <Typography sx={{ color: '#6b7c70', fontSize: 14, maxWidth: 500, mx: 'auto' }}>
              {totalActivites > 0
                ? `${totalActivites} activité${totalActivites > 1 ? 's' : ''} — des plus récentes aux plus anciennes`
                : 'Aucune activité pour le moment'}
            </Typography>
          </Box>

          {/* Contenu */}
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <LoadingSpinner />
            </Box>
          ) : activites.length === 0 ? (
            <Box sx={{
              textAlign: 'center', py: 10,
              background: '#fff', borderRadius: '28px',
              border: '1px dashed rgba(27,122,62,0.2)',
            }}>
              <Box sx={{
                width: 72, height: 72, borderRadius: '28px',
                background: '#eaf4ee',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                mx: 'auto', mb: 2.5,
              }}>
                <Sparkles size={36} color={GREEN} style={{ opacity: 0.5 }} />
              </Box>
              <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color: '#0c1a10', mb: 1 }}>
                Aucune activité pour le moment
              </Typography>
              <Typography sx={{ color: '#6b7c70', fontSize: 14 }}>
                Les prochaines activités seront bientôt annoncées
              </Typography>
            </Box>
          ) : (
            <Carousel activites={activites} />
          )}
        </Container>
      </Box>
    </Box>
  )
}