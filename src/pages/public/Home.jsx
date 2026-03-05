import { useState, useEffect, useRef } from 'react'
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
  ChevronRight as ChevronRightIcon,
  Quote,
  Bus,
  Shirt,
  Package,
  CreditCard,
  Utensils,
  ShieldCheck,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { actualitesApi, parametresApi } from '@/api/services'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import ecoleImage from '../../assets/ecole.jpg'
import { getImageUrl } from '@/utils/imageHelper'

// COULEUR ORANGE DU MINISTÈRE (remplace l'ancien jaune #F5A623)
const ORANGE = '#FF7F27'

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
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none' }} />
      <Box sx={{ position: 'absolute', width: 600, height: 600, right: -200, top: -200, borderRadius: '50%', background: `radial-gradient(circle, rgba(255,127,39,0.1) 0%, transparent 70%)`, pointerEvents: 'none' }} />

      {/* CONTENU GAUCHE */}
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

      {/* IMAGE DROITE */}
      <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'center', px: 4, py: 6, position: 'relative', zIndex: 1 }}>
        <Box sx={{ position: 'absolute', width: 'calc(100% - 56px)', aspectRatio: '1 / 1', maxWidth: 420, border: `2px solid rgba(255,127,39,0.4)`, borderRadius: '24px', top: '50%', left: '50%', transform: 'translate(calc(-50% + 10px), calc(-50% + 10px))', pointerEvents: 'none' }} />
        <Box sx={{ width: '100%', maxWidth: 420, aspectRatio: '1 / 1', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)', position: 'relative', flexShrink: 0 }}>
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
// INFO BAR
// ========================
function InfoBar({ params }) {
  const isOpen      = params?.inscriptions_ouvertes !== 'false'
  const annee       = params?.annee_scolaire_courante || '2025-2026'
  const horaires    = params?.horaires || 'du lundi au vendredi de 7h30 à 16h30'
  const dateRentree = params?.date_rentree || '06 octobre 2025'

  if (!isOpen) return null

  return (
    <Box sx={{ background: ORANGE, py: 1.25 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <Box sx={{ width: 7, height: 7, borderRadius: '50%', background: '#0f4a25', flexShrink: 0, animation: 'pulse-dot 2s infinite' }} />
          <Typography sx={{ color: '#0f4a25', fontWeight: 700, fontSize: 12.5, flex: 1 }}>
            Inscriptions {annee} ouvertes — {horaires.charAt(0).toUpperCase() + horaires.slice(1)} · Rentrée le {dateRentree}
          </Typography>
          <Button component={Link} to="/flash-infos" size="small" sx={{ color: '#0f4a25', fontWeight: 800, fontSize: 11.5, textDecoration: 'underline', minWidth: 'auto', p: 0 }}>
            Voir toutes les infos →
          </Button>
        </Box>
      </Container>
    </Box>
  )
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
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: ORANGE, letterSpacing: '3px', textTransform: 'uppercase' }}>
              Message officiel
            </Typography>
            <Box sx={{ width: 28, height: 2, background: ORANGE }} />
          </Box>
          <Typography variant="h2" sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: { xs: 28, md: 40 }, fontWeight: 700, color: '#0c1a10' }}>
            Mot du Directeur
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            borderRadius: '28px',
            overflow: 'hidden',
            border: '1px solid rgba(27,122,62,0.12)',
            boxShadow: '0 8px 40px rgba(27,122,62,0.08)',
            height: { md: 300 },
          }}
        >
          {/* PANNEAU GAUCHE */}
          <Box
            sx={{
              width: { xs: '100%', md: '38%' },
              flexShrink: 0,
              background: 'linear-gradient(160deg, #0a2e18 0%, #0f4a25 55%, #1B7A3E 100%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              py: { xs: 4, md: 0 },
              px: 3,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ position: 'absolute', width: 260, height: 260, borderRadius: '50%', background: `rgba(255,127,39,0.06)`, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />
            <Box sx={{ position: 'absolute', width: 180, height: 180, borderRadius: '50%', background: `rgba(255,127,39,0.04)`, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />
            <Box
              sx={{
                width: { xs: 140, md: 160 },
                height: { xs: 140, md: 160 },
                flexShrink: 0,
                borderRadius: '50%',
                border: `5px solid ${ORANGE}`,
                boxShadow: `0 0 0 10px rgba(255,127,39,0.1), 0 12px 40px rgba(0,0,0,0.4)`,
                overflow: 'hidden',
                background: 'rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                zIndex: 1,
              }}
            >
              {photo ? (
                <Box 
                  component="img" 
                  src={getImageUrl(photo)} 
                  alt={nom} 
                  sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  onError={(e) => {
                    console.error('❌ Erreur chargement photo grande:', photo);
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<span style="font-size:64px;">👤</span>';
                  }}
                  onLoad={() => console.log('✅ Grande photo chargée')}
                />
              ) : (
                <Typography sx={{ fontSize: 64, lineHeight: 1 }}>👤</Typography>
              )}
            </Box>
            <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: { xs: 18, md: 20 }, fontWeight: 700, color: '#fff', lineHeight: 1.2, mb: 0.5 }}>
                {nom}
              </Typography>
              <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', mb: 1.5 }}>
                Directeur du CPPE d'Issia
              </Typography>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, px: 1.75, py: 0.5, background: `rgba(255,127,39,0.14)`, borderRadius: '20px', border: `1px solid rgba(255,127,39,0.3)` }}>
                <Box sx={{ width: 5, height: 5, borderRadius: '50%', background: ORANGE }} />
                <Typography sx={{ fontSize: 10, color: ORANGE, fontWeight: 700, letterSpacing: '0.5px' }}>MFFE · Côte d'Ivoire</Typography>
              </Box>
            </Box>
          </Box>

          {/* PANNEAU DROIT */}
          <Box
            sx={{
              flex: 1,
              background: 'linear-gradient(135deg, #f4f8f5 0%, #eaf4ee 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              px: { xs: 3, md: 5 },
              py: { xs: 4, md: 0 },
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Quote size={120} color="#1B7A3E" style={{ opacity: 0.04, position: 'absolute', top: -10, right: 10, pointerEvents: 'none' }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2.5 }}>
              <Box sx={{ width: 28, height: 3, background: `linear-gradient(90deg, ${ORANGE}, #1B7A3E)`, borderRadius: 2 }} />
              <Typography sx={{ fontSize: 10, fontWeight: 700, color: ORANGE, textTransform: 'uppercase', letterSpacing: '2px' }}>
                Message du directeur
              </Typography>
            </Box>
            <Typography
              sx={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: { xs: 22, md: 28 },
                fontWeight: 600,
                fontStyle: 'italic',
                lineHeight: 1.55,
                color: '#2d3a30',
                mb: 3,
                position: 'relative',
                zIndex: 1,
              }}
            >
              « {teaser} »
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 38, height: 38, borderRadius: '50%', border: `2px solid ${ORANGE}`, overflow: 'hidden', background: '#eaf4ee', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {photo ? (
                    <Box 
                      component="img" 
                      src={getImageUrl(photo)} 
                      alt={nom} 
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        console.error('❌ Erreur chargement photo mini:', photo);
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<span style="font-size:16px;">👤</span>';
                      }}
                      onLoad={() => console.log('✅ Mini photo chargée')}
                    />
                  ) : (
                    <Typography sx={{ fontSize: 16 }}>👤</Typography>
                  )}
                </Box>
                <Box>
                  <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, fontWeight: 700, color: '#1B7A3E', lineHeight: 1.2 }}>{nom}</Typography>
                  <Typography sx={{ fontSize: 11, color: '#6b7c70' }}>CPPE d'Issia — Haut-Sassandra</Typography>
                </Box>
              </Box>
              <Button
                component={Link}
                to="/mot-du-directeur"
                variant="contained"
                endIcon={<ChevronRight size={14} />}
                sx={{
                  background: 'linear-gradient(135deg, #0f4a25, #1B7A3E)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 12,
                  borderRadius: '20px',
                  px: 2.5,
                  py: 1,
                  boxShadow: '0 4px 16px rgba(15,74,37,0.3)',
                  '&:hover': { background: 'linear-gradient(135deg, #0a2e18, #0f4a25)', transform: 'translateY(-1px)' },
                  transition: 'all 0.2s',
                }}
              >
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
// FLASH INFOS
// ========================
const FLASH_STYLES = `
  @keyframes scroll-ltr {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes scroll-rtl {
    0%   { transform: translateX(-50%); }
    100% { transform: translateX(0); }
  }
  .ticker-row-1 {
    display: flex;
    width: max-content;
    animation: scroll-ltr 40s linear infinite;
  }
  .ticker-row-2 {
    display: flex;
    width: max-content;
    animation: scroll-rtl 50s linear infinite;
  }
  .ticker-row-1:hover,
  .ticker-row-2:hover {
    animation-play-state: paused;
  }
`

function FlashInfosSection({ actualites }) {
  const list    = (actualites || []).slice(0, 6)
  const doubled = list.length > 0 ? [...list, ...list, ...list] : []

  return (
    <Box sx={{ background: 'linear-gradient(160deg, #1a2e1e 0%, #243b28 50%, #1e3422 100%)', py: 7, position: 'relative', overflow: 'hidden' }}>
      <style>{FLASH_STYLES}</style>

      <Box sx={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,127,39,0.04) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139,195,74,0.05) 0%, transparent 45%)`, pointerEvents: 'none' }} />
      <Box sx={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)', backgroundSize: '44px 44px', pointerEvents: 'none' }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 5 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <Box sx={{ width: 28, height: 2, background: ORANGE }} />
              <Typography sx={{ fontSize: 10.5, fontWeight: 700, color: ORANGE, letterSpacing: '3px', textTransform: 'uppercase' }}>
                Actualités
              </Typography>
            </Box>
            <Typography variant="h2" sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: { xs: 28, md: 38 }, fontWeight: 700, color: '#f0f7f2', lineHeight: 1 }}>
              Flash Infos
            </Typography>
          </Box>
          <Button
            component={Link}
            to="/flash-infos"
            endIcon={<ChevronRight size={14} />}
            sx={{
              color: ORANGE,
              border: `1px solid rgba(255,127,39,0.3)`,
              borderRadius: '20px',
              px: 2.5,
              py: 0.75,
              fontWeight: 700,
              fontSize: 12.5,
              '&:hover': { background: `rgba(255,127,39,0.1)`, borderColor: ORANGE },
            }}
          >
            Toutes les infos
          </Button>
        </Box>
      </Container>

      {doubled.length > 0 && (
        <Box sx={{ position: 'relative', overflow: 'hidden', mb: 1.5 }}>
          <Box sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 100, background: 'linear-gradient(to right, #1a2e1e, transparent)', zIndex: 2, pointerEvents: 'none' }} />
          <Box sx={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 100, background: 'linear-gradient(to left, #1a2e1e, transparent)', zIndex: 2, pointerEvents: 'none' }} />
          <Box className="ticker-row-1" sx={{ gap: '10px', py: 0.5 }}>
            {doubled.map((actu, i) => {
              const raw     = actu.contenu?.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() || ''
              const snippet = raw.split(/\s+/).slice(0, 10).join(' ') + (raw.split(/\s+/).length > 10 ? '…' : '')
              return (
                <Box
                  key={`t1-${actu.id}-${i}`}
                  component={Link}
                  to={`/flash-infos?id=${actu.id}`}
                  sx={{
                    flexShrink: 0,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1.25,
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.09)',
                    borderRadius: '40px',
                    px: 2.5,
                    py: 0.9,
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    '&:hover': { background: `rgba(255,127,39,0.14)`, borderColor: `rgba(255,127,39,0.45)` },
                  }}
                >
                  <Box sx={{ width: 5, height: 5, borderRadius: '50%', background: ORANGE, flexShrink: 0 }} />
                  <Typography sx={{ fontSize: 12.5, fontWeight: 500, color: 'rgba(235,248,240,0.85)', whiteSpace: 'nowrap' }}>
                    {snippet || actu.titre}
                  </Typography>
                </Box>
              )
            })}
          </Box>
        </Box>
      )}

      {doubled.length > 0 && (
        <Box sx={{ position: 'relative', overflow: 'hidden', mb: 5 }}>
          <Box sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 100, background: 'linear-gradient(to right, #243b28, transparent)', zIndex: 2, pointerEvents: 'none' }} />
          <Box sx={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 100, background: 'linear-gradient(to left, #243b28, transparent)', zIndex: 2, pointerEvents: 'none' }} />
          <Box className="ticker-row-2" sx={{ gap: '10px', py: 0.5 }}>
            {doubled.map((actu, i) => {
              const raw   = actu.contenu?.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() || ''
              const words = raw.split(/\s+/)
              const slice = words.slice(10, 22).join(' ')
              const snippet = slice
                ? slice + (words.length > 22 ? '…' : '')
                : raw.split(/\s+/).slice(0, 10).join(' ') + (words.length > 10 ? '…' : '')
              return (
                <Box
                  key={`t2-${actu.id}-${i}`}
                  component={Link}
                  to={`/flash-infos?id=${actu.id}`}
                  sx={{
                    flexShrink: 0,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1.25,
                    background: 'rgba(139,195,74,0.06)',
                    border: '1px solid rgba(139,195,74,0.12)',
                    borderRadius: '40px',
                    px: 2.5,
                    py: 0.9,
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    '&:hover': { background: 'rgba(139,195,74,0.14)', borderColor: 'rgba(139,195,74,0.3)' },
                  }}
                >
                  <Box sx={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(139,195,74,0.7)', flexShrink: 0 }} />
                  <Typography sx={{ fontSize: 12.5, color: 'rgba(200,235,210,0.7)', whiteSpace: 'nowrap', fontStyle: 'italic' }}>
                    {snippet || actu.titre}
                  </Typography>
                </Box>
              )
            })}
          </Box>
        </Box>
      )}

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={2}>
          {list.slice(0, 3).map((actu, i) => {
            const raw     = actu.contenu?.replace(/<[^>]+>/g, '') || ''
            const excerpt = raw.trim().split(/\s+/).slice(0, 18).join(' ') + (raw.split(/\s+/).length > 18 ? '…' : '')
            const accent  = i === 0 ? ORANGE : i === 1 ? '#8bc34a' : '#4db6ac'
            return (
              <Grid item xs={12} md={4} key={actu.id}>
                <Box
                  component={Link}
                  to={`/flash-infos?id=${actu.id}`}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    textDecoration: 'none',
                    height: '100%',
                    background: 'rgba(255,255,255,0.045)',
                    border: `1px solid rgba(255,255,255,0.07)`,
                    borderRadius: '20px',
                    p: 3,
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.25s',
                    '&:hover': {
                      background: 'rgba(255,255,255,0.09)',
                      border: `1px solid ${accent}45`,
                      transform: 'translateY(-4px)',
                      boxShadow: `0 16px 40px rgba(0,0,0,0.25)`,
                    },
                  }}
                >
                  <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${accent}, transparent)` }} />
                  <Typography sx={{ position: 'absolute', bottom: -8, right: 12, fontFamily: "'Cormorant Garamond', serif", fontSize: 80, fontWeight: 700, color: 'rgba(255,255,255,0.025)', lineHeight: 1, userSelect: 'none' }}>
                    {String(i + 1).padStart(2, '0')}
                  </Typography>
                  <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, mb: 2, alignSelf: 'flex-start', px: 1.5, py: 0.4, background: `${accent}18`, borderRadius: '20px', border: `1px solid ${accent}30` }}>
                    <Box sx={{ width: 5, height: 5, borderRadius: '50%', background: accent, flexShrink: 0 }} />
                    <Typography sx={{ fontSize: 10.5, color: accent, fontWeight: 700 }}>
                      {actu.date_publication ? format(new Date(actu.date_publication), 'dd MMM yyyy', { locale: fr }) : '—'}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontWeight: 700, fontSize: 15, color: '#f0f7f2', mb: 1.5, lineHeight: 1.4, position: 'relative' }}>
                    {actu.titre}
                  </Typography>
                  <Typography sx={{ fontSize: 12.5, color: 'rgba(200,235,210,0.5)', lineHeight: 1.75, flex: 1, position: 'relative' }}>
                    {excerpt}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 2.5, pt: 2, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: accent }}>Lire la suite</Typography>
                    <ChevronRight size={13} color={accent} />
                  </Box>
                </Box>
              </Grid>
            )
          })}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            component={Link}
            to="/flash-infos"
            endIcon={<ChevronRight size={14} />}
            sx={{
              background: `rgba(255,127,39,0.1)`,
              border: `1px solid rgba(255,127,39,0.3)`,
              color: ORANGE,
              fontWeight: 700,
              fontSize: 13,
              borderRadius: '30px',
              px: 3.5,
              py: 1,
              '&:hover': { background: `rgba(255,127,39,0.2)`, borderColor: ORANGE },
            }}
          >
            Voir toutes les actualités
          </Button>
        </Box>
      </Container>
    </Box>
  )
}

// ========================
// SECTIONS — CENTRÉ + TEXTE AGRANDI
// ========================
const SECTIONS_DATA = [
  {
    icon: Baby,
    label: 'Crèche',
    sublabel: 'Section Spéciale',
    age: '1 an 6 mois — 2 ans 11 mois',
    href: '/sections/creche',
    color: '#eaf4ee',
    accent: '#1B7A3E',
    darkAccent: '#0f4a25',
    desc: 'Éveil sensoriel, jeux libres et motricité dans un cadre doux et sécurisant.',
    tags: ['Éveil sensoriel', 'Motricité', 'Jeux libres'],
    num: '25',
    numLabel: 'places',
    fournitures: [
      '01 Paquet de rame',
      '01 Papier hygiénique (Lotus ou Lisse)',
      '01 Paquet de savon Omo (500 g)',
      '01 Pot de javel (1 L)',
    ],
  },
  {
    icon: Sprout,
    label: 'Petite Section',
    sublabel: 'PS',
    age: '3 ans — 3 ans 11 mois',
    href: '/sections/petite-section',
    color: '#fff8ee',
    accent: ORANGE,
    darkAccent: '#cc6400',
    desc: 'Langage oral, dessin et premières découvertes collectives pour les tout-petits.',
    tags: ['Langage oral', 'Dessin', 'Socialisation'],
    num: '40',
    numLabel: 'places',
    fournitures: [
      '01 Paquet de rame',
      '01 Papier hygiénique (Lotus ou Lisse)',
      '01 Paquet de savon Omo (500 g)',
      '01 Pot de javel (1 L)',
    ],
  },
  {
    icon: Leaf,
    label: 'Moyenne Section',
    sublabel: 'MS',
    age: '4 ans — 4 ans 11 mois',
    href: '/sections/moyenne-section',
    color: '#eff6ff',
    accent: '#1565c0',
    darkAccent: '#0d47a1',
    desc: "Pré-écriture, numération jusqu'à 10 et découverte de l'environnement.",
    tags: ['Pré-écriture', 'Numération', 'Sciences'],
    num: '50',
    numLabel: 'places',
    fournitures: [
      '01 Paquet de rame',
      '01 Papier hygiénique (Lotus ou Lisse)',
      '01 Paquet de savon Omo (500 g)',
      '01 Pot de javel (1 L)',
    ],
  },
  {
    icon: TreePine,
    label: 'Grande Section',
    sublabel: 'GS',
    age: '5 ans — 5 ans 11 mois',
    href: '/sections/grande-section',
    color: '#fff1f2',
    accent: '#c62828',
    darkAccent: '#8b0000',
    desc: "Initiation à la lecture, l'écriture et préparation sereine à l'entrée en CP.",
    tags: ['Lecture', 'Écriture', 'Préparation CP'],
    num: '50',
    numLabel: 'places',
    fournitures: [
      '01 Feutre gros bout (Reynold ou Bic)',
      '01 Papier hygiénique (Lotus ou Lisse)',
      '01 Sachet de savon Omo (500 g)',
    ],
  },
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
          <Typography variant="h2" sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: { xs: 30, md: 44 }, fontWeight: 700, color: '#0c1a10', mb: 1 }}>
            Nos 4 sections
          </Typography>
          <Typography sx={{ color: '#6b7c70', fontSize: 15, maxWidth: 560, mx: 'auto', lineHeight: 1.85 }}>
            Un accompagnement adapté à chaque étape de{' '}
            <Box component="strong" sx={{ color: '#1B7A3E' }}>1 an 6 mois à 5 ans</Box>.
            {' '}Le goûter et la tenue de sport sont <Box component="strong" sx={{ color: '#1B7A3E' }}>inclus dans la scolarité</Box>.
          </Typography>
        </Box>

        {/* GRID CENTRÉ */}
        <Grid container spacing={2.5} justifyContent="center">
          {SECTIONS_DATA.map((sec, idx) => {
            const Icon       = sec.icon
            const isExpanded = openFournitures === idx
            return (
              <Grid item xs={6} md={3} key={sec.label}>
                <Box
                  sx={{
                    borderRadius: '24px',
                    background: sec.color,
                    border: `1.5px solid ${sec.accent}25`,
                    overflow: 'hidden',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: `0 20px 48px ${sec.accent}1a`,
                      border: `1.5px solid ${sec.accent}45`,
                    },
                  }}
                >
                  <Box sx={{ height: 6, background: `linear-gradient(90deg, ${sec.accent}, ${sec.darkAccent})`, flexShrink: 0 }} />
                  <Box sx={{ p: { xs: 2, md: 2.5 }, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
                      <Box sx={{ width: 52, height: 52, borderRadius: '16px', background: `linear-gradient(135deg, ${sec.accent}, ${sec.darkAccent})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 6px 16px ${sec.accent}30`, flexShrink: 0 }}>
                        <Icon size={24} color="#fff" />
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 700, color: sec.accent, lineHeight: 1 }}>{sec.num}</Typography>
                        <Typography sx={{ fontSize: 10, color: `${sec.accent}99`, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{sec.numLabel}</Typography>
                      </Box>
                    </Box>
                    <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: { xs: 19, md: 22 }, fontWeight: 700, color: '#0c1a10', lineHeight: 1.15 }}>{sec.label}</Typography>
                    <Typography sx={{ fontSize: 10.5, color: `${sec.accent}88`, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', mb: 0.75 }}>{sec.sublabel}</Typography>
                    <Chip label={sec.age} size="small"
                      sx={{ alignSelf: 'flex-start', mb: 1.5, background: `${sec.accent}14`, color: sec.accent, fontWeight: 700, fontSize: 10, border: `1px solid ${sec.accent}30`, height: 22 }} />
                    <Typography sx={{ fontSize: 13.5, color: '#6b7c70', lineHeight: 1.75, mb: 1.5, flex: 1 }}>{sec.desc}</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
                      {sec.tags.map((tag) => (
                        <Box key={tag} sx={{ px: 1.25, py: 0.3, borderRadius: '20px', background: `${sec.accent}10`, border: `1px solid ${sec.accent}20` }}>
                          <Typography sx={{ fontSize: 10.5, color: sec.darkAccent, fontWeight: 600 }}>{tag}</Typography>
                        </Box>
                      ))}
                    </Box>
                    <Box sx={{ borderTop: `1px solid ${sec.accent}18`, pt: 1.5, mb: 1.5 }}>
                      <Box
                        onClick={() => setOpenFournitures(isExpanded ? null : idx)}
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.75, cursor: 'pointer', userSelect: 'none' }}
                      >
                        <Package size={13} color={sec.accent} />
                        <Typography sx={{ fontSize: 12, fontWeight: 700, color: sec.accent, flex: 1 }}>Fournitures</Typography>
                        <ChevronRight size={12} color={sec.accent}
                          style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                      </Box>
                      {isExpanded && (
                        <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 0.6 }}>
                          {sec.fournitures.map((f) => (
                            <Box key={f} sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75 }}>
                              <Box sx={{ width: 5, height: 5, borderRadius: '50%', background: sec.accent, mt: 0.7, flexShrink: 0 }} />
                              <Typography sx={{ fontSize: 11.5, color: '#4b5e52', lineHeight: 1.5 }}>{f}</Typography>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 1.5, borderTop: `1px solid ${sec.accent}12` }}>
                      <Link to={sec.href} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 700, color: sec.accent }}>Découvrir</Typography>
                        <Box sx={{ width: 26, height: 26, borderRadius: '50%', background: `linear-gradient(135deg, ${sec.accent}, ${sec.darkAccent})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 3px 10px ${sec.accent}30` }}>
                          <ChevronRight size={13} color="#fff" />
                        </Box>
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
            <strong>Tenue scolaire :</strong> Vert / blanc petit carreau — à l'actif des parents.&ensp;·&ensp;
            <strong>Goûter &amp; tenue de sport</strong> inclus dans la scolarité.&ensp;·&ensp;
            <strong>Transport :</strong> taximètres disponibles sur demande.
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button component={Link} to="/sections/creche" variant="outlined" endIcon={<ChevronRight size={15} />}
            sx={{ borderColor: '#1B7A3E', color: '#1B7A3E', fontWeight: 700, px: 3.5, py: 1.1, borderRadius: '30px', '&:hover': { background: '#eaf4ee', borderColor: '#0f4a25' } }}>
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
  const montant  = params?.scolarite_montant
    ? Number(params.scolarite_montant).toLocaleString('fr-FR')
    : '50 000'

  const annee1 = annee.includes('-') ? annee.split('-')[0].trim() : annee

  const dossier = [
    { label: 'Extrait de naissance',       detail: 'Original obligatoire' },
    { label: 'Certificat de vaccination',  detail: 'PEV + hors PEV : Méningite, Hépatite, ROR, Typhim VI' },
    { label: '4 chemises cartonnées',      detail: 'Garçons = bleues · Filles = roses' },
    { label: '4 photos d\'identité',       detail: 'Couleur · À prendre directement à l\'école' },
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
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: ORANGE, letterSpacing: '3px', textTransform: 'uppercase' }}>
              {isOpen ? 'Inscriptions ouvertes' : "Dossier d'inscription"}
            </Typography>
            <Box sx={{ width: 28, height: 2, background: ORANGE }} />
          </Box>
          <Typography variant="h2" sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: { xs: 30, md: 44 }, fontWeight: 700, color: '#fff', lineHeight: 1.1, mb: 1 }}>
            {isOpen ? `Inscrivez votre enfant — ${annee}` : 'Préparez votre dossier'}
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: 13.5, maxWidth: 580, mx: 'auto', lineHeight: 1.8 }}>
            {isOpen
              ? `Inscriptions ouvertes ${horaires} au secrétariat du CPPE. Structure ouverte aux enfants de 1 an 6 mois à 5 ans.`
              : 'Les inscriptions sont actuellement fermées. Préparez dès maintenant les pièces nécessaires.'}
          </Typography>
        </Box>

        <Grid container spacing={2.5}>
          <Grid item xs={12} md={4}>
            <Box sx={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', p: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2.5 }}>
                <Box sx={{ width: 32, height: 32, borderRadius: '10px', background: `rgba(255,127,39,0.15)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={16} color={ORANGE} />
                </Box>
                <Typography sx={{ color: ORANGE, fontWeight: 700, fontSize: 12.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pièces à fournir</Typography>
              </Box>
              {dossier.map((item) => (
                <Box key={item.label} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25, mb: 2 }}>
                  <CheckCircle size={15} color={ORANGE} style={{ flexShrink: 0, marginTop: 2 }} />
                  <Box>
                    <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>{item.label}</Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.42)', fontSize: 11.5, lineHeight: 1.55, mt: 0.25 }}>{item.detail}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', p: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2.5 }}>
                <Box sx={{ width: 32, height: 32, borderRadius: '10px', background: `rgba(255,127,39,0.15)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CreditCard size={16} color={ORANGE} />
                </Box>
                <Typography sx={{ color: ORANGE, fontWeight: 700, fontSize: 12.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Scolarité {annee}</Typography>
              </Box>
              <Box sx={{ mb: 2.5, p: 2, background: `rgba(255,127,39,0.08)`, borderRadius: '12px', border: `1px solid rgba(255,127,39,0.2)` }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, mb: 0.25 }}>Montant annuel</Typography>
                <Typography sx={{ color: ORANGE, fontWeight: 800, fontSize: 24, lineHeight: 1 }}>{montant} FCFA</Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, mt: 0.5 }}>+ 6 000 F (fêtes scolaires &amp; photos)</Typography>
              </Box>
              {versements.map((v, i) => (
                <Box key={v.label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5, pb: 1.5, borderBottom: i < versements.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
                  <Box>
                    <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: 12.5, fontWeight: 600 }}>{v.label}</Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.38)', fontSize: 11 }}>{v.moment}</Typography>
                  </Box>
                  <Typography sx={{ color: ORANGE, fontWeight: 700, fontSize: 13, flexShrink: 0, ml: 1 }}>{v.montant}</Typography>
                </Box>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2.5 }}>
                <Box sx={{ width: 32, height: 32, borderRadius: '10px', background: `rgba(255,127,39,0.15)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Package size={16} color={ORANGE} />
                </Box>
                <Typography sx={{ color: ORANGE, fontWeight: 700, fontSize: 12.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Infos pratiques</Typography>
              </Box>
              {[
                { icon: Utensils,    label: 'Cantine scolaire',          detail: 'Facultative · 8 000 Frs / mois' },
                { icon: Shirt,       label: "Tenue de l'école",          detail: 'Vert / blanc petit carreau — à l\'actif des parents' },
                { icon: CheckCircle, label: 'Inclus dans la scolarité',   detail: 'Goûter + tenue de sport fournis' },
                { icon: Bus,         label: 'Transport',                 detail: 'Taximètres disponibles sur demande' },
              ].map(({ icon: Icon, label, detail }) => (
                <Box key={label} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25, mb: 2 }}>
                  <Box sx={{ width: 28, height: 28, borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mt: 0.2 }}>
                    <Icon size={13} color="rgba(255,255,255,0.55)" />
                  </Box>
                  <Box>
                    <Typography sx={{ color: 'rgba(255,255,255,0.88)', fontSize: 12.5, fontWeight: 600, lineHeight: 1.3 }}>{label}</Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 11.5, lineHeight: 1.5, mt: 0.2 }}>{detail}</Typography>
                  </Box>
                </Box>
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
function ContactRapide({ params }) {
  const adresse   = params?.adresse   || "Complexe Socio-Éducatif d'Issia, Haut-Sassandra"
  const telephone = params?.telephone || '07 07 18 65 59 / 05 06 48 22 01'
  const horaires  = params?.horaires  || 'Lun–Ven · 7h30 à 16h30'

  const infos = [
    { icon: MapPin, title: 'Adresse',   text: adresse,   color: '#1B7A3E' },
    { icon: Phone,  title: 'Téléphone', text: telephone, color: ORANGE },
    { icon: Clock,  title: 'Horaires',  text: horaires,  color: '#1B7A3E' },
  ]

  return (
    <Box sx={{ py: 6, background: '#fff' }}>
      <Container maxWidth="md">
        <Grid container spacing={2}>
          {infos.map(({ icon: Icon, title, text, color }) => (
            <Grid item xs={12} md={4} key={title}>
              <Box sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ width: 52, height: 52, borderRadius: '14px', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1.5 }}>
                  <Icon size={22} color={color} />
                </Box>
                <Typography sx={{ fontWeight: 700, fontSize: 13, color: '#0c1a10', mb: 0.5 }}>{title}</Typography>
                <Typography sx={{ fontSize: 13, color: '#6b7c70', lineHeight: 1.6 }}>{text}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
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

  const { data: parametresData } = useQuery({
    queryKey: ['parametres-public'],
    queryFn:  () => parametresApi.getAll(),
    staleTime: 5 * 60 * 1000,
  })

  const actualites = actualitesData?.data?.data?.data || []
  const params     = parametresData?.data?.data       || {}

  return (
    <Box>
      <Hero                params={params} />
      <InfoBar             params={params} />
      <MotDirecteurSection params={params} />
      <FlashInfosSection   actualites={actualites} />
      <SectionsSection />
      <InscriptionCTA      params={params} />
      <ContactRapide       params={params} />
    </Box>
  )
}