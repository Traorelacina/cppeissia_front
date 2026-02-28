// ============================================================
// ABOUT PAGE
// ============================================================
import { useState, useEffect, useRef } from 'react'
import { Box, Container, Grid, Typography, IconButton } from '@mui/material'
import { SectionHeader } from '@/components/common'
import { Shield, Heart, Users, Star, MapPin, Building2, Award, ChevronLeft, ChevronRight } from 'lucide-react'
import etablissementImg from '../../assets/cppe-etablissement.jpg'

export function About() {
  const valeurs = [
    { icon: Heart,  titre: 'Bienveillance', texte: "Chaque enfant est accueilli dans un environnement chaleureux, sécurisé et propice à son épanouissement." },
    { icon: Shield, titre: 'Protection',    texte: "Nous garantissons la sécurité physique et affective de chaque enfant confié à notre établissement." },
    { icon: Users,  titre: 'Inclusion',     texte: "Tous les enfants, quelles que soient leurs différences, méritent les mêmes chances d'apprentissage." },
    { icon: Star,   titre: 'Excellence',    texte: "Une équipe pédagogique qualifiée, engagée dans la formation continue et la qualité de l'enseignement." },
  ]

  const infos = [
    { icon: Building2, titre: 'Établissement public',  desc: "Sous tutelle du MFFE — République de Côte d'Ivoire" },
    { icon: MapPin,    titre: 'Localisation',          desc: "Complexe Socio-Éducatif d'Issia, Haut-Sassandra" },
    { icon: Users,     titre: "Capacité d'accueil",    desc: 'Plus de 200 enfants par année scolaire' },
    { icon: Award,     titre: 'Sections proposées',    desc: 'Crèche, Petite Section, Moyenne Section, Grande Section' },
  ]

  // ── Carousel valeurs ──────────────────────────────────────
  const [current, setCurrent] = useState(0)
  const [paused,  setPaused]  = useState(false)
  const timerRef = useRef(null)

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setCurrent((p) => (p + 1) % valeurs.length)
    }, 3000)
  }

  useEffect(() => {
    if (!paused) startTimer()
    return () => clearInterval(timerRef.current)
  }, [paused])

  const goTo = (idx) => {
    setCurrent(idx)
    clearInterval(timerRef.current)
    if (!paused) startTimer()
  }

  return (
    <Box>
      {/* ── HERO ── */}
      <Box sx={{ background: 'linear-gradient(135deg, #0f4a25, #1B7A3E)', py: { xs: 8, md: 12 }, px: 3 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#F5A623', letterSpacing: '3px', textTransform: 'uppercase', mb: 1.5 }}>
            Notre établissement
          </Typography>
          <Typography variant="h1" sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: { xs: 38, md: 58 }, fontWeight: 700, color: '#fff', lineHeight: 1.1, mb: 2 }}>
            Présentation du CPPE d'Issia
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: 15, maxWidth: 520, mx: 'auto', lineHeight: 1.8 }}>
            Un établissement public sous la tutelle du Ministère de la Femme, de la Famille et de l'Enfant, au cœur d'Issia, Haut-Sassandra.
          </Typography>
        </Container>
      </Box>

      {/* ── CORPS : Texte | [Infos + Image côte à côte] ── */}
      <Box sx={{ py: 9, background: '#fff' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="stretch">

            {/* COL 1 — Texte mission */}
            <Grid item xs={12} md={5}>
              <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <SectionHeader eyebrow="Qui sommes-nous" title="Notre mission au quotidien" />
                <Typography sx={{ color: '#6b7c70', fontSize: 14.5, lineHeight: 1.9, mb: 2 }}>
                  Le Centre de Protection de la Petite Enfance d'Issia (CPPE) est un établissement public créé pour assurer l'accueil, l'éducation et l'épanouissement des jeunes enfants de 1 an 6 mois à 5 ans dans la ville d'Issia, région du Haut-Sassandra.
                </Typography>
                <Typography sx={{ color: '#6b7c70', fontSize: 14.5, lineHeight: 1.9, mb: 2 }}>
                  Rattaché au Complexe Socio-Éducatif d'Issia et placé sous la tutelle du Ministère de la Femme, de la Famille et de l'Enfant de la République de Côte d'Ivoire, le CPPE propose un cadre éducatif structuré, bienveillant et adapté aux besoins développementaux de chaque enfant.
                </Typography>
                <Typography sx={{ color: '#6b7c70', fontSize: 14.5, lineHeight: 1.9 }}>
                  Notre équipe d'éducateurs et de personnel qualifié œuvre chaque jour pour offrir aux enfants un environnement stimulant qui prépare leur entrée à l'école primaire dans les meilleures conditions.
                </Typography>
              </Box>
            </Grid>

            {/* COL 2 — Infos clés */}
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{
                background: '#f4f8f5',
                borderRadius: '20px',
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}>
                {infos.map(({ icon: Icon, titre, desc }, idx) => (
                  <Box key={titre}>
                    <Box sx={{ display: 'flex', gap: 1.75, py: 2 }}>
                      <Box sx={{ width: 38, height: 38, borderRadius: '10px', background: '#fff', boxShadow: '0 2px 8px rgba(27,122,62,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={17} color="#1B7A3E" />
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 700, fontSize: 13, color: '#0c1a10', lineHeight: 1.3 }}>{titre}</Typography>
                        <Typography sx={{ fontSize: 12, color: '#6b7c70', mt: 0.3, lineHeight: 1.55 }}>{desc}</Typography>
                      </Box>
                    </Box>
                    {idx < infos.length - 1 && (
                      <Box sx={{ height: 1, background: 'rgba(27,122,62,0.1)', mx: 0.5 }} />
                    )}
                  </Box>
                ))}
              </Box>
            </Grid>

            {/* COL 3 — Image à la même hauteur que COL 2 */}
            <Grid item xs={12} sm={6} md={4}>
              {/* Wrapper qui s'étire sur toute la hauteur de la ligne */}
              <Box sx={{ height: '100%', position: 'relative', minHeight: { xs: 280, md: 0 } }}>

                {/* Ombre décorée dorée décalée */}
                <Box sx={{ position: 'absolute', top: 12, left: 12, right: -8, bottom: -8, borderRadius: '22px', background: 'linear-gradient(135deg, #F5A623, #e0951f)', zIndex: 0 }} />
                {/* Cadre vert léger */}
                <Box sx={{ position: 'absolute', top: 5, left: 5, right: -2, bottom: -2, borderRadius: '20px', border: '2px solid rgba(27,122,62,0.18)', zIndex: 1 }} />

                {/* Image — prend toute la hauteur de la colonne */}
                <Box sx={{
                  position: 'relative',
                  zIndex: 2,
                  height: '100%',
                  minHeight: { xs: 280, md: 0 },
                  borderRadius: '18px',
                  overflow: 'hidden',
                  boxShadow: '0 16px 48px rgba(0,0,0,0.18)',
                }}>
                  <Box
                    component="img"
                    src={etablissementImg}
                    alt="Portail du Complexe Socio-Éducatif d'Issia"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center 30%',
                      display: 'block',
                      transition: 'transform 6s ease',
                      '&:hover': { transform: 'scale(1.05)' },
                    }}
                  />
                  {/* Dégradé bas */}
                  <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(to top, rgba(10,46,24,0.88) 0%, transparent 100%)', pointerEvents: 'none' }} />

                  {/* Légende */}
                  <Box sx={{ position: 'absolute', bottom: 14, left: 14, right: 14, zIndex: 3 }}>
                    <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, fontWeight: 700, color: '#fff', lineHeight: 1.3, mb: 0.5 }}>
                      Complexe Socio-Éducatif d'Issia
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#F5A623', animation: 'pulse-dot 2s infinite', flexShrink: 0 }} />
                      <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.72)', fontWeight: 500 }}>
                        Haut-Sassandra · Côte d'Ivoire
                      </Typography>
                    </Box>
                  </Box>

                  {/* Badge haut droite */}
                  <Box sx={{ position: 'absolute', top: 12, right: 12, background: 'rgba(245,166,35,0.92)', backdropFilter: 'blur(6px)', borderRadius: '8px', px: 1.25, py: 0.5, zIndex: 3 }}>
                    <Typography sx={{ fontSize: 10.5, fontWeight: 800, color: '#0f4a25' }}>CPPE Issia</Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>

          </Grid>
        </Container>
      </Box>

      {/* ── VALEURS — Carousel auto-défilant ── */}
      <Box
        sx={{ py: 8, background: '#f4f8f5' }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <Container maxWidth="lg">
          <SectionHeader eyebrow="Nos valeurs" title="Ce qui nous guide" centered />

          <Box sx={{ mt: 4, position: 'relative' }}>
            {/* ── Desktop : 4 cartes visibles simultanément ── */}
            <Box sx={{ display: { xs: 'none', md: 'block' }, overflow: 'hidden' }}>
              <Box
                sx={{
                  display: 'flex',
                  transition: 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)',
                  // Décale de 25% par carte (4 cartes = 100% visible à la fois)
                  transform: `translateX(-${current * 25}%)`,
                  // Largeur totale = 4 cartes × 25% chacune = 100% affiché
                  // Mais on a 4 cartes et on veut les voir toutes → pas de défilement visible sur desktop
                  // On utilise un effet de mise en avant de la carte active
                  gap: 3,
                }}
              >
                {valeurs.map(({ icon: Icon, titre, texte }, idx) => (
                  <Box
                    key={idx}
                    onClick={() => goTo(idx)}
                    sx={{
                      flex: '0 0 calc(25% - 12px)',
                      background: '#fff',
                      borderRadius: '18px',
                      p: 3,
                      border: '1.5px solid',
                      borderColor: idx === current ? '#1B7A3E' : '#dae8df',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      transform: idx === current ? 'translateY(-6px)' : 'translateY(0)',
                      boxShadow: idx === current
                        ? '0 12px 32px rgba(27,122,62,0.15)'
                        : '0 2px 8px rgba(0,0,0,0.04)',
                    }}
                  >
                    <Box sx={{
                      width: 52, height: 52, borderRadius: '14px',
                      background: idx === current ? '#1B7A3E' : '#eaf4ee',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      mb: 2, transition: 'all 0.3s',
                    }}>
                      <Icon size={24} color={idx === current ? '#fff' : '#1B7A3E'} />
                    </Box>
                    <Typography sx={{ fontWeight: 700, fontSize: 16, color: '#0c1a10', mb: 1 }}>{titre}</Typography>
                    <Typography sx={{ fontSize: 13, color: '#6b7c70', lineHeight: 1.7 }}>{texte}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* ── Mobile : carousel avec flèches ── */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1.5 }}>
              <IconButton onClick={() => goTo((current - 1 + valeurs.length) % valeurs.length)} sx={{ bgcolor: '#fff', border: '1px solid #dae8df', flexShrink: 0, '&:hover': { bgcolor: '#f4f8f5' } }}>
                <ChevronLeft size={18} color="#1B7A3E" />
              </IconButton>
              <Box sx={{ flex: 1, overflow: 'hidden', borderRadius: '18px' }}>
                <Box sx={{ display: 'flex', transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1)', transform: `translateX(-${current * 100}%)` }}>
                  {valeurs.map(({ icon: Icon, titre, texte }, idx) => (
                    <Box key={idx} sx={{ flex: '0 0 100%', background: '#fff', borderRadius: '18px', p: 3, border: '1px solid #dae8df' }}>
                      <Box sx={{ width: 48, height: 48, borderRadius: '12px', background: '#eaf4ee', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                        <Icon size={22} color="#1B7A3E" />
                      </Box>
                      <Typography sx={{ fontWeight: 700, fontSize: 16, color: '#0c1a10', mb: 1 }}>{titre}</Typography>
                      <Typography sx={{ fontSize: 13, color: '#6b7c70', lineHeight: 1.7 }}>{texte}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
              <IconButton onClick={() => goTo((current + 1) % valeurs.length)} sx={{ bgcolor: '#fff', border: '1px solid #dae8df', flexShrink: 0, '&:hover': { bgcolor: '#f4f8f5' } }}>
                <ChevronRight size={18} color="#1B7A3E" />
              </IconButton>
            </Box>

            {/* Dots indicateurs */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 3 }}>
              {valeurs.map((_, idx) => (
                <Box
                  key={idx}
                  onClick={() => goTo(idx)}
                  sx={{
                    height: 6,
                    borderRadius: '3px',
                    bgcolor: idx === current ? '#1B7A3E' : '#dae8df',
                    width: idx === current ? 28 : 8,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default About