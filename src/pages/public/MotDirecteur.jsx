// ============================================================
// MOT DU DIRECTEUR
// ============================================================
import { Box, Container, Grid, Typography, Paper } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { parametresApi } from '@/api/services'
import { LoadingSpinner } from '@/components/common'
import { Quote } from 'lucide-react'

export default function MotDirecteur() {
  const { data, isLoading } = useQuery({
    queryKey: ['parametres-public'],
    queryFn:  () => parametresApi.getAll(),
  })

  const params = data?.data?.data || {}

  return (
    <Box>
      <Box sx={{ background: 'linear-gradient(135deg, #0f4a25, #1B7A3E)', py: { xs: 8, md: 12 }, px: 3, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#F5A623', letterSpacing: '3px', textTransform: 'uppercase', mb: 1.5 }}>
            Message officiel
          </Typography>
          <Typography variant="h1" sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: { xs: 36, md: 54 }, fontWeight: 700, color: '#fff', lineHeight: 1.1 }}>
            Mot du Directeur
          </Typography>
        </Container>
      </Box>

      <Box sx={{ py: 10, background: '#fff' }}>
        <Container maxWidth="md">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <Grid container spacing={6} alignItems="flex-start">
              {/* PHOTO */}
              <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 180,
                    height: 180,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #eaf4ee, #1B7A3E)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    fontSize: 64,
                    overflow: 'hidden',
                    border: '4px solid #F5A623',
                  }}
                >
                  {params.photo_directeur ? (
                    <Box component="img" src={params.photo_directeur} alt="Directeur" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span>👤</span>
                  )}
                </Box>
                <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: '#0c1a10' }}>
                  {params.nom_directeur || 'Le Directeur'}
                </Typography>
                <Typography sx={{ fontSize: 12.5, color: '#6b7c70', mt: 0.5 }}>
                  Directeur du CPPE d'Issia
                </Typography>
                <Box sx={{ mt: 1.5, px: 2, py: 0.75, background: '#eaf4ee', borderRadius: '20px', display: 'inline-block' }}>
                  <Typography sx={{ fontSize: 11, color: '#1B7A3E', fontWeight: 700 }}>MFFE — Côte d'Ivoire</Typography>
                </Box>
              </Grid>

              {/* MESSAGE */}
              <Grid item xs={12} md={8}>
                <Box sx={{ position: 'relative' }}>
                  <Quote size={48} color="#eaf4ee" style={{ position: 'absolute', top: -16, left: -16 }} />
                  <Typography
                    sx={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: { xs: 17, md: 20 },
                      lineHeight: 1.85,
                      color: '#2d3a30',
                      position: 'relative',
                      zIndex: 1,
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {params.mot_directeur ||
                      `Chers parents, chers enfants,\n\nBienvenue au Centre de Protection de la Petite Enfance d'Issia. Notre établissement est un lieu d'éveil, de découverte et d'épanouissement pour vos tout-petits.\n\nNotre équipe dédiée s'engage chaque jour à offrir un environnement bienveillant, stimulant et sécurisé. Nous travaillons main dans la main avec les familles pour accompagner chaque enfant dans son développement unique.\n\nEnsemble, construisons un avenir lumineux pour nos enfants.\n\nCordialement,`}
                  </Typography>
                  <Box sx={{ mt: 3, pt: 2, borderTop: '2px solid #eaf4ee' }}>
                    <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 700, color: '#1B7A3E' }}>
                      {params.nom_directeur || 'Le Directeur'}
                    </Typography>
                    <Typography sx={{ fontSize: 12.5, color: '#6b7c70' }}>CPPE d'Issia — Haut-Sassandra</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          )}
        </Container>
      </Box>
    </Box>
  )
}