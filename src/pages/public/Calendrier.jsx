import { Box, Container, Grid, Typography, Chip, Paper, Divider } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { calendrierApi } from '@/api/services'
import { LoadingSpinner, EmptyState } from '@/components/common'
import { CalendarDays } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

const TYPE_CONFIG = {
  vacances:  { bg: '#dbeafe', color: '#1d4ed8', label: 'Vacances' },
  ferie:     { bg: '#fce4ec', color: '#c62828', label: 'Jour férié' },
  rentree:   { bg: '#dcfce7', color: '#15803d', label: 'Rentrée' },
  evenement: { bg: '#fff3e0', color: '#7c3d00', label: 'Événement' },
  examen:    { bg: '#f3e8ff', color: '#6b21a8', label: 'Examen' },
}

// Groupe les événements par mois
function groupByMonth(events) {
  const months = {}
  events.forEach((ev) => {
    const key = ev.date_debut ? format(parseISO(ev.date_debut), 'MMMM yyyy', { locale: fr }) : 'Sans date'
    if (!months[key]) months[key] = []
    months[key].push(ev)
  })
  return months
}

export default function Calendrier() {
  const { data, isLoading } = useQuery({
    queryKey: ['calendrier-public'],
    queryFn:  () => calendrierApi.getAll(),
  })

  const events = data?.data?.data || []
  const grouped = groupByMonth(events)

  return (
    <Box>
      {/* HERO */}
      <Box sx={{ background: 'linear-gradient(135deg, #0f4a25, #1B7A3E)', py: { xs: 8, md: 11 }, px: 3, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Box sx={{ width: 56, height: 56, background: '#F5A623', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CalendarDays size={26} color="#0f4a25" />
            </Box>
          </Box>
          <Typography variant="h1" sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: { xs: 36, md: 54 }, fontWeight: 700, color: '#fff', lineHeight: 1.1, mb: 1.5 }}>
            Calendrier Scolaire 2025-2026
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: 14.5, maxWidth: 480, mx: 'auto' }}>
            Vacances, jours fériés, examens et événements importants de l'année scolaire.
          </Typography>
        </Container>
      </Box>

      {/* LÉGENDE */}
      <Box sx={{ background: '#fff', py: 2.5, px: 3, borderBottom: '1px solid #eaf4ee' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: 'center' }}>
            {Object.entries(TYPE_CONFIG).map(([, { label, bg, color }]) => (
              <Chip key={label} label={label} size="small" sx={{ background: bg, color, fontWeight: 700, fontSize: 11 }} />
            ))}
          </Box>
        </Container>
      </Box>

      {/* CONTENU */}
      <Box sx={{ py: 7, background: '#f4f8f5' }}>
        <Container maxWidth="lg">
          {isLoading ? (
            <LoadingSpinner />
          ) : events.length === 0 ? (
            <EmptyState icon={CalendarDays} title="Calendrier à venir" description="Le calendrier scolaire sera publié prochainement." />
          ) : (
            <Grid container spacing={3}>
              {Object.entries(grouped).map(([month, evs]) => (
                <Grid item xs={12} md={6} key={month}>
                  <Paper sx={{ overflow: 'hidden', borderRadius: '16px' }}>
                    {/* En-tête du mois */}
                    <Box sx={{ background: 'linear-gradient(135deg, #0f4a25, #1B7A3E)', px: 3, py: 2 }}>
                      <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: '#fff', textTransform: 'capitalize' }}>
                        {month}
                      </Typography>
                      <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
                        {evs.length} événement{evs.length > 1 ? 's' : ''}
                      </Typography>
                    </Box>

                    {/* Événements */}
                    <Box sx={{ p: 0 }}>
                      {evs.map((ev, idx) => {
                        const tc = TYPE_CONFIG[ev.type] || TYPE_CONFIG.evenement
                        const debut = ev.date_debut ? parseISO(ev.date_debut) : null
                        const fin   = ev.date_fin   ? parseISO(ev.date_fin)   : null
                        return (
                          <Box key={ev.id}>
                            {idx > 0 && <Divider />}
                            <Box
                              sx={{
                                display: 'flex',
                                gap: 2,
                                alignItems: 'flex-start',
                                p: 2.5,
                                '&:hover': { background: '#f9fbf9' },
                                transition: 'background 0.15s',
                              }}
                            >
                              {/* Date badge */}
                              <Box
                                sx={{
                                  minWidth: 48,
                                  textAlign: 'center',
                                  background: tc.bg,
                                  borderRadius: '10px',
                                  py: 1,
                                  px: 0.5,
                                  flexShrink: 0,
                                }}
                              >
                                {debut && (
                                  <>
                                    <Typography sx={{ fontSize: 18, fontWeight: 800, color: tc.color, lineHeight: 1 }}>
                                      {format(debut, 'dd')}
                                    </Typography>
                                    <Typography sx={{ fontSize: 10, color: tc.color, fontWeight: 600, textTransform: 'uppercase' }}>
                                      {format(debut, 'MMM', { locale: fr })}
                                    </Typography>
                                  </>
                                )}
                              </Box>

                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                                  <Typography sx={{ fontWeight: 700, fontSize: 14, color: '#0c1a10' }}>
                                    {ev.label}
                                  </Typography>
                                  <Chip label={tc.label} size="small" sx={{ background: tc.bg, color: tc.color, fontWeight: 700, fontSize: 10 }} />
                                </Box>

                                {debut && fin && format(debut, 'dd/MM') !== format(fin, 'dd/MM') && (
                                  <Typography sx={{ fontSize: 12, color: '#9ca3af' }}>
                                    Du {format(debut, 'dd MMM', { locale: fr })} au {format(fin, 'dd MMM yyyy', { locale: fr })}
                                  </Typography>
                                )}

                                {ev.description && (
                                  <Typography sx={{ fontSize: 12.5, color: '#6b7c70', mt: 0.5 }}>
                                    {ev.description}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </Box>
                        )
                      })}
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
    </Box>
  )
}