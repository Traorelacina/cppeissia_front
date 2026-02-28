import { useState } from 'react'
import { Box, Container, Grid, Typography, TextField, Button } from '@mui/material'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, ArrowRight } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import api from '@/api'
import toast from 'react-hot-toast'
import ecoleImage from '../../assets/ecole.jpg'

const CONTACT_STYLES = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse-dot {
    0%, 100% { box-shadow: 0 0 0 0 rgba(15,74,37,0.5); }
    50%       { box-shadow: 0 0 0 6px rgba(15,74,37,0); }
  }
  @keyframes pulseRing {
    0%   { transform: scale(1);    opacity: 0.55; }
    70%  { transform: scale(1.6);  opacity: 0;    }
    100% { transform: scale(1.6);  opacity: 0;    }
  }
  .cfade   { animation: fadeInUp 0.6s ease both; }
  .cfade-1 { animation-delay: 0.05s; }
  .cfade-2 { animation-delay: 0.15s; }
  .cfade-3 { animation-delay: 0.25s; }
  .cfade-4 { animation-delay: 0.35s; }
`

const GREEN_MAIN = '#1B7A3E'
const GREEN_DARK = '#0f4a25'
const GREEN_CTA  = 'linear-gradient(135deg, #0f4a25, #1B7A3E)'
const GREEN_HOV  = 'linear-gradient(135deg, #0a2e18, #0f4a25)'
const ORANGE     = '#F5A623'
const TEXT_MUTED = 'rgba(255,255,255,0.65)'
const BORDER_DIM = 'rgba(255,255,255,0.1)'
const GRID_LINES = 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)'

function InfoCard({ icon: Icon, titre, valeur, accent, delay }) {
  return (
    <Box
      className={`cfade ${delay}`}
      sx={{
        display: 'flex', alignItems: 'center', gap: 2,
        px: 2.5, py: 1.75, borderRadius: '12px',
        background: 'rgba(255,255,255,0.055)',
        border: `1px solid ${BORDER_DIM}`,
        transition: 'all 0.2s',
        '&:hover': {
          background: 'rgba(255,255,255,0.09)',
          border: `1px solid ${accent}40`,
          transform: 'translateX(4px)',
        },
      }}
    >
      <Box sx={{
        width: 40, height: 40, borderRadius: '12px',
        background: `${accent}18`, border: `1px solid ${accent}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon size={18} color={accent} strokeWidth={1.75} />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75, flexWrap: 'wrap', flex: 1, minWidth: 0 }}>
        <Typography sx={{
          fontSize: 9.5, fontWeight: 700, color: accent,
          textTransform: 'uppercase', letterSpacing: '1.8px',
          whiteSpace: 'nowrap', flexShrink: 0,
        }}>
          {titre}
        </Typography>
        <Box sx={{ width: 1, height: 16, background: 'rgba(255,255,255,0.14)', flexShrink: 0 }} />
        <Typography sx={{
          fontSize: 13, color: 'rgba(235,248,240,0.82)',
          whiteSpace: 'pre-line', lineHeight: 1.55, fontWeight: 500, flex: 1,
        }}>
          {valeur}
        </Typography>
      </Box>
    </Box>
  )
}

function StyledField({ label, error, helperText, children }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.6 }}>
      <Typography component="label" sx={{
        fontSize: 11, fontWeight: 700,
        color: error ? '#ef4444' : '#3d6b45',
        textTransform: 'uppercase', letterSpacing: '0.6px',
      }}>
        {label}
      </Typography>
      <Box sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: '10px', background: '#f4f8f5',
          fontSize: 14, color: '#0c1a10',
          '& fieldset': { borderColor: error ? '#ef4444' : '#dae8df', borderWidth: '1.5px' },
          '&:hover fieldset': { borderColor: error ? '#ef4444' : GREEN_MAIN },
          '&.Mui-focused fieldset': {
            borderColor: GREEN_MAIN, borderWidth: '2px',
            boxShadow: `0 0 0 3px ${GREEN_MAIN}18`,
          },
        },
        '& .MuiInputBase-input': { py: 1.35, px: 1.6 },
        '& .MuiInputBase-inputMultiline': { py: 1.4, px: 1.6 },
      }}>
        {children}
      </Box>
      {helperText && (
        <Typography sx={{ fontSize: 11, color: '#ef4444', ml: 0.5 }}>{helperText}</Typography>
      )}
    </Box>
  )
}

export default function Contact() {
  const [sent, setSent] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const mutation = useMutation({
    mutationFn: (data) => api.post('/contact', data),
    onSuccess: () => { setSent(true); reset() },
    onError:   () => toast.error('Une erreur est survenue. Veuillez réessayer.'),
  })

  return (
    <Box>
      <style>{CONTACT_STYLES}</style>

      {/* ══════════ HERO — même structure que Home ══════════ */}
      <Box sx={{
        background: 'linear-gradient(135deg, #0a2e18 0%, #0f4a25 50%, #1a5e32 100%)',
        pt: { xs: 9, md: 0 }, pb: 0,
        position: 'relative', overflow: 'hidden',
        // ── Même grid 55/45 que Home ──
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '55% 45%' },
        minHeight: { md: '520px' },
      }}>
        {/* Grille de fond */}
        <Box sx={{
          position: 'absolute', inset: 0,
          backgroundImage: GRID_LINES,
          backgroundSize: '48px 48px',
          pointerEvents: 'none',
        }} />
        {/* Halo orange */}
        <Box sx={{
          position: 'absolute', width: 600, height: 600,
          right: -200, top: -200, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,166,35,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* COLONNE GAUCHE — Chip + H1 + sous-titre */}
        <Box sx={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          px: { xs: 3, md: 5 }, py: { xs: 10, md: 6 },
          position: 'relative', zIndex: 1,
        }}>
          <Box className="cfade cfade-1" sx={{
            display: 'inline-flex', alignItems: 'center', gap: 1,
            mb: 3, px: 2, py: 0.55, alignSelf: 'flex-start',
            borderRadius: '20px',
            background: 'rgba(245,166,35,0.12)',
            border: '1px solid rgba(245,166,35,0.3)',
          }}>
            <Box sx={{ width: 7, height: 7, borderRadius: '50%', background: ORANGE, animation: 'pulse-dot 2s infinite' }} />
            <Typography sx={{ fontSize: 11, fontWeight: 600, color: ORANGE, letterSpacing: '0.3px' }}>
              🇨🇮 Ministère de la Femme, de la Famille et de l'Enfant
            </Typography>
          </Box>

          <Typography
            className="cfade cfade-2"
            variant="h1"
            sx={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: { xs: 40, md: 60 },
              fontWeight: 700, color: '#fff', lineHeight: 1.0, mb: 2,
              animation: 'fadeInUp 0.7s ease forwards',
            }}
          >
            Contactez{' '}
            <Box component="em" sx={{ color: ORANGE, fontStyle: 'italic' }}>le CPPE</Box>
            <br />d'Issia
          </Typography>

          <Typography
            className="cfade cfade-3"
            sx={{
              color: TEXT_MUTED, fontSize: { xs: 13, md: 14 }, lineHeight: 1.8,
              maxWidth: 380, mb: 4,
              borderLeft: `3px solid ${ORANGE}`, pl: 2,
              animation: 'fadeInUp 0.7s 0.15s ease both',
            }}
          >
            Notre équipe est disponible du{' '}
            <Box component="strong" sx={{ color: ORANGE }}>lundi au vendredi de 7h30 à 16h30</Box>{' '}
            pour répondre à toutes vos questions sur l'inscription, les sections ou la vie au CPPE.
          </Typography>
        </Box>

        {/* COLONNE DROITE — Image identique Home */}
        <Box sx={{
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center', justifyContent: 'center',
          px: 4, py: 6,
          position: 'relative', zIndex: 1,
        }}>
          {/* Bordure décalée — identique Home */}
          <Box sx={{
            position: 'absolute',
            width: 'calc(100% - 56px)',
            aspectRatio: '1 / 1',
            maxWidth: 420,
            border: '2px solid rgba(245,166,35,0.4)',
            borderRadius: '24px',
            top: '50%', left: '50%',
            transform: 'translate(calc(-50% + 10px), calc(-50% + 10px))',
            pointerEvents: 'none',
          }} />
          {/* Image — identique Home */}
          <Box sx={{
            width: '100%', maxWidth: 420,
            aspectRatio: '1 / 1',
            borderRadius: '20px', overflow: 'hidden',
            boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)',
            position: 'relative', flexShrink: 0,
          }}>
            <Box
              component="img"
              src={ecoleImage}
              alt="École CPPE Issia"
              sx={{
                width: '100%', height: '100%',
                objectFit: 'cover', objectPosition: 'center',
                display: 'block',
                transition: 'transform 8s ease',
                '&:hover': { transform: 'scale(1.04)' },
              }}
            />
            {/* Gradient bas — identique Home */}
            <Box sx={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%',
              background: 'linear-gradient(to top, rgba(10,46,24,0.7) 0%, transparent 100%)',
              pointerEvents: 'none',
            }} />
            {/* Badge — identique Home */}
            <Box sx={{
              position: 'absolute', bottom: 18, left: 18,
              background: 'rgba(245,166,35,0.95)',
              backdropFilter: 'blur(8px)',
              borderRadius: '10px', px: 1.75, py: 1,
              display: 'flex', alignItems: 'center', gap: 1,
            }}>
              <Box sx={{ width: 7, height: 7, borderRadius: '50%', background: '#0f4a25', animation: 'pulse-dot 2s infinite' }} />
              <Typography sx={{ fontSize: 11.5, fontWeight: 800, color: '#0f4a25' }}>
                CPPE d'Issia
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ══════════ CARTES INFO + FORMULAIRE ══════════ */}
      <Box sx={{
        background: 'linear-gradient(135deg, #0a2e18 0%, #0f4a25 50%, #1a5e32 100%)',
        pb: 0, position: 'relative', overflow: 'hidden',
      }}>
        <Box sx={{
          position: 'absolute', inset: 0,
          backgroundImage: GRID_LINES,
          backgroundSize: '48px 48px',
          pointerEvents: 'none',
        }} />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="flex-start">

            {/* GAUCHE — 4 cartes info */}
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, pb: { xs: 0, md: 6 } }}>
                <InfoCard icon={MapPin} titre="Adresse"
                  valeur={"Complexe Socio-Éducatif d'Issia\nHaut-Sassandra, Côte d'Ivoire"}
                  accent="#8bc34a" delay="cfade-1" />
                <InfoCard icon={Phone} titre="Téléphone"
                  valeur={"07 07 18 65 59  ·  05 06 48 22 01"}
                  accent={ORANGE} delay="cfade-2" />
                <InfoCard icon={Mail} titre="E-mail"
                  valeur="direction@cppe-issia.ci"
                  accent="#4db6ac" delay="cfade-3" />
                <InfoCard icon={Clock} titre="Horaires"
                  valeur={"Lun — Ven  ·  7h30 – 16h30"}
                  accent={ORANGE} delay="cfade-4" />
              </Box>
            </Grid>

            {/* DROITE — Formulaire flottant */}
            <Grid item xs={12} md={8}>
              <Box
                className="cfade cfade-4"
                sx={{
                  background: '#fff',
                  borderRadius: '28px 28px 0 0',
                  boxShadow: '0 -8px 60px rgba(0,0,0,0.2)',
                  overflow: 'hidden',
                }}
              >
                <Box sx={{ height: 5, background: `linear-gradient(90deg, #0a2e18, ${GREEN_MAIN}, ${ORANGE}, #8bc34a)` }} />
                <Box sx={{ p: { xs: 3, md: 4.5 } }}>
                  {sent ? (
                    <Box sx={{ textAlign: 'center', py: { xs: 5, md: 7 } }}>
                      <Box sx={{ position: 'relative', width: 80, height: 80, mx: 'auto', mb: 3 }}>
                        <Box sx={{
                          position: 'absolute', inset: 0, borderRadius: '50%',
                          background: `${GREEN_MAIN}18`,
                          animation: 'pulseRing 2s ease infinite',
                        }} />
                        <Box sx={{
                          position: 'relative', width: 80, height: 80, borderRadius: '50%',
                          background: GREEN_CTA,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <CheckCircle size={36} color="#fff" strokeWidth={1.75} />
                        </Box>
                      </Box>
                      <Typography sx={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: { xs: 28, md: 36 }, fontWeight: 700,
                        color: '#0c1a10', mb: 1.5, lineHeight: 1.15,
                      }}>
                        Message envoyé !
                      </Typography>
                      <Typography sx={{ color: '#6b7c70', fontSize: 14, maxWidth: 380, mx: 'auto', lineHeight: 1.8, mb: 4 }}>
                        Nous avons bien reçu votre message. Notre équipe vous répondra dans les meilleurs délais.
                      </Typography>
                      <Button
                        onClick={() => setSent(false)}
                        endIcon={<ArrowRight size={15} />}
                        sx={{
                          background: GREEN_CTA, color: '#fff',
                          fontWeight: 800, fontSize: 13,
                          px: 3.5, py: 1.25, borderRadius: '30px',
                          boxShadow: `0 8px 24px ${GREEN_DARK}40`,
                          '&:hover': { background: GREEN_HOV, transform: 'translateY(-2px)' },
                          transition: 'all 0.2s',
                        }}
                      >
                        Envoyer un autre message
                      </Button>
                    </Box>
                  ) : (
                    <>
                      <Box sx={{ mb: 3.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                          <Box sx={{ width: 28, height: 2, background: ORANGE }} />
                          <Typography sx={{ fontSize: 11, fontWeight: 700, color: ORANGE, letterSpacing: '3px', textTransform: 'uppercase' }}>
                            Formulaire de contact
                          </Typography>
                        </Box>
                        <Typography sx={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: { xs: 26, md: 34 }, fontWeight: 700,
                          color: '#0c1a10', lineHeight: 1.1, mb: 0.75,
                        }}>
                          Envoyez-nous votre message
                        </Typography>
                        <Typography sx={{ color: '#9ca3af', fontSize: 13.5 }}>
                          Les champs marqués{' '}
                          <Box component="span" sx={{ color: '#ef4444' }}>*</Box>{' '}
                          sont obligatoires.
                        </Typography>
                      </Box>

                      <Box component="form" onSubmit={handleSubmit((d) => mutation.mutate(d))}>
                        <Grid container spacing={2.5}>

                          <Grid item xs={12} sm={6}>
                            <StyledField label="Nom complet *" error={!!errors.nom} helperText={errors.nom?.message}>
                              <TextField fullWidth variant="outlined" size="small"
                                placeholder="Ex : Kouamé Adjoua" error={!!errors.nom}
                                {...register('nom', { required: 'Le nom est requis.' })} />
                            </StyledField>
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <StyledField label="Adresse e-mail *" error={!!errors.email} helperText={errors.email?.message}>
                              <TextField fullWidth variant="outlined" size="small"
                                type="email" placeholder="votre@email.ci" error={!!errors.email}
                                {...register('email', { required: "L'e-mail est requis." })} />
                            </StyledField>
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <StyledField label="Téléphone">
                              <TextField fullWidth variant="outlined" size="small"
                                placeholder="07 00 00 00 00"
                                {...register('telephone')} />
                            </StyledField>
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <StyledField label="Sujet *" error={!!errors.sujet} helperText={errors.sujet?.message}>
                              <TextField fullWidth variant="outlined" size="small"
                                placeholder="Ex : Inscription 2025-2026" error={!!errors.sujet}
                                {...register('sujet', { required: 'Le sujet est requis.' })} />
                            </StyledField>
                          </Grid>

                          <Grid item xs={12}>
                            <StyledField label="Votre message *" error={!!errors.message} helperText={errors.message?.message}>
                              <TextField
                                fullWidth variant="outlined" multiline rows={9}
                                placeholder={"Décrivez votre demande en détail…\n\nVous pouvez préciser :\n• Le nom et l'âge de l'enfant\n• La section souhaitée\n• Toute autre information utile"}
                                error={!!errors.message}
                                {...register('message', {
                                  required: 'Le message est requis.',
                                  minLength: { value: 10, message: 'Minimum 10 caractères.' },
                                })}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: '10px', background: '#f4f8f5',
                                    fontSize: 14, alignItems: 'flex-start',
                                    '& fieldset': { borderColor: errors.message ? '#ef4444' : '#dae8df', borderWidth: '1.5px' },
                                    '&:hover fieldset': { borderColor: GREEN_MAIN },
                                    '&.Mui-focused fieldset': {
                                      borderColor: GREEN_MAIN, borderWidth: '2px',
                                      boxShadow: `0 0 0 3px ${GREEN_MAIN}18`,
                                    },
                                  },
                                  '& .MuiInputBase-inputMultiline': { py: 1.4, px: 1.6, lineHeight: 1.75 },
                                }}
                              />
                            </StyledField>
                          </Grid>

                          <Grid item xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                              <Button
                                type="submit" variant="contained"
                                disabled={mutation.isPending}
                                endIcon={!mutation.isPending && <Send size={15} />}
                                sx={{
                                  background: GREEN_CTA, color: '#fff',
                                  fontWeight: 800, fontSize: 13,
                                  px: 4, py: 1.25, borderRadius: '30px',
                                  boxShadow: `0 8px 24px ${GREEN_DARK}35`,
                                  transition: 'all 0.2s',
                                  '&:hover': {
                                    background: GREEN_HOV,
                                    transform: 'translateY(-2px)',
                                    boxShadow: `0 12px 32px ${GREEN_DARK}45`,
                                  },
                                  '&:disabled': { background: '#c8d8cc', color: '#fff', boxShadow: 'none' },
                                }}
                              >
                                {mutation.isPending ? 'Envoi en cours…' : 'Envoyer le message'}
                              </Button>

                              <Box sx={{
                                display: 'inline-flex', alignItems: 'center', gap: 0.75,
                                px: 1.75, py: 0.55, borderRadius: '20px',
                                background: `${ORANGE}12`, border: `1px solid ${ORANGE}30`,
                              }}>
                                <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: ORANGE, animation: 'pulse-dot 2s infinite' }} />
                                <Typography sx={{ fontSize: 11.5, fontWeight: 600, color: ORANGE }}>
                                  Réponse sous 24h ouvrées
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>

                        </Grid>
                      </Box>
                    </>
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ══════════ LOCALISATION ══════════ */}
      <Box sx={{ background: '#fff', py: { xs: 5, md: 7 } }}>
        <Container maxWidth="lg">

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Box sx={{ width: 28, height: 2, background: ORANGE }} />
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: ORANGE, letterSpacing: '3px', textTransform: 'uppercase' }}>
              Localisation
            </Typography>
          </Box>

          <Box sx={{
            borderRadius: '24px', overflow: 'hidden',
            border: '1px solid rgba(27,122,62,0.12)',
            display: 'flex', flexDirection: { xs: 'column', md: 'row' },
            boxShadow: '0 8px 40px rgba(27,122,62,0.08)',
          }}>
            <Box sx={{
              background: 'linear-gradient(160deg, #0a2e18 0%, #0f4a25 55%, #1B7A3E 100%)',
              p: { xs: 3.5, md: 4.5 },
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              minWidth: { md: 300 }, position: 'relative', overflow: 'hidden',
            }}>
              <Box sx={{
                position: 'absolute', width: 260, height: 260,
                right: -80, bottom: -80, borderRadius: '50%',
                background: `${ORANGE}06`, pointerEvents: 'none',
              }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Box sx={{
                  width: 44, height: 44, borderRadius: '14px',
                  background: `${ORANGE}18`, border: `1px solid ${ORANGE}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <MapPin size={20} color={ORANGE} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 10, fontWeight: 700, color: ORANGE, letterSpacing: '2px', textTransform: 'uppercase' }}>
                    Où nous trouver
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: 'rgba(255,255,255,0.42)' }}>CPPE d'Issia</Typography>
                </Box>
              </Box>
              <Typography sx={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: { xs: 18, md: 22 }, fontWeight: 700, color: '#fff',
                mb: 0.75, lineHeight: 1.3,
              }}>
                Complexe Socio-Éducatif d'Issia
              </Typography>
              <Typography sx={{ fontSize: 13.5, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, mb: 3 }}>
                Haut-Sassandra<br />Côte d'Ivoire
              </Typography>
              <Box sx={{
                p: 2, borderRadius: '12px',
                background: 'rgba(255,255,255,0.06)',
                border: `1px solid ${BORDER_DIM}`,
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Clock size={13} color={ORANGE} />
                  <Typography sx={{ fontSize: 10.5, fontWeight: 700, color: ORANGE, letterSpacing: '1px', textTransform: 'uppercase' }}>
                    Horaires d'accueil
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
                  Lundi — Vendredi<br />
                  <Box component="strong" sx={{ color: '#fff', fontWeight: 700 }}>7h30 à 16h30</Box>
                </Typography>
              </Box>
            </Box>

            <Box sx={{
              flex: 1, minHeight: { xs: 220, md: 300 },
              background: 'linear-gradient(135deg, #eaf4ee 0%, #f4f8f5 50%, #dae8df 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative', overflow: 'hidden',
            }}>
              <Box sx={{
                position: 'absolute', inset: 0,
                backgroundImage: `linear-gradient(${GREEN_MAIN}08 1px, transparent 1px), linear-gradient(90deg, ${GREEN_MAIN}08 1px, transparent 1px)`,
                backgroundSize: '32px 32px',
              }} />
              <Box sx={{ position: 'relative', textAlign: 'center' }}>
                <Box sx={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: GREEN_CTA,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  mx: 'auto', mb: 2,
                  boxShadow: `0 8px 28px ${GREEN_DARK}40`,
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute', inset: -8, borderRadius: '50%',
                    border: `2px solid ${GREEN_MAIN}25`,
                    animation: 'pulseRing 2.5s ease infinite',
                  },
                }}>
                  <MapPin size={28} color="#fff" />
                </Box>
                <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 700, color: '#0c1a10', mb: 0.4 }}>
                  CPPE d'Issia
                </Typography>
                <Typography sx={{ fontSize: 12, color: '#6b7c70' }}>
                  Haut-Sassandra, Côte d'Ivoire
                </Typography>
              </Box>
              <Box sx={{ position: 'absolute', width: 180, height: 180, borderRadius: '50%', border: `1.5px dashed ${GREEN_MAIN}20`, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
              <Box sx={{ position: 'absolute', width: 290, height: 290, borderRadius: '50%', border: `1px dashed ${GREEN_MAIN}10`, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}