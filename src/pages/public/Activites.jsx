// ============================================================
// ACTIVITES LIST - Design Éditorial Premium
// ============================================================
import { useState } from 'react'
import { Box, Container, Grid, Typography, Chip, Avatar, IconButton } from '@mui/material'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { activitesApi } from '@/api/services'
import { LoadingSpinner } from '@/components/common'
import { 
  ArrowRight, 
  Sparkles, 
  Camera, 
  Clock, 
  Users, 
  Calendar,
  Heart,
  BookOpen,
  Star,
  Play,
  Image as ImageIcon
} from 'lucide-react'
import { getImageUrl } from '@/utils/imageHelper'

const ORANGE = '#FF7F27'

const ACT_STYLES = `
  @keyframes fadeInScale {
    from { opacity: 0; transform: scale(0.96); }
    to { opacity: 1; transform: scale(1); }
  }
  
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(30px); }
    to { opacity: 1; transform: translateX(0); }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
  
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(255,127,39,0.4); }
    50% { box-shadow: 0 0 0 10px rgba(255,127,39,0); }
  }
  
  .act-card {
    animation: fadeInScale 0.6s cubic-bezier(0.4, 0, 0.2, 1) both;
  }
  
  .act-card:nth-child(1) { animation-delay: 0.1s; }
  .act-card:nth-child(2) { animation-delay: 0.2s; }
  .act-card:nth-child(3) { animation-delay: 0.3s; }
  .act-card:nth-child(4) { animation-delay: 0.4s; }
  .act-card:nth-child(5) { animation-delay: 0.5s; }
  .act-card:nth-child(6) { animation-delay: 0.6s; }
  
  .act-media-gallery {
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .act-media-gallery:hover {
    transform: scale(1.02);
  }
  
  .act-title {
    background: linear-gradient(135deg, #0c1a10 0%, #1B7A3E 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .act-category-chip {
    transition: all 0.3s ease;
  }
  
  .act-category-chip:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(255,127,39,0.3);
  }
`

function ActMediaGallery({ act }) {
  const [imageError, setImageError] = useState({})
  const imageUrl = act.photo_couverture ? getImageUrl(act.photo_couverture) : null
  
  return (
    <Box sx={{ position: 'relative', height: '100%', minHeight: 280 }}>
      {/* Image principale */}
      <Box
        className="act-media-gallery"
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          borderRadius: '20px',
          overflow: 'hidden',
          background: 'linear-gradient(145deg, #f0f7f2, #e0ebe4)',
          boxShadow: '0 20px 40px -12px rgba(27,122,62,0.25)',
        }}
      >
        {imageUrl && !imageError[act.id] ? (
          <>
            <Box
              component="img"
              src={imageUrl}
              alt={act.titre}
              onError={() => setImageError(prev => ({ ...prev, [act.id]: true }))}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': { transform: 'scale(1.08)' },
              }}
            />
            {/* Overlay gradient */}
            <Box sx={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(12,26,16,0.4) 0%, transparent 50%, rgba(12,26,16,0.2) 100%)',
              opacity: 0.6,
              transition: 'opacity 0.3s',
              '&:hover': { opacity: 0.8 },
            }} />
          </>
        ) : (
          <Box sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
          }}>
            <ImageIcon size={48} color="#1B7A3E" style={{ opacity: 0.2 }} />
            <Typography sx={{ color: '#1B7A3E', opacity: 0.4, fontSize: 13, fontWeight: 500 }}>
              Image à venir
            </Typography>
          </Box>
        )}
      </Box>

      {/* Badge médias flottant */}
      {act.media_count > 0 && (
        <Box sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          px: 1.75,
          py: 0.75,
          borderRadius: '30px',
          background: 'rgba(12,26,16,0.85)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.15)',
          zIndex: 2,
          animation: 'float 4s ease-in-out infinite',
        }}>
          <Camera size={14} color="#fff" />
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>
            {act.media_count} {act.media_count > 1 ? 'photos' : 'photo'}
          </Typography>
        </Box>
      )}

      {/* Bouton play si activité vidéo (optionnel) */}
      {act.has_video && (
        <Box sx={{
          position: 'absolute',
          bottom: 16,
          left: 16,
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: ORANGE,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 8px 20px ${ORANGE}80`,
          zIndex: 2,
          transition: 'transform 0.3s',
          '&:hover': { transform: 'scale(1.1)' },
        }}>
          <Play size={20} color="#0f4a25" fill="#0f4a25" />
        </Box>
      )}
    </Box>
  )
}

function ActStats({ act }) {
  const stats = [
    { icon: Calendar, value: '2024', label: 'Année' },
    { icon: Users, value: act.participants_count || '24', label: 'Enfants' },
    { icon: Clock, value: '45 min', label: 'Durée' },
  ]

  return (
    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
      {stats.map(({ icon: Icon, value, label }) => (
        <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Box sx={{
            width: 32,
            height: 32,
            borderRadius: '10px',
            background: `rgba(27,122,62,0.08)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Icon size={16} color="#1B7A3E" />
          </Box>
          <Box>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#0c1a10', lineHeight: 1.2 }}>
              {value}
            </Typography>
            <Typography sx={{ fontSize: 10, color: '#6b7c70', fontWeight: 500 }}>
              {label}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  )
}

function ActCard({ act, index, variant = 'default' }) {
  const [isHovered, setIsHovered] = useState(false)
  const isFeatured = index === 0 && variant === 'featured'
  
  // Catégories simulées (à remplacer par des données réelles)
  const categories = ['Éveil', 'Créatif', 'Sportif'].slice(0, Math.floor(Math.random() * 3) + 1)

  return (
    <Box 
      className="act-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{ height: '100%' }}
    >
      <Box sx={{
        position: 'relative',
        height: '100%',
        background: '#fff',
        borderRadius: isFeatured ? '32px' : '28px',
        overflow: 'hidden',
        boxShadow: isHovered 
          ? '0 30px 60px -15px rgba(27,122,62,0.3)' 
          : '0 15px 35px -10px rgba(27,122,62,0.15)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        border: '1px solid rgba(27,122,62,0.08)',
        display: 'flex',
        flexDirection: 'column',
        transform: isHovered ? 'translateY(-8px)' : 'none',
      }}>
        {/* Badge "À la une" pour la première activité */}
        {isFeatured && (
          <Box sx={{
            position: 'absolute',
            top: 20,
            left: 20,
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 2,
            py: 1,
            borderRadius: '30px',
            background: ORANGE,
            boxShadow: `0 8px 20px ${ORANGE}60`,
          }}>
            <Star size={14} color="#0f4a25" fill="#0f4a25" />
            <Typography sx={{ fontSize: 11, fontWeight: 800, color: '#0f4a25', letterSpacing: '0.5px' }}>
              ACTIVITÉ PHARE
            </Typography>
          </Box>
        )}

        {/* Section média */}
        <Box sx={{ p: 2, pb: 0 }}>
          <ActMediaGallery act={act} />
        </Box>

        {/* Contenu */}
        <Box sx={{ p: 3, pt: 2.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Catégories */}
          <Box sx={{ display: 'flex', gap: 0.75, mb: 1.5, flexWrap: 'wrap' }}>
            {categories.map((cat, i) => (
              <Chip
                key={i}
                label={cat}
                size="small"
                className="act-category-chip"
                sx={{
                  background: `rgba(255,127,39,0.08)`,
                  color: ORANGE,
                  fontWeight: 600,
                  fontSize: 10,
                  height: 24,
                  '& .MuiChip-label': { px: 1.5 },
                  border: `1px solid ${ORANGE}20`,
                }}
              />
            ))}
          </Box>

          {/* Titre */}
          <Typography
            variant="h3"
            sx={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: isFeatured ? 32 : 26,
              fontWeight: 700,
              lineHeight: 1.2,
              mb: 1,
              color: '#0c1a10',
              transition: 'color 0.3s',
              '&:hover': { color: ORANGE },
            }}
          >
            <Link to={`/activites/${act.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              {act.titre}
            </Link>
          </Typography>

          {/* Description */}
          <Box
            sx={{
              fontSize: 14,
              color: '#5a6b5e',
              lineHeight: 1.7,
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
            dangerouslySetInnerHTML={{ 
              __html: act.description?.substring(0, 120) + (act.description?.length > 120 ? '...' : '') || '' 
            }}
          />

          {/* Statistiques */}
          <ActStats act={act} />

          {/* Footer avec actions */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: 2.5,
            pt: 2,
            borderTop: '1px solid rgba(27,122,62,0.08)',
          }}>
            {/* Auteur / Groupe */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: ORANGE,
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                {act.auteur?.charAt(0) || 'CP'}
              </Avatar>
              <Box>
                <Typography sx={{ fontSize: 11, color: '#6b7c70', lineHeight: 1 }}>
                  Encadré par
                </Typography>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#0c1a10' }}>
                  {act.auteur || 'Équipe pédagogique'}
                </Typography>
              </Box>
            </Box>

            {/* Bouton découverte */}
            <Link 
              to={`/activites/${act.slug}`}
              style={{ textDecoration: 'none' }}
            >
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                px: 2,
                py: 1,
                borderRadius: '30px',
                background: isHovered ? ORANGE : 'transparent',
                border: `1.5px solid ${isHovered ? ORANGE : 'rgba(27,122,62,0.2)'}`,
                transition: 'all 0.3s',
                cursor: 'pointer',
              }}>
                <Typography sx={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: isHovered ? '#0f4a25' : '#1B7A3E',
                  transition: 'color 0.3s',
                }}>
                  Explorer
                </Typography>
                <ArrowRight 
                  size={14} 
                  color={isHovered ? '#0f4a25' : '#1B7A3E'}
                  style={{ 
                    transition: 'transform 0.3s',
                    transform: isHovered ? 'translateX(4px)' : 'none',
                  }}
                />
              </Box>
            </Link>
          </Box>

          {/* Like / Favoris (optionnel) */}
          <Box sx={{
            position: 'absolute',
            top: 20,
            right: 20,
            zIndex: 10,
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'translateX(0)' : 'translateX(10px)',
            transition: 'all 0.3s',
          }}>
            <IconButton
              sx={{
                width: 36,
                height: 36,
                bgcolor: '#fff',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                '&:hover': { bgcolor: '#fff', transform: 'scale(1.1)' },
              }}
            >
              <Heart size={18} color={ORANGE} />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

function FeaturedActCard({ act, index }) {
  return <ActCard act={act} index={index} variant="featured" />
}

export default function Activites() {
  const { data, isLoading } = useQuery({
    queryKey: ['activites-public'],
    queryFn:  () => activitesApi.getAll(),
  })

  const activites = data?.data?.data?.data || []
  const totalActivites = activites.length

  return (
    <Box>
      <style>{ACT_STYLES}</style>

      {/* ══════════ HERO PREMIUM ══════════ */}
      <Box sx={{
        background: 'radial-gradient(ellipse at 50% 30%, #1a5e32 0%, #0a2e18 100%)',
        pt: { xs: 10, md: 14 },
        pb: { xs: 8, md: 12 },
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Éléments décoratifs */}
        <Box sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          background: 'radial-gradient(circle at 20% 50%, rgba(255,127,39,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,127,39,0.05) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Box sx={{ animation: 'slideInRight 0.8s ease' }}>
                <Chip
                  label="✨ ÉVEIL & DÉCOUVERTE"
                  sx={{
                    bgcolor: 'rgba(255,127,39,0.15)',
                    color: ORANGE,
                    fontWeight: 700,
                    fontSize: 11,
                    letterSpacing: '1.5px',
                    mb: 2,
                    border: `1px solid ${ORANGE}30`,
                  }}
                />
                
                <Typography
                  variant="h1"
                  sx={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: { xs: 48, md: 72 },
                    fontWeight: 700,
                    lineHeight: 1,
                    color: '#fff',
                    mb: 2,
                  }}
                >
                  L'aventure
                  <Box component="span" sx={{ color: ORANGE, display: 'block', fontStyle: 'italic' }}>
                    au cœur de l'enfance
                  </Box>
                </Typography>

                <Typography sx={{
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: { xs: 14, md: 16 },
                  lineHeight: 1.8,
                  maxWidth: 520,
                  mb: 3,
                }}>
                  Chaque jour, nos petits explorateurs vivent des expériences uniques à travers des activités soigneusement conçues pour éveiller leurs sens et développer leur créativité.
                </Typography>

                {/* Stats élégantes */}
                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                  <Box>
                    <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 700, color: ORANGE, lineHeight: 1 }}>
                      {totalActivites}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px' }}>
                      Activités
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 700, color: ORANGE, lineHeight: 1 }}>
                      150+
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px' }}>
                      Enfants heureux
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 700, color: ORANGE, lineHeight: 1 }}>
                      24/7
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px' }}>
                      Bienveillance
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={5}>
              {/* Badge circulaire décoratif */}
              <Box sx={{
                position: 'relative',
                width: 280,
                height: 280,
                margin: '0 auto',
              }}>
                <Box sx={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${ORANGE}20 0%, transparent 70%)`,
                  animation: 'pulse-glow 3s infinite',
                }} />
                <Box sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  background: '#fff',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
                }}>
                  <BookOpen size={48} color={ORANGE} />
                  <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 700, color: '#0c1a10', mt: 1 }}>
                    Apprendre
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: '#6b7c70' }}>
                    en s'amusant
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ══════════ GRILLE D'ACTIVITÉS ══════════ */}
      <Box sx={{ py: 8, background: '#f8faf9' }}>
        <Container maxWidth="lg">
          {/* En-tête de section */}
          <Box sx={{ mb: 5, textAlign: 'center' }}>
            <Chip
              label="NOTRE PROGRAMME"
              sx={{
                bgcolor: 'rgba(255,127,39,0.1)',
                color: ORANGE,
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: '1.5px',
                mb: 1.5,
              }}
            />
            <Typography
              variant="h2"
              sx={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: { xs: 32, md: 42 },
                fontWeight: 700,
                color: '#0c1a10',
                mb: 1,
              }}
            >
              Des activités pour <Box component="span" sx={{ color: ORANGE }}>grandir</Box>
            </Typography>
            <Typography sx={{ color: '#6b7c70', fontSize: 15, maxWidth: 560, mx: 'auto' }}>
              Découvrez notre sélection d'activités pensées pour l'épanouissement de chaque enfant
            </Typography>
          </Box>

          {/* Contenu */}
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <LoadingSpinner />
            </Box>
          ) : activites.length === 0 ? (
            <Box sx={{
              textAlign: 'center',
              py: 10,
              background: '#fff',
              borderRadius: '32px',
              border: '1px dashed rgba(27,122,62,0.2)',
            }}>
              <Box sx={{
                width: 80,
                height: 80,
                borderRadius: '30px',
                background: '#eaf4ee',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
              }}>
                <Sparkles size={40} color="#1B7A3E" style={{ opacity: 0.5 }} />
              </Box>
              <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, color: '#0c1a10', mb: 1 }}>
                Bientôt disponible
              </Typography>
              <Typography sx={{ color: '#6b7c70', fontSize: 15 }}>
                Notre programme d'activités arrive très bientôt
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {/* Première activité en vedette */}
              {activites[0] && (
                <Grid item xs={12}>
                  <FeaturedActCard act={activites[0]} index={0} />
                </Grid>
              )}
              
              {/* Activités suivantes en grille 2 colonnes */}
              {activites.slice(1).map((act, idx) => (
                <Grid item xs={12} md={6} key={act.id}>
                  <ActCard act={act} index={idx + 1} />
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
    </Box>
  )
}