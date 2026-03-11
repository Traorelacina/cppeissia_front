import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Chip,
  IconButton,
} from '@mui/material'
import {
  ArrowRight,
  Calendar,
  Users,
  MapPin,
  Phone,
  Clock,
  CheckCircle,
  Baby,
  Sprout,
  Leaf,
  TreePine,
  ChevronRight,
  ChevronLeft,
  Quote,
  Bus,
  Shirt,
  Package,
  CreditCard,
  Utensils,
  ShieldCheck,
  Image as ImageIcon,
  CalendarDays,
  Pause,
  Play,
  Megaphone,
  Radio,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { actualitesApi, parametresApi, activitesApi } from '@/api/services'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import ecoleImage from '../../assets/ecole.jpg'
import { getImageUrl } from '@/utils/imageHelper'

const ORANGE = '#FF7F27'
const GREEN  = '#1B7A3E'

// ========================
// HERO
// ========================
function Hero({ params }) {
  const annee  = params?.annee_scolaire_courante || '2025-2026'
  const isOpen = params?.inscriptions_ouvertes !== 'false'

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a2e18 0%, #0f4a25 50%, #1a5e32 100%)',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '55% 45%' },
        gridTemplateRows: { xs: 'auto auto', md: '1fr' },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none' }} />
      <Box sx={{ position: 'absolute', width: 600, height: 600, right: -200, top: -200, borderRadius: '50%', background: `radial-gradient(circle, rgba(255,127,39,0.1) 0%, transparent 70%)`, pointerEvents: 'none' }} />

      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', px: { xs: 3, md: 5 }, py: { xs: 10, md: 6 }, position: 'relative', zIndex: 1 }}>
        <Chip
          label="🇨🇮  Ministère de la Femme, de la Famille et de l'Enfant"
          size="small"
          sx={{ mb: 3, background: `rgba(255,127,39,0.12)`, border: `1px solid rgba(255,127,39,0.3)`, color: ORANGE, fontWeight: 600, fontSize: 11, alignSelf: 'flex-start' }}
        />
        <Typography variant="h1" sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: { xs: 40, md: 60 }, fontWeight: 700, color: '#fff', lineHeight: 1.0, mb: 2, animation: 'fadeInUp 0.7s ease forwards' }}>
          Centre de{' '}
          <Box component="em" sx={{ color: ORANGE, fontStyle: 'italic' }}>Protection</Box>
          <br />de la Petite Enfance
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: { xs: 13, md: 14 }, lineHeight: 1.8, maxWidth: 380, mb: 4, borderLeft: `3px solid ${ORANGE}`, pl: 2, animation: 'fadeInUp 0.7s 0.15s ease both' }}>
          Accueil des enfants de{' '}
          <Box component="strong" sx={{ color: ORANGE }}>1 an 6 mois à 5 ans</Box>{' '}
          dans le Complexe Socio-Éducatif d'Issia, Haut-Sassandra, Côte d'Ivoire.
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', animation: 'fadeInUp 0.7s 0.3s ease both' }}>
          <Button component={Link} to="/presentation" variant="outlined"
            sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.2)', px: 3, py: 1.25, fontSize: 13, '&:hover': { background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.4)' } }}>
            Découvrir le CPPE
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', px: { xs: 3, md: 4 }, py: { xs: 4, md: 6 }, pb: { xs: 6, md: 6 }, position: 'relative', zIndex: 1 }}>
        <Box sx={{ position: 'absolute', width: 'calc(100% - 56px)', aspectRatio: '1 / 1', maxWidth: 420, border: `2px solid rgba(255,127,39,0.4)`, borderRadius: '24px', top: '50%', left: '50%', transform: 'translate(calc(-50% + 10px), calc(-50% + 10px))', pointerEvents: 'none', display: { xs: 'none', md: 'block' } }} />
        <Box sx={{ width: '100%', maxWidth: { xs: 320, md: 420 }, aspectRatio: '1 / 1', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)', position: 'relative', flexShrink: 0 }}>
          <Box component="img" src={ecoleImage} alt="École CPPE Issia"
            sx={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block', transition: 'transform 8s ease', '&:hover': { transform: 'scale(1.04)' } }} />
          <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(to top, rgba(10,46,24,0.7) 0%, transparent 100%)', pointerEvents: 'none' }} />
          {isOpen && (
            <Box sx={{ position: 'absolute', bottom: 18, left: 18, background: `rgba(255,127,39,0.95)`, backdropFilter: 'blur(8px)', borderRadius: '10px', px: 1.75, py: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 7, height: 7, borderRadius: '50%', background: '#0f4a25', animation: 'pulse-dot 2s infinite' }} />
              <Typography sx={{ fontSize: 11.5, fontWeight: 800, color: '#0f4a25' }}>Inscriptions {annee} ouvertes</Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}

// ========================
// FLASH TICKER STYLES
// ========================
const TICKER_STYLES = `
  @keyframes pulse-dot {
    0%, 100% { transform: scale(1); opacity: 1; }
    50%       { transform: scale(1.5); opacity: 0.5; }
  }
  @keyframes ticker-scroll {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .flash-ticker-track {
    display: flex;
    align-items: center;
    white-space: nowrap;
    animation: ticker-scroll 18s linear infinite;
    will-change: transform;
  }
  .flash-ticker-track:hover {
    animation-play-state: paused;
  }
  .flash-ticker-sep {
    display: inline-block;
    width: 5px; height: 5px;
    border-radius: 50%;
    background: rgba(15,74,37,0.45);
    margin: 0 18px;
    flex-shrink: 0;
    vertical-align: middle;
  }
`

// Composant réutilisable (Home InfoBar + Footer)
export function FlashTicker({ params, flashItems = [] }) {
  const isOpen      = params?.inscriptions_ouvertes !== 'false'
  const annee       = params?.annee_scolaire_courante || '2025-2026'
  const horaires    = params?.horaires || 'du lundi au vendredi de 7h30 à 16h30'
  const dateRentree = params?.date_rentree || '06 octobre 2025'

  // Construit la liste des items du ticker
  const tickerItems = [
    ...(isOpen ? [{
      id: '__inscription__',
      isInscription: true,
      text: `Inscriptions ${annee} ouvertes — ${horaires.charAt(0).toUpperCase() + horaires.slice(1)} · Rentrée le ${dateRentree}`,
    }] : []),
    ...flashItems
      .slice()
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .map(a => ({
        id: a.id,
        text: (a.contenu || '').replace(/\*\*|__|_/g, '').trim(),
        isInscription: false,
      }))
      .filter(a => a.text),
  ]

  if (!tickerItems.length) return null

  // Duplique pour boucle seamless
  const doubled = [...tickerItems, ...tickerItems]

  return (
    <Box sx={{ background: ORANGE, py: 0, overflow: 'hidden', height: 38, display: 'flex', alignItems: 'center', position: 'relative' }}>
      <style>{TICKER_STYLES}</style>

      {/* Badge fixe gauche */}
      <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 1, px: 2, height: '100%', background: '#0f4a25', zIndex: 2, borderRight: '2px solid rgba(255,127,39,0.4)' }}>
        <Radio size={13} color="#fff" />
        <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
          Flash infos
        </Typography>
      </Box>

      {/* Piste défilante */}
      <Box sx={{ flex: 1, overflow: 'hidden', height: '100%', display: 'flex', alignItems: 'center' }}>
        <div className="flash-ticker-track">
          {doubled.map((item, idx) => (
            <Box
              key={`${item.id}-${idx}`}
              component="span"
              sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 0 }}
            >
              {item.isInscription && (
                <Box component="span" sx={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: '#0f4a25', mr: 1, animation: 'pulse-dot 2s infinite', verticalAlign: 'middle', flexShrink: 0 }} />
              )}
              <Typography
                component="span"
                sx={{
                  color: '#0f4a25',
                  fontWeight: item.isInscription ? 800 : 600,
                  fontSize: 12.5,
                  lineHeight: '38px',
                }}
              >
                {item.text}
              </Typography>
              <span className="flash-ticker-sep" />
            </Box>
          ))}
        </div>
      </Box>

    </Box>
  )
}

// ========================
// INFO BAR
// ========================
function InfoBar({ params, flashItems }) {
  return <FlashTicker params={params} flashItems={flashItems} />
}

// ========================
// MOT DU DIRECTEUR
// ========================
function MotDirecteurSection({ params }) {
  const nom   = params?.nom_directeur  || 'Le Directeur'
  const photo = params?.photo_directeur
  const texte = params?.mot_directeur  ||
    "Chers parents, chers enfants, bienvenue au Centre de Protection de la Petite Enfance d'Issia."

  const words   = texte.replace(/\n/g, ' ').trim().split(/\s+/)
  const teaser  = words.length > 12 ? words.slice(0, 12).join(' ') + '…' : words.join(' ')

  return (
    <Box sx={{ background: '#fff', py: { xs: 6, md: 8 } }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 5 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 1 }}>
            <Box sx={{ width: 28, height: 2, background: ORANGE }} />
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: ORANGE, letterSpacing: '3px', textTransform: 'uppercase' }}>Message officiel</Typography>
            <Box sx={{ width: 28, height: 2, background: ORANGE }} />
          </Box>
          <Typography variant="h2" sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: { xs: 28, md: 40 }, fontWeight: 700, color: '#0c1a10' }}>
            Mot du Directeur
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, borderRadius: '28px', overflow: 'hidden', border: '1px solid rgba(27,122,62,0.12)', boxShadow: '0 8px 40px rgba(27,122,62,0.08)', height: { md: 300 } }}>
          <Box sx={{ width: { xs: '100%', md: '38%' }, flexShrink: 0, background: 'linear-gradient(160deg, #0a2e18 0%, #0f4a25 55%, #1B7A3E 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, py: { xs: 4, md: 0 }, px: 3, position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ position: 'absolute', width: 260, height: 260, borderRadius: '50%', background: `rgba(255,127,39,0.06)`, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />
            <Box sx={{ width: { xs: 140, md: 160 }, height: { xs: 140, md: 160 }, flexShrink: 0, borderRadius: '50%', border: `5px solid ${ORANGE}`, boxShadow: `0 0 0 10px rgba(255,127,39,0.1), 0 12px 40px rgba(0,0,0,0.4)`, overflow: 'hidden', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
              {photo ? (
                <Box component="img" src={getImageUrl(photo)} alt={nom} sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<span style="font-size:64px;">👤</span>'; }} />
              ) : (
                <Typography sx={{ fontSize: 64, lineHeight: 1 }}>👤</Typography>
              )}
            </Box>
            <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: { xs: 18, md: 20 }, fontWeight: 700, color: '#fff', lineHeight: 1.2, mb: 0.5 }}>{nom}</Typography>
              <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', mb: 1.5 }}>Directeur du CPPE d'Issia</Typography>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, px: 1.75, py: 0.5, background: `rgba(255,127,39,0.14)`, borderRadius: '20px', border: `1px solid rgba(255,127,39,0.3)` }}>
                <Box sx={{ width: 5, height: 5, borderRadius: '50%', background: ORANGE }} />
                <Typography sx={{ fontSize: 10, color: ORANGE, fontWeight: 700, letterSpacing: '0.5px' }}>MFFE · Côte d'Ivoire</Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ flex: 1, background: 'linear-gradient(135deg, #f4f8f5 0%, #eaf4ee 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', px: { xs: 3, md: 5 }, py: { xs: 4, md: 0 }, position: 'relative', overflow: 'hidden' }}>
            <Quote size={120} color="#1B7A3E" style={{ opacity: 0.04, position: 'absolute', top: -10, right: 10, pointerEvents: 'none' }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2.5 }}>
              <Box sx={{ width: 28, height: 3, background: `linear-gradient(90deg, ${ORANGE}, #1B7A3E)`, borderRadius: 2 }} />
              <Typography sx={{ fontSize: 10, fontWeight: 700, color: ORANGE, textTransform: 'uppercase', letterSpacing: '2px' }}>Message du directeur</Typography>
            </Box>
            <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: { xs: 22, md: 28 }, fontWeight: 600, fontStyle: 'italic', lineHeight: 1.55, color: '#2d3a30', mb: 3, position: 'relative', zIndex: 1 }}>
              « {teaser} »
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 38, height: 38, borderRadius: '50%', border: `2px solid ${ORANGE}`, overflow: 'hidden', background: '#eaf4ee', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {photo ? (
                    <Box component="img" src={getImageUrl(photo)} alt={nom} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<span style="font-size:16px;">👤</span>'; }} />
                  ) : (
                    <Typography sx={{ fontSize: 16 }}>👤</Typography>
                  )}
                </Box>
                <Box>
                  <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, fontWeight: 700, color: '#1B7A3E', lineHeight: 1.2 }}>{nom}</Typography>
                  <Typography sx={{ fontSize: 11, color: '#6b7c70' }}>CPPE d'Issia — Haut-Sassandra</Typography>
                </Box>
              </Box>
              <Button component={Link} to="/mot-du-directeur" variant="contained" endIcon={<ChevronRight size={14} />}
                sx={{ background: 'linear-gradient(135deg, #0f4a25, #1B7A3E)', color: '#fff', fontWeight: 700, fontSize: 12, borderRadius: '20px', px: 2.5, py: 1, boxShadow: '0 4px 16px rgba(15,74,37,0.3)', '&:hover': { background: 'linear-gradient(135deg, #0a2e18, #0f4a25)', transform: 'translateY(-1px)' }, transition: 'all 0.2s' }}>
                Lire le message complet
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

// ========================
// ACTIVITÉS CAROUSEL
// ========================
const CAROUSEL_STYLES = `
  @keyframes act-fade-in {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse-dot-act {
    0%, 100% { box-shadow: 0 0 0 0 rgba(255,127,39,0.5); }
    50%       { box-shadow: 0 0 0 5px rgba(255,127,39,0); }
  }

  .act-home-track {
    display: flex;
    transition: transform 0.55s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform;
  }

  .act-home-slide {
    flex: 0 0 auto;
    padding: 0 8px;
    box-sizing: border-box;
  }

  .act-home-card {
    position: relative;
    border-radius: 18px;
    overflow: hidden;
    cursor: pointer;
    height: 260px;
    background: #1a3a22;
    box-shadow: 0 8px 28px rgba(0,0,0,0.22);
    transition: transform 0.35s ease, box-shadow 0.35s ease;
    display: block;
    text-decoration: none;
  }
  .act-home-card:hover {
    transform: translateY(-6px) scale(1.01);
    box-shadow: 0 20px 48px rgba(0,0,0,0.38);
  }
  .act-home-card img {
    width: 100%; height: 100%;
    object-fit: cover; display: block;
    transition: transform 0.7s cubic-bezier(0.4,0,0.2,1);
  }
  .act-home-card:hover img {
    transform: scale(1.08);
  }
  .act-home-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(4,14,8,0.88) 0%, rgba(4,14,8,0.18) 55%, transparent 100%);
    transition: background 0.3s;
  }
  .act-home-card:hover .act-home-overlay {
    background: linear-gradient(to top, rgba(4,14,8,0.95) 0%, rgba(4,14,8,0.3) 60%, transparent 100%);
  }

  .act-home-nav {
    transition: all 0.22s ease !important;
  }
  .act-home-nav:hover  { transform: scale(1.1) !important; }
  .act-home-nav:active { transform: scale(0.94) !important; }

  .act-home-dot { transition: all 0.3s ease; cursor: pointer; }
`

function ActiviteCard({ act, cardWidth }) {
  const [imgErr, setImgErr] = useState(false)
  const imageUrl = act.photo_couverture ? getImageUrl(act.photo_couverture) : null
  const isUpcoming = act.date_activite && new Date(act.date_activite) > new Date()

  const dateStr = act.date_activite
    ? format(new Date(act.date_activite), 'dd MMM yyyy', { locale: fr })
    : null

  return (
    <div className="act-home-slide" style={{ width: cardWidth }}>
      <Link to={`/activites/${act.slug}`} className="act-home-card">
        {imageUrl && !imgErr ? (
          <img
            src={imageUrl}
            alt={act.titre}
            onError={() => setImgErr(true)}
          />
        ) : (
          <Box sx={{ width: '100%', height: '100%', background: 'linear-gradient(145deg, #1a3a22, #0f2a18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ImageIcon size={40} color="rgba(255,255,255,0.12)" />
          </Box>
        )}

        <div className="act-home-overlay" />

        {/* Badge À VENIR */}
        {isUpcoming && (
          <Box sx={{ position: 'absolute', top: 12, left: 12, px: 1.1, py: 0.35, borderRadius: '10px', background: GREEN, color: '#fff', fontSize: 9.5, fontWeight: 700, letterSpacing: '0.5px', boxShadow: '0 3px 10px rgba(27,122,62,0.4)', zIndex: 2 }}>
            À VENIR
          </Box>
        )}

        {/* Infos bas */}
        <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, p: 2, zIndex: 2 }}>
          {dateStr && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.75 }}>
              <Calendar size={11} color={ORANGE} />
              <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
                {dateStr}
              </Typography>
            </Box>
          )}
          <Typography sx={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 17, fontWeight: 700,
            color: '#fff', lineHeight: 1.25,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {act.titre}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mt: 1 }}>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: ORANGE }}>
              Voir l'activité
            </Typography>
            <ChevronRight size={11} color={ORANGE} />
          </Box>
        </Box>
      </Link>
    </div>
  )
}

function ActivitesCarouselSection({ activites }) {
  const [current, setCurrent] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [cardW,   setCardW]   = useState(280)
  const [visible, setVisible] = useState(3)
  const containerRef          = useRef(null)
  const timerRef              = useRef(null)

  const sorted = [...activites].sort((a, b) => {
    if (!a.date_activite) return 1
    if (!b.date_activite) return -1
    return new Date(b.date_activite) - new Date(a.date_activite)
  })

  const getVisible = useCallback((w) => {
    if (w < 500)  return 1
    if (w < 780)  return 2
    if (w < 1100) return 3
    return 4
  }, [])

  const maxIndex = Math.max(0, sorted.length - visible)

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

  useEffect(() => {
    setCurrent(c => Math.min(c, maxIndex))
  }, [maxIndex])

  const startTimer = useCallback(() => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCurrent(c => (c >= maxIndex ? 0 : c + 1))
    }, 3800)
  }, [maxIndex])

  useEffect(() => {
    if (playing && sorted.length > visible) startTimer()
    else clearInterval(timerRef.current)
    return () => clearInterval(timerRef.current)
  }, [playing, startTimer, sorted.length, visible])

  const goTo = (idx) => {
    setCurrent(Math.max(0, Math.min(idx, maxIndex)))
    if (playing) startTimer()
  }
  const prev = () => goTo(current === 0 ? maxIndex : current - 1)
  const next = () => goTo(current >= maxIndex ? 0 : current + 1)

  if (!sorted.length) return null

  return (
    <Box sx={{ background: 'linear-gradient(160deg, #0a2e18 0%, #0f4a25 50%, #1a5e32 100%)', py: { xs: 4, md: 5 }, position: 'relative', overflow: 'hidden' }}>
      <style>{CAROUSEL_STYLES}</style>

      {/* Grille déco */}
      <Box sx={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none' }} />
      <Box sx={{ position: 'absolute', width: 500, height: 500, right: -150, bottom: -150, borderRadius: '50%', background: `radial-gradient(circle, rgba(255,127,39,0.07) 0%, transparent 65%)`, pointerEvents: 'none' }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>

        {/* En-tête */}
        <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <Box sx={{ width: 28, height: 2, background: ORANGE }} />
              <Typography sx={{ fontSize: 10.5, fontWeight: 700, color: ORANGE, letterSpacing: '3px', textTransform: 'uppercase' }}>
                Vie scolaire
              </Typography>
            </Box>
            <Typography variant="h2" sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: { xs: 28, md: 40 }, fontWeight: 700, color: '#f0f7f2', lineHeight: 1 }}>
              Nos activités
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Compteur */}
            <Typography sx={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontWeight: 500, mr: 0.5 }}>
              <Box component="span" sx={{ fontWeight: 800, color: ORANGE, fontSize: 15 }}>{current + 1}</Box>
              {' / '}{sorted.length}
            </Typography>

            {/* Play/Pause */}
            <IconButton
              className="act-home-nav"
              onClick={() => setPlaying(p => !p)}
              size="small"
              sx={{ width: 34, height: 34, border: '1.5px solid rgba(255,255,255,0.5)', color: '#fff', background: 'rgba(255,255,255,0.12)', '&:hover': { background: 'rgba(255,255,255,0.25)', borderColor: '#fff' } }}
            >
              {playing ? <Pause size={13} /> : <Play size={13} />}
            </IconButton>

            {/* Précédent */}
            <IconButton
              className="act-home-nav"
              onClick={prev}
              disabled={sorted.length <= visible}
              size="small"
              sx={{ width: 38, height: 38, border: '1.5px solid rgba(255,255,255,0.55)', color: '#0f4a25', background: 'rgba(255,255,255,0.88)', '&:hover': { background: '#fff', borderColor: '#fff' }, '&.Mui-disabled': { opacity: 0.25 } }}
            >
              <ChevronLeft size={18} />
            </IconButton>

            {/* Suivant */}
            <IconButton
              className="act-home-nav"
              onClick={next}
              disabled={sorted.length <= visible}
              size="small"
              sx={{ width: 38, height: 38, background: ORANGE, border: `1.5px solid ${ORANGE}`, color: '#0f4a25', '&:hover': { background: '#e06a1a', borderColor: '#e06a1a' }, '&.Mui-disabled': { opacity: 0.25 } }}
            >
              <ChevronRight size={18} />
            </IconButton>
          </Box>
        </Box>

        {/* Piste carrousel */}
        <Box ref={containerRef} sx={{ overflow: 'hidden' }}>
          <div
            className="act-home-track"
            style={{ transform: `translateX(${-(current * cardW)}px)` }}
          >
            {sorted.map(act => (
              <ActiviteCard key={act.id} act={act} cardWidth={cardW} />
            ))}
          </div>
        </Box>

        {/* Dots */}
        {maxIndex > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.75, mt: 3 }}>
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <Box
                key={i}
                className="act-home-dot"
                onClick={() => goTo(i)}
                sx={{ height: 6, width: i === current ? 22 : 6, borderRadius: '6px', background: i === current ? ORANGE : 'rgba(255,255,255,0.2)' }}
              />
            ))}
          </Box>
        )}

        {/* Bouton voir tout */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            component={Link}
            to="/activites"
            endIcon={<ChevronRight size={14} />}
            sx={{ background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.55)', color: '#fff', fontWeight: 700, fontSize: 13, borderRadius: '30px', px: 3.5, py: 1, '&:hover': { background: 'rgba(255,255,255,0.22)', borderColor: '#fff' } }}
          >
            Voir toutes les activités
          </Button>
        </Box>
      </Container>
    </Box>
  )
}

// ========================
// SECTIONS
// ========================
const SECTIONS_DATA = [
  { icon: Baby, label: 'Crèche', sublabel: 'Section Spéciale', age: '1 an 6 mois — 2 ans 11 mois', href: '/sections/creche', color: '#eaf4ee', accent: '#1B7A3E', darkAccent: '#0f4a25', desc: 'Éveil sensoriel, jeux libres et motricité dans un cadre doux et sécurisant.', tags: ['Éveil sensoriel', 'Motricité', 'Jeux libres'], num: '25', numLabel: 'places', fournitures: ['01 Paquet de rame', '01 Papier hygiénique (Lotus ou Lisse)', '01 Paquet de savon Omo (500 g)', '01 Pot de javel (1 L)'] },
  { icon: Sprout, label: 'Petite Section', sublabel: 'PS', age: '3 ans — 3 ans 11 mois', href: '/sections/petite-section', color: '#fff8ee', accent: ORANGE, darkAccent: '#cc6400', desc: 'Langage oral, dessin et premières découvertes collectives pour les tout-petits.', tags: ['Langage oral', 'Dessin', 'Socialisation'], num: '40', numLabel: 'places', fournitures: ['01 Paquet de rame', '01 Papier hygiénique (Lotus ou Lisse)', '01 Paquet de savon Omo (500 g)', '01 Pot de javel (1 L)'] },
  { icon: Leaf, label: 'Moyenne Section', sublabel: 'MS', age: '4 ans — 4 ans 11 mois', href: '/sections/moyenne-section', color: '#eff6ff', accent: '#1565c0', darkAccent: '#0d47a1', desc: "Pré-écriture, numération jusqu'à 10 et découverte de l'environnement.", tags: ['Pré-écriture', 'Numération', 'Sciences'], num: '50', numLabel: 'places', fournitures: ['01 Paquet de rame', '01 Papier hygiénique (Lotus ou Lisse)', '01 Paquet de savon Omo (500 g)', '01 Pot de javel (1 L)'] },
  { icon: TreePine, label: 'Grande Section', sublabel: 'GS', age: '5 ans — 5 ans 11 mois', href: '/sections/grande-section', color: '#fff1f2', accent: '#c62828', darkAccent: '#8b0000', desc: "Initiation à la lecture, l'écriture et préparation sereine à l'entrée en CP.", tags: ['Lecture', 'Écriture', 'Préparation CP'], num: '50', numLabel: 'places', fournitures: ['01 Feutre gros bout (Reynold ou Bic)', '01 Papier hygiénique (Lotus ou Lisse)', '01 Sachet de savon Omo (500 g)'] },
]

function SectionsSection() {
  const [openFournitures, setOpenFournitures] = useState(null)
  return (
    <Box sx={{ py: 9, background: '#fff' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 1.5 }}>
            <Box sx={{ width: 28, height: 2, background: ORANGE }} />
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: ORANGE, letterSpacing: '3px', textTransform: 'uppercase' }}>Pédagogie</Typography>
            <Box sx={{ width: 28, height: 2, background: ORANGE }} />
          </Box>
          <Typography variant="h2" sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: { xs: 30, md: 44 }, fontWeight: 700, color: '#0c1a10', mb: 1 }}>Nos 4 sections</Typography>
          <Typography sx={{ color: '#6b7c70', fontSize: 15, maxWidth: 560, mx: 'auto', lineHeight: 1.85 }}>
            Un accompagnement adapté à chaque étape de{' '}<Box component="strong" sx={{ color: '#1B7A3E' }}>1 an 6 mois à 5 ans</Box>.{' '}Le goûter et la tenue de sport sont <Box component="strong" sx={{ color: '#1B7A3E' }}>inclus dans la scolarité</Box>.
          </Typography>
        </Box>
        <Grid container spacing={2.5} justifyContent="center">
          {SECTIONS_DATA.map((sec, idx) => {
            const Icon = sec.icon
            const isExpanded = openFournitures === idx
            return (
              <Grid item xs={6} md={3} key={sec.label}>
                <Box sx={{ borderRadius: '24px', background: sec.color, border: `1.5px solid ${sec.accent}25`, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', transition: 'all 0.28s cubic-bezier(0.4,0,0.2,1)', '&:hover': { transform: 'translateY(-6px)', boxShadow: `0 20px 48px ${sec.accent}1a`, border: `1.5px solid ${sec.accent}45` } }}>
                  <Box sx={{ height: 6, background: `linear-gradient(90deg, ${sec.accent}, ${sec.darkAccent})`, flexShrink: 0 }} />
                  <Box sx={{ p: { xs: 2, md: 2.5 }, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
                      <Box sx={{ width: 52, height: 52, borderRadius: '16px', background: `linear-gradient(135deg, ${sec.accent}, ${sec.darkAccent})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 6px 16px ${sec.accent}30`, flexShrink: 0 }}><Icon size={24} color="#fff" /></Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 700, color: sec.accent, lineHeight: 1 }}>{sec.num}</Typography>
                        <Typography sx={{ fontSize: 10, color: `${sec.accent}99`, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{sec.numLabel}</Typography>
                      </Box>
                    </Box>
                    <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: { xs: 22, md: 26 }, fontWeight: 700, color: '#0c1a10', lineHeight: 1.15 }}>{sec.label}</Typography>
                    <Typography sx={{ fontSize: 12, color: `${sec.accent}88`, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', mb: 0.75 }}>{sec.sublabel}</Typography>
                    <Chip label={sec.age} size="small" sx={{ alignSelf: 'flex-start', mb: 1.5, background: `${sec.accent}14`, color: sec.accent, fontWeight: 700, fontSize: 11.5, border: `1px solid ${sec.accent}30`, height: 24 }} />
                    <Typography sx={{ fontSize: 15, color: '#6b7c70', lineHeight: 1.75, mb: 1.5, flex: 1 }}>{sec.desc}</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
                      {sec.tags.map(tag => (<Box key={tag} sx={{ px: 1.25, py: 0.3, borderRadius: '20px', background: `${sec.accent}10`, border: `1px solid ${sec.accent}20` }}><Typography sx={{ fontSize: 12, color: sec.darkAccent, fontWeight: 600 }}>{tag}</Typography></Box>))}
                    </Box>
                    <Box sx={{ borderTop: `1px solid ${sec.accent}18`, pt: 1.5, mb: 1.5 }}>
                      <Box onClick={() => setOpenFournitures(isExpanded ? null : idx)} sx={{ display: 'flex', alignItems: 'center', gap: 0.75, cursor: 'pointer', userSelect: 'none' }}>
                        <Package size={14} color={sec.accent} />
                        <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: sec.accent, flex: 1 }}>Fournitures</Typography>
                        <ChevronRight size={13} color={sec.accent} style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                      </Box>
                      {isExpanded && (<Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 0.6 }}>{sec.fournitures.map(f => (<Box key={f} sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75 }}><Box sx={{ width: 5, height: 5, borderRadius: '50%', background: sec.accent, mt: 0.7, flexShrink: 0 }} /><Typography sx={{ fontSize: 13, color: '#4b5e52', lineHeight: 1.5 }}>{f}</Typography></Box>))}</Box>)}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 1.5, borderTop: `1px solid ${sec.accent}12` }}>
                      <Link to={sec.href} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Typography sx={{ fontSize: 14.5, fontWeight: 700, color: sec.accent }}>Découvrir</Typography>
                        <Box sx={{ width: 26, height: 26, borderRadius: '50%', background: `linear-gradient(135deg, ${sec.accent}, ${sec.darkAccent})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 3px 10px ${sec.accent}30` }}><ChevronRight size={13} color="#fff" /></Box>
                      </Link>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            )
          })}
        </Grid>
        <Box sx={{ mt: 3, p: 2, background: '#f4f8f5', border: '1px solid #dae8df', borderRadius: '12px', display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
          <Shirt size={16} color="#1B7A3E" style={{ flexShrink: 0, marginTop: 2 }} />
          <Typography sx={{ fontSize: 13, color: '#4b5e52', lineHeight: 1.75 }}>
            <strong>Tenue scolaire :</strong> Vert / blanc petit carreau — à l'actif des parents.&ensp;·&ensp;<strong>Goûter &amp; tenue de sport</strong> inclus dans la scolarité.&ensp;·&ensp;<strong>Transport :</strong> taximètres disponibles sur demande.
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button component={Link} to="/sections/creche" variant="outlined" endIcon={<ChevronRight size={15} />} sx={{ borderColor: '#1B7A3E', color: '#1B7A3E', fontWeight: 700, px: 3.5, py: 1.1, borderRadius: '30px', '&:hover': { background: '#eaf4ee', borderColor: '#0f4a25' } }}>
            Explorer toutes nos sections
          </Button>
        </Box>
      </Container>
    </Box>
  )
}

// ========================
// INSCRIPTION CTA
// ========================
function InscriptionCTA({ params }) {
  const annee    = params?.annee_scolaire_courante || '2025-2026'
  const horaires = params?.horaires || 'tous les jours ouvrables de 7h30 à 16h30'
  const isOpen   = params?.inscriptions_ouvertes !== 'false'
  const montant  = params?.scolarite_montant ? Number(params.scolarite_montant).toLocaleString('fr-FR') : '50 000'
  const annee1   = annee.includes('-') ? annee.split('-')[0].trim() : annee

  const dossier = [
    { label: 'Extrait de naissance',       detail: 'Original obligatoire' },
    { label: 'Certificat de vaccination',  detail: 'PEV + hors PEV : Méningite, Hépatite, ROR, Typhim VI' },
    { label: '4 chemises cartonnées',      detail: 'Garçons = bleues · Filles = roses' },
    { label: "4 photos d'identité",        detail: "Couleur · À prendre directement à l'école" },
  ]
  const versements = [
    { label: '1er versement',  moment: "À l'inscription",        montant: '31 000 Frs' },
    { label: '2ème versement', moment: `Fin Novembre ${annee1}`, montant: '15 000 Frs' },
    { label: '3ème versement', moment: `Fin Décembre ${annee1}`, montant: '10 000 Frs' },
  ]

  return (
    <Box sx={{ py: 8, background: 'linear-gradient(135deg, #0f4a25, #1B7A3E)' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 1 }}>
            <Box sx={{ width: 28, height: 2, background: ORANGE }} />
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: ORANGE, letterSpacing: '3px', textTransform: 'uppercase' }}>{isOpen ? 'Inscriptions ouvertes' : "Dossier d'inscription"}</Typography>
            <Box sx={{ width: 28, height: 2, background: ORANGE }} />
          </Box>
          <Typography variant="h2" sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: { xs: 30, md: 44 }, fontWeight: 700, color: '#fff', lineHeight: 1.1, mb: 1 }}>
            {isOpen ? `Inscrivez votre enfant — ${annee}` : 'Préparez votre dossier'}
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: 13.5, maxWidth: 580, mx: 'auto', lineHeight: 1.8 }}>
            {isOpen ? `Inscriptions ouvertes ${horaires} au secrétariat du CPPE. Structure ouverte aux enfants de 1 an 6 mois à 5 ans.` : 'Les inscriptions sont actuellement fermées. Préparez dès maintenant les pièces nécessaires.'}
          </Typography>
        </Box>
        <Grid container spacing={2.5} alignItems="stretch" justifyContent="center">
          <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
            <Box sx={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', p: 3, width: '100%', display: 'flex', flexDirection: 'column', transition: 'all 0.32s cubic-bezier(0.4,0,0.2,1)', cursor: 'default', '&:hover': { background: 'rgba(255,255,255,0.11)', border: '1px solid rgba(255,127,39,0.5)', transform: 'translateY(-8px)', boxShadow: '0 24px 48px rgba(0,0,0,0.25)' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2.5 }}><Box sx={{ width: 32, height: 32, borderRadius: '10px', background: `rgba(255,127,39,0.15)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ShieldCheck size={16} color={ORANGE} /></Box><Typography sx={{ color: ORANGE, fontWeight: 700, fontSize: 12.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pièces à fournir</Typography></Box>
              {dossier.map(item => (<Box key={item.label} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25, mb: 2 }}><CheckCircle size={15} color={ORANGE} style={{ flexShrink: 0, marginTop: 2 }} /><Box><Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>{item.label}</Typography><Typography sx={{ color: 'rgba(255,255,255,0.42)', fontSize: 11.5, lineHeight: 1.55, mt: 0.25 }}>{item.detail}</Typography></Box></Box>))}
            </Box>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
            <Box sx={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', p: 3, width: '100%', display: 'flex', flexDirection: 'column', transition: 'all 0.32s cubic-bezier(0.4,0,0.2,1)', cursor: 'default', '&:hover': { background: 'rgba(255,255,255,0.11)', border: '1px solid rgba(255,127,39,0.5)', transform: 'translateY(-8px)', boxShadow: '0 24px 48px rgba(0,0,0,0.25)' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2.5 }}><Box sx={{ width: 32, height: 32, borderRadius: '10px', background: `rgba(255,127,39,0.15)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CreditCard size={16} color={ORANGE} /></Box><Typography sx={{ color: ORANGE, fontWeight: 700, fontSize: 12.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Scolarité {annee}</Typography></Box>
              <Box sx={{ mb: 2.5, p: 2, background: `rgba(255,127,39,0.08)`, borderRadius: '12px', border: `1px solid rgba(255,127,39,0.2)` }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, mb: 0.25 }}>Montant annuel</Typography>
                <Typography sx={{ color: ORANGE, fontWeight: 800, fontSize: 24, lineHeight: 1 }}>{montant} FCFA</Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, mt: 0.5 }}>+ 6 000 F (fêtes scolaires &amp; photos)</Typography>
              </Box>
              {versements.map((v, i) => (<Box key={v.label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5, pb: 1.5, borderBottom: i < versements.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}><Box><Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: 12.5, fontWeight: 600 }}>{v.label}</Typography><Typography sx={{ color: 'rgba(255,255,255,0.38)', fontSize: 11 }}>{v.moment}</Typography></Box><Typography sx={{ color: ORANGE, fontWeight: 700, fontSize: 13, flexShrink: 0, ml: 1 }}>{v.montant}</Typography></Box>))}
            </Box>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
            <Box sx={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', p: 3, width: '100%', display: 'flex', flexDirection: 'column', transition: 'all 0.32s cubic-bezier(0.4,0,0.2,1)', cursor: 'default', '&:hover': { background: 'rgba(255,255,255,0.11)', border: '1px solid rgba(255,127,39,0.5)', transform: 'translateY(-8px)', boxShadow: '0 24px 48px rgba(0,0,0,0.25)' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2.5 }}><Box sx={{ width: 32, height: 32, borderRadius: '10px', background: `rgba(255,127,39,0.15)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Package size={16} color={ORANGE} /></Box><Typography sx={{ color: ORANGE, fontWeight: 700, fontSize: 12.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Infos pratiques</Typography></Box>
              {[{ icon: Utensils, label: 'Cantine scolaire', detail: 'Facultative · 8 000 Frs / mois' }, { icon: Shirt, label: "Tenue de l'école", detail: "Vert / blanc petit carreau — à l'actif des parents" }, { icon: CheckCircle, label: 'Inclus dans la scolarité', detail: 'Goûter + tenue de sport fournis' }, { icon: Bus, label: 'Transport', detail: 'Taximètres disponibles sur demande' }].map(({ icon: Icon, label, detail }) => (
                <Box key={label} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25, mb: 2 }}><Box sx={{ width: 28, height: 28, borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mt: 0.2 }}><Icon size={13} color="rgba(255,255,255,0.55)" /></Box><Box><Typography sx={{ color: 'rgba(255,255,255,0.88)', fontSize: 12.5, fontWeight: 600, lineHeight: 1.3 }}>{label}</Typography><Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 11.5, lineHeight: 1.5, mt: 0.2 }}>{detail}</Typography></Box></Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

// ========================
// CONTACT RAPIDE
// ========================
// ========================
// CONTACT RAPIDE
// ========================
function ContactRapide({ params }) {
  const adresse   = params?.adresse   || "Complexe Socio-Éducatif d'Issia, Haut-Sassandra"
  const telephone = params?.telephone || '07 07 18 65 59 / 05 06 48 22 01'
  const horaires  = params?.horaires  || 'Lun–Ven · 7h30 à 16h30'

  const infos = [
    { icon: MapPin, title: 'Adresse',   text: adresse,   color: GREEN },
    { icon: Phone,  title: 'Téléphone', text: telephone, color: ORANGE },
    { icon: Clock,  title: 'Horaires',  text: horaires,  color: GREEN },
  ]

  const [current, setCurrent] = useState(0)
  const touchStartX = useRef(null)

  const prev = () => setCurrent(c => (c === 0 ? infos.length - 1 : c - 1))
  const next = () => setCurrent(c => (c === infos.length - 1 ? 0 : c + 1))

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const handleTouchEnd   = (e) => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev()
    touchStartX.current = null
  }

  const CardContent = ({ icon: Icon, title, text, color }) => (
    <Box sx={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      textAlign: 'center', p: 3, width: '100%',
    }}>
      <Box sx={{
        width: 52, height: 52, borderRadius: '14px',
        background: `${color}18`, display: 'flex',
        alignItems: 'center', justifyContent: 'center', mb: 1.5,
      }}>
        <Icon size={22} color={color} />
      </Box>
      <Typography sx={{ fontWeight: 700, fontSize: 13, color: '#0c1a10', mb: 0.5 }}>{title}</Typography>
      <Typography sx={{ fontSize: 13, color: '#6b7c70', lineHeight: 1.6 }}>{text}</Typography>
    </Box>
  )

  return (
    <Box sx={{ py: 6, background: '#fff' }}>
      <Container maxWidth="md">

        {/* VERSION DESKTOP — grille normale */}
        <Grid container spacing={2} sx={{ display: { xs: 'none', md: 'flex' } }}>
          {infos.map(({ icon: Icon, title, text, color }) => (
            <Grid item md={4} key={title} sx={{ display: 'flex', justifyContent: 'center' }}>
              <CardContent icon={Icon} title={title} text={text} color={color} />
            </Grid>
          ))}
        </Grid>

        {/* VERSION MOBILE — carousel */}
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          <Box
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            sx={{ overflow: 'hidden' }}
          >
            <Box sx={{
              display: 'flex',
              transform: `translateX(${-current * 100}%)`,
              transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)',
            }}>
              {infos.map(({ icon: Icon, title, text, color }) => (
                <Box key={title} sx={{ flex: '0 0 100%', width: '100%' }}>
                  <CardContent icon={Icon} title={title} text={text} color={color} />
                </Box>
              ))}
            </Box>
          </Box>

          {/* Dots + flèches */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mt: 1 }}>
            <IconButton onClick={prev} size="small"
              sx={{ width: 32, height: 32, border: `1.5px solid rgba(27,122,62,0.3)`, color: GREEN }}>
              <ChevronLeft size={16} />
            </IconButton>

            <Box sx={{ display: 'flex', gap: 0.75 }}>
              {infos.map((_, i) => (
                <Box key={i} onClick={() => setCurrent(i)} sx={{
                  width: i === current ? 20 : 7, height: 7,
                  borderRadius: '6px', cursor: 'pointer',
                  background: i === current ? GREEN : 'rgba(27,122,62,0.2)',
                  transition: 'all 0.3s ease',
                }} />
              ))}
            </Box>

            <IconButton onClick={next} size="small"
              sx={{ width: 32, height: 32, border: `1.5px solid rgba(27,122,62,0.3)`, color: GREEN }}>
              <ChevronRight size={16} />
            </IconButton>
          </Box>
        </Box>

      </Container>
    </Box>
  )
}
// ========================
// MAIN HOME PAGE
// ========================
export default function Home() {
  const { data: actualitesData } = useQuery({
    queryKey: ['actualites-public'],
    queryFn:  () => actualitesApi.getAll({ per_page: 3 }),
  })

  const { data: flashData } = useQuery({
    queryKey: ['flash-infos-ticker'],
    queryFn:  () => actualitesApi.getAll({ type: 'flash', statut: 'publie', per_page: 20 }),
  })

  const { data: parametresData } = useQuery({
    queryKey: ['parametres-public'],
    queryFn:  () => parametresApi.getAll(),
    staleTime: 5 * 60 * 1000,
  })

  const { data: activitesData } = useQuery({
    queryKey: ['activites-public-home'],
    queryFn:  () => activitesApi.getAll(),
  })

  const params     = parametresData?.data?.data       || {}
  const activites  = activitesData?.data?.data?.data  || []
  const flashItems = flashData?.data?.data?.data       || []

  return (
    <Box>
      <Hero                     params={params} />
      <InfoBar                  params={params} flashItems={flashItems} />
      <MotDirecteurSection      params={params} />
      <ActivitesCarouselSection activites={activites} />
      <SectionsSection />
      <InscriptionCTA           params={params} />
      <ContactRapide            params={params} />
    </Box>
  )
}