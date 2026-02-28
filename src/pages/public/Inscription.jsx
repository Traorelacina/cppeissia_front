import { useState } from 'react'
import {
  Box, Container, Grid, Typography, TextField, Button, Select,
  MenuItem, FormControl, InputLabel, FormHelperText, Stepper,
  Step, StepLabel, Alert, Paper, Chip,
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { inscriptionsApi } from '@/api/services'
import { CheckCircle, ArrowRight, ArrowLeft, BookOpen, User, FileText } from 'lucide-react'
import toast from 'react-hot-toast'

const STEPS  = ['L\'enfant', 'Le responsable', 'Dossier & section']
const SECTIONS = [
  { val: 'creche',          label: 'Crèche (1 an 6 mois — 2 ans 11 mois)' },
  { val: 'petite_section',  label: 'Petite Section (3 ans — 3 ans 11 mois)' },
  { val: 'moyenne_section', label: 'Moyenne Section (4 ans — 4 ans 11 mois)' },
  { val: 'grande_section',  label: 'Grande Section (5 ans — 5 ans 11 mois)' },
]

export default function Inscription() {
  const [step, setStep]   = useState(0)
  const [done, setDone]   = useState(false)
  const [ref,  setRef]    = useState('')

  const { control, handleSubmit, trigger, getValues, formState: { errors } } = useForm({
    defaultValues: {
      nom_enfant: '', prenoms_enfant: '', date_naissance: '', lieu_naissance: '',
      sexe: '', section: '', annee_scolaire: '2025-2026',
      nom_pere: '', prenom_pere: '', telephone_pere: '', profession_pere: '',
      nom_mere: '', prenom_mere: '', telephone_mere: '', profession_mere: '',
      nom_tuteur: '', telephone_tuteur: '', lien_tuteur: '',
      adresse_famille: '', quartier: '', commune: '',
      extrait_naissance: false, carnet_sante: false, photos_id: false,
      commentaire: '',
    },
  })

  const mutation = useMutation({
    mutationFn: (data) => inscriptionsApi.submit(data),
    onSuccess: (res) => {
      setRef(res?.data?.data?.reference || 'CPPE-2025-XXX')
      setDone(true)
    },
    onError: () => toast.error('Erreur lors de l\'envoi. Vérifiez les informations.'),
  })

  // Validation par étape avant de passer à la suivante
  const nextStep = async () => {
    let fields = []
    if (step === 0) fields = ['nom_enfant', 'prenoms_enfant', 'date_naissance', 'lieu_naissance', 'sexe']
    if (step === 1) fields = ['nom_pere', 'telephone_mere']
    if (step === 2) fields = ['section']
    const ok = await trigger(fields)
    if (ok) setStep((s) => s + 1)
  }

  const onSubmit = (data) => mutation.mutate(data)

  if (done) {
    return (
      <Box sx={{ py: 10, background: '#f4f8f5', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <Container maxWidth="sm">
          <Paper sx={{ p: { xs: 4, md: 6 }, textAlign: 'center', borderRadius: '20px' }}>
            <Box sx={{ width: 80, height: 80, borderRadius: '50%', background: '#eaf4ee', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
              <CheckCircle size={40} color="#1B7A3E" />
            </Box>
            <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 700, color: '#0c1a10', mb: 1 }}>
              Demande enregistrée !
            </Typography>
            <Typography sx={{ color: '#6b7c70', fontSize: 14.5, mb: 3, lineHeight: 1.8 }}>
              Votre demande d'inscription a bien été reçue. Notre équipe va l'examiner et vous contactera dans les plus brefs délais.
            </Typography>
            <Chip label={`Référence : ${ref}`} sx={{ background: '#eaf4ee', color: '#1B7A3E', fontWeight: 700, fontSize: 13, px: 1.5, py: 3, mb: 3 }} />
            <Alert severity="info" sx={{ textAlign: 'left', borderRadius: '12px', fontSize: 13 }}>
              Conservez votre numéro de référence. Il sera nécessaire lors de votre visite au centre pour la remise du dossier physique.
            </Alert>
            <Box sx={{ mt: 3, p: 2.5, background: '#f4f8f5', borderRadius: '12px', textAlign: 'left' }}>
              <Typography sx={{ fontWeight: 700, fontSize: 13, color: '#0c1a10', mb: 1.5 }}>Documents à apporter</Typography>
              {["Extrait d'acte de naissance (original + copie)", "Carnet de santé à jour", "2 photos d'identité de l'enfant", "Photocopie CNI des parents/tuteur"].map((d) => (
                <Box key={d} sx={{ display: 'flex', gap: 1, mb: 0.75, alignItems: 'flex-start' }}>
                  <CheckCircle size={14} color="#1B7A3E" style={{ marginTop: 2, flexShrink: 0 }} />
                  <Typography sx={{ fontSize: 13, color: '#4b5563' }}>{d}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Container>
      </Box>
    )
  }

  return (
    <Box>
      {/* HERO */}
      <Box sx={{ background: 'linear-gradient(135deg, #0f4a25, #1B7A3E)', py: { xs: 7, md: 10 }, px: 3, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Box sx={{ width: 54, height: 54, background: '#F5A623', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={24} color="#0f4a25" />
            </Box>
          </Box>
          <Typography variant="h1" sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: { xs: 32, md: 50 }, fontWeight: 700, color: '#fff', lineHeight: 1.1, mb: 1.5 }}>
            Formulaire d'inscription
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, maxWidth: 480, mx: 'auto' }}>
            Remplissez ce formulaire pour déposer une demande d'inscription pour l'année scolaire 2025-2026.
          </Typography>
        </Container>
      </Box>

      <Box sx={{ py: 7, background: '#f4f8f5' }}>
        <Container maxWidth="md">
          {/* STEPPER */}
          <Stepper activeStep={step} sx={{ mb: 5 }}>
            {STEPS.map((s, i) => {
              const icons = [User, User, FileText]
              const I = icons[i]
              return (
                <Step key={s}>
                  <StepLabel
                    StepIconComponent={() => (
                      <Box sx={{
                        width: 34, height: 34, borderRadius: '50%',
                        background: i <= step ? '#1B7A3E' : '#dae8df',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <I size={15} color={i <= step ? '#fff' : '#9ca3af'} />
                      </Box>
                    )}
                  >
                    <Typography sx={{ fontSize: 12.5, fontWeight: i === step ? 700 : 400, color: i === step ? '#1B7A3E' : '#9ca3af', display: { xs: 'none', sm: 'block' } }}>
                      {s}
                    </Typography>
                  </StepLabel>
                </Step>
              )
            })}
          </Stepper>

          <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: '20px' }}>
            <Box component="form">

              {/* ÉTAPE 0 : ENFANT */}
              {step === 0 && (
                <Box>
                  <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 700, color: '#0c1a10', mb: 3 }}>
                    Informations sur l'enfant
                  </Typography>
                  <Grid container spacing={2.5}>
                    <Grid item xs={12} sm={6}>
                      <Controller name="nom_enfant" control={control} rules={{ required: 'Champ requis.' }}
                        render={({ field }) => (
                          <TextField label="Nom de famille *" fullWidth error={!!errors.nom_enfant} helperText={errors.nom_enfant?.message} {...field} />
                        )} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller name="prenoms_enfant" control={control} rules={{ required: 'Champ requis.' }}
                        render={({ field }) => (
                          <TextField label="Prénoms *" fullWidth error={!!errors.prenoms_enfant} helperText={errors.prenoms_enfant?.message} {...field} />
                        )} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller name="date_naissance" control={control} rules={{ required: 'Champ requis.' }}
                        render={({ field }) => (
                          <TextField label="Date de naissance *" type="date" fullWidth InputLabelProps={{ shrink: true }} error={!!errors.date_naissance} helperText={errors.date_naissance?.message} {...field} />
                        )} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller name="lieu_naissance" control={control} rules={{ required: 'Champ requis.' }}
                        render={({ field }) => (
                          <TextField label="Lieu de naissance *" fullWidth error={!!errors.lieu_naissance} helperText={errors.lieu_naissance?.message} {...field} />
                        )} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller name="sexe" control={control} rules={{ required: 'Champ requis.' }}
                        render={({ field }) => (
                          <FormControl fullWidth error={!!errors.sexe}>
                            <InputLabel>Sexe *</InputLabel>
                            <Select label="Sexe *" {...field}>
                              <MenuItem value="M">Masculin</MenuItem>
                              <MenuItem value="F">Féminin</MenuItem>
                            </Select>
                            <FormHelperText>{errors.sexe?.message}</FormHelperText>
                          </FormControl>
                        )} />
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* ÉTAPE 1 : RESPONSABLE */}
              {step === 1 && (
                <Box>
                  <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 700, color: '#0c1a10', mb: 3 }}>
                    Informations des responsables
                  </Typography>

                  <Typography sx={{ fontWeight: 700, fontSize: 14, color: '#1B7A3E', mb: 2 }}>Père</Typography>
                  <Grid container spacing={2.5} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6}>
                      <Controller name="nom_pere" control={control} rules={{ required: 'Champ requis.' }}
                        render={({ field }) => (
                          <TextField label="Nom du père *" fullWidth error={!!errors.nom_pere} helperText={errors.nom_pere?.message} {...field} />
                        )} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller name="prenom_pere" control={control}
                        render={({ field }) => <TextField label="Prénom du père" fullWidth {...field} />} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller name="telephone_pere" control={control}
                        render={({ field }) => <TextField label="Téléphone" fullWidth {...field} />} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller name="profession_pere" control={control}
                        render={({ field }) => <TextField label="Profession" fullWidth {...field} />} />
                    </Grid>
                  </Grid>

                  <Typography sx={{ fontWeight: 700, fontSize: 14, color: '#1B7A3E', mb: 2 }}>Mère</Typography>
                  <Grid container spacing={2.5} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6}>
                      <Controller name="nom_mere" control={control}
                        render={({ field }) => <TextField label="Nom de la mère" fullWidth {...field} />} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller name="prenom_mere" control={control}
                        render={({ field }) => <TextField label="Prénom de la mère" fullWidth {...field} />} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller name="telephone_mere" control={control} rules={{ required: 'Au moins un contact est requis.' }}
                        render={({ field }) => (
                          <TextField label="Téléphone *" fullWidth error={!!errors.telephone_mere} helperText={errors.telephone_mere?.message} {...field} />
                        )} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller name="profession_mere" control={control}
                        render={({ field }) => <TextField label="Profession" fullWidth {...field} />} />
                    </Grid>
                  </Grid>

                  <Typography sx={{ fontWeight: 700, fontSize: 14, color: '#1B7A3E', mb: 2 }}>Adresse de la famille</Typography>
                  <Grid container spacing={2.5}>
                    <Grid item xs={12} sm={6}>
                      <Controller name="quartier" control={control}
                        render={({ field }) => <TextField label="Quartier" fullWidth {...field} />} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller name="commune" control={control}
                        render={({ field }) => <TextField label="Commune / Ville" fullWidth placeholder="Issia" {...field} />} />
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* ÉTAPE 2 : SECTION & DOSSIER */}
              {step === 2 && (
                <Box>
                  <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 700, color: '#0c1a10', mb: 3 }}>
                    Section & Dossier
                  </Typography>

                  <Controller name="section" control={control} rules={{ required: 'Veuillez choisir une section.' }}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.section} sx={{ mb: 3 }}>
                        <InputLabel>Section demandée *</InputLabel>
                        <Select label="Section demandée *" {...field}>
                          {SECTIONS.map(({ val, label }) => (
                            <MenuItem key={val} value={val}>{label}</MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>{errors.section?.message}</FormHelperText>
                      </FormControl>
                    )} />

                  <Alert severity="info" sx={{ mb: 3, borderRadius: '12px', fontSize: 13 }}>
                    Après l'envoi de ce formulaire, vous devrez vous présenter au CPPE avec les documents originaux suivants pour finaliser l'inscription.
                  </Alert>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                    {["Extrait d'acte de naissance original", "Carnet de santé à jour (vaccins)", "2 photos d'identité récentes de l'enfant"].map((doc) => (
                      <Box key={doc} sx={{ display: 'flex', gap: 1.5, alignItems: 'center', p: 2, background: '#f4f8f5', borderRadius: '10px' }}>
                        <CheckCircle size={16} color="#1B7A3E" />
                        <Typography sx={{ fontSize: 13.5, color: '#2d3a30' }}>{doc}</Typography>
                      </Box>
                    ))}
                  </Box>

                  <Controller name="commentaire" control={control}
                    render={({ field }) => (
                      <TextField label="Commentaire / Informations complémentaires" multiline rows={3} fullWidth placeholder="Allergies, besoins spéciaux, questions…" {...field} />
                    )} />
                </Box>
              )}

              {/* ACTIONS */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, pt: 3, borderTop: '1px solid #f0f4f0' }}>
                <Button
                  disabled={step === 0}
                  onClick={() => setStep((s) => s - 1)}
                  startIcon={<ArrowLeft size={15} />}
                  sx={{ color: '#6b7c70', '&:disabled': { opacity: 0.3 } }}
                >
                  Précédent
                </Button>

                {step < STEPS.length - 1 ? (
                  <Button
                    variant="contained"
                    onClick={nextStep}
                    endIcon={<ArrowRight size={15} />}
                    sx={{ background: '#1B7A3E', px: 4, '&:hover': { background: '#0f4a25' } }}
                  >
                    Continuer
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleSubmit(onSubmit)}
                    disabled={mutation.isPending}
                    endIcon={<CheckCircle size={15} />}
                    sx={{ background: '#1B7A3E', px: 4, '&:hover': { background: '#0f4a25' } }}
                  >
                    {mutation.isPending ? 'Envoi...' : 'Envoyer la demande'}
                  </Button>
                )}
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  )
}