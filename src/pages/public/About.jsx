// ============================================================
// ABOUT PAGE
// ============================================================
import { Box, Container, Grid, Typography } from '@mui/material'
import { SectionHeader } from '@/components/common'
import { Shield, Heart, Users, Star, MapPin, Building2, Award } from 'lucide-react'
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

  return (
    <Box>
      {/* ── HERO ── */}
      <Box sx={{ background: 'linear-gradient(135deg, #0f4a25, #1B7A3E)', py: { xs: 8, md: 12 }, px: 3 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#F5A623', letterSpacing: '3px', textTransform: 'uppercase', mb: 1.5 }}>
            Notre établissement
          </Typography>
          <Typography variant="h1" sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: { xs: 42, md: 64 }, fontWeight: 700, color: '#fff', lineHeight: 1.1, mb: 2 }}>
            Présentation du CPPE d'Issia
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: 18, maxWidth: 600, mx: 'auto', lineHeight: 1.8 }}>
            Un établissement public sous la tutelle du Ministère de la Femme, de la Famille et de l'Enfant, au cœur d'Issia, Haut-Sassandra.
          </Typography>
        </Container>
      </Box>

      {/* ── CORPS : Texte | Infos | Image ── */}
      <Box sx={{ py: 9, background: '#fff' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="stretch">
            {/* COL 1 — Texte mission */}
            <Grid item xs={12} md={5}>
              <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <SectionHeader eyebrow="Qui sommes-nous" title="Notre mission au quotidien" />
                <Typography sx={{ color: '#2c4a34', fontSize: 16.5, lineHeight: 1.9, mb: 2 }}>
                  Le Centre de Protection de la Petite Enfance d'Issia (CPPE) est un établissement public créé pour assurer l'accueil, l'éducation et l'épanouissement des jeunes enfants de 1 an 6 mois à 5 ans dans la ville d'Issia, région du Haut-Sassandra.
                </Typography>
                <Typography sx={{ color: '#2c4a34', fontSize: 16.5, lineHeight: 1.9, mb: 2 }}>
                  Rattaché au Complexe Socio-Éducatif d'Issia et placé sous la tutelle du Ministère de la Femme, de la Famille et de l'Enfant de la République de Côte d'Ivoire, le CPPE propose un cadre éducatif structuré, bienveillant et adapté aux besoins développementaux de chaque enfant.
                </Typography>
                <Typography sx={{ color: '#2c4a34', fontSize: 16.5, lineHeight: 1.9 }}>
                  Notre équipe d'éducateurs et de personnel qualifié œuvre chaque jour pour offrir aux enfants un environnement stimulant qui prépare leur entrée à l'école primaire dans les meilleures conditions.
                </Typography>
              </Box>
            </Grid>

            {/* COL 2 — Infos clés */}
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{
                background: '#f8fbf9',
                borderRadius: '24px',
                p: 3.5,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(27,122,62,0.08)',
              }}>
                {infos.map(({ icon: Icon, titre, desc }, idx) => (
                  <Box key={titre}>
                    <Box sx={{ display: 'flex', gap: 2, py: 2 }}>
                      <Box sx={{ 
                        width: 48, 
                        height: 48, 
                        borderRadius: '14px', 
                        background: '#fff', 
                        boxShadow: '0 4px 12px rgba(27,122,62,0.12)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        flexShrink: 0 
                      }}>
                        <Icon size={22} color="#1B7A3E" />
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 700, fontSize: 16, color: '#1a2e20', lineHeight: 1.3 }}>{titre}</Typography>
                        <Typography sx={{ fontSize: 14.5, color: '#4a6b55', mt: 0.5, lineHeight: 1.5 }}>{desc}</Typography>
                      </Box>
                    </Box>
                    {idx < infos.length - 1 && (
                      <Box sx={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(27,122,62,0.2), transparent)', mx: 1 }} />
                    )}
                  </Box>
                ))}
              </Box>
            </Grid>

            {/* COL 3 — Image */}
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ height: '100%', position: 'relative' }}>
                <Box sx={{ 
                  position: 'relative',
                  height: '100%',
                  minHeight: 320,
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px rgba(0,40,20,0.25)',
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
                      transition: 'transform 8s ease',
                      '&:hover': { transform: 'scale(1.08)' },
                    }}
                  />
                  <Box sx={{ 
                    position: 'absolute', 
                    bottom: 0, 
                    left: 0, 
                    right: 0, 
                    height: '60%', 
                    background: 'linear-gradient(to top, rgba(10,46,24,0.92) 0%, transparent 100%)',
                    pointerEvents: 'none' 
                  }} />
                  <Box sx={{ 
                    position: 'absolute', 
                    bottom: 20, 
                    left: 20, 
                    right: 20, 
                    zIndex: 3 
                  }}>
                    <Typography sx={{ 
                      fontFamily: "'Cormorant Garamond', serif", 
                      fontSize: 18, 
                      fontWeight: 700, 
                      color: '#fff', 
                      lineHeight: 1.3, 
                      mb: 0.5 
                    }}>
                      Complexe Socio-Éducatif d'Issia
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ 
                        width: 8, 
                        height: 8, 
                        borderRadius: '50%', 
                        background: '#F5A623',
                        flexShrink: 0 
                      }} />
                      <Typography sx={{ 
                        fontSize: 14, 
                        color: 'rgba(255,255,255,0.85)', 
                        fontWeight: 500,
                        letterSpacing: '0.3px'
                      }}>
                        Haut-Sassandra · Côte d'Ivoire
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ 
                    position: 'absolute', 
                    top: 16, 
                    right: 16, 
                    background: 'rgba(245,166,35,0.95)', 
                    backdropFilter: 'blur(8px)', 
                    borderRadius: '12px', 
                    px: 1.5, 
                    py: 0.75, 
                    zIndex: 3,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                  }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 800, color: '#0a3a1e' }}>CPPE Issia</Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── VALEURS — Affichage fixe des 4 éléments ── */}
      <Box sx={{ py: 10, background: '#f8fbf9' }}>
        <Container maxWidth="lg">
          <SectionHeader eyebrow="Nos valeurs" title="Ce qui nous guide" centered />
          
          <Grid container spacing={3} sx={{ mt: 3 }}>
            {valeurs.map(({ icon: Icon, titre, texte }, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box sx={{
                  background: '#fff',
                  borderRadius: '24px',
                  p: 4,
                  height: '100%',
                  border: '1px solid #e0ebe4',
                  transition: 'all 0.4s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 20px 40px rgba(27,122,62,0.2)',
                    borderColor: '#1B7A3E',
                  },
                }}>
                  <Box sx={{
                    width: 72,
                    height: 72,
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, #e8f3ec, #d4e8dc)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                  }}>
                    <Icon size={34} color="#1B7A3E" strokeWidth={1.5} />
                  </Box>
                  <Typography sx={{ 
                    fontWeight: 700, 
                    fontSize: 22, 
                    color: '#1a2e20', 
                    mb: 1.5,
                    fontFamily: "'Cormorant Garamond', serif",
                  }}>
                    {titre}
                  </Typography>
                  <Typography sx={{ 
                    fontSize: 16, 
                    color: '#4a6b55', 
                    lineHeight: 1.7,
                    maxWidth: 220,
                    mx: 'auto'
                  }}>
                    {texte}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  )
}

export default About