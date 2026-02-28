import { useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import {
  Box, Paper, Grid, TextField, Button, FormControl, InputLabel,
  Select, MenuItem, Typography, Divider,
} from '@mui/material'
import { ArrowLeft, Save } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { actualitesApi } from '@/api/services'
import { PageTitle, LoadingSpinner } from '@/components/common'
import toast from 'react-hot-toast'

// ─────────────────────────────────────────────────────────────
// ReactQuill est incompatible avec React 19 (findDOMNode supprimé).
// Remplacement par un éditeur textarea stylé fonctionnel.
// Pour un vrai éditeur riche React 19 : npm install @uiw/react-md-editor
// ─────────────────────────────────────────────────────────────
function RichTextarea({ value, onChange, hasError, placeholder }) {
  const actions = [
    { label: 'G', title: 'Gras', tag: '**' },
    { label: 'I', title: 'Italique', tag: '_' },
    { label: 'S', title: 'Souligné', tag: '__' },
  ]

  return (
    <Box
      sx={{
        border: `1px solid ${hasError ? '#dc2626' : '#dae8df'}`,
        borderRadius: '10px',
        overflow: 'hidden',
        '&:focus-within': {
          borderColor: hasError ? '#dc2626' : '#1B7A3E',
          boxShadow: `0 0 0 2px ${hasError ? 'rgba(220,38,38,0.1)' : 'rgba(27,122,62,0.1)'}`,
        },
      }}
    >
      {/* Barre d'outils */}
      <Box sx={{ display: 'flex', gap: 0.5, px: 1.5, py: 1, borderBottom: '1px solid #dae8df', background: '#f9fbf9' }}>
        {actions.map((a) => (
          <Box
            key={a.label}
            title={a.title}
            onClick={() => {
              const selected = window.getSelection()?.toString() || ''
              if (selected) onChange(value.replace(selected, `${a.tag}${selected}${a.tag}`))
            }}
            sx={{
              width: 28, height: 28, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 12, fontWeight: 700,
              borderRadius: '6px', cursor: 'pointer', color: '#6b7c70',
              userSelect: 'none',
              '&:hover': { background: '#eaf4ee', color: '#1B7A3E' },
            }}
          >
            {a.label}
          </Box>
        ))}
        <Box sx={{ ml: 0.5, width: 1, height: 20, background: '#dae8df', alignSelf: 'center' }} />
        {['• Liste', '1. Liste numérotée'].map((t) => (
          <Box
            key={t}
            title={t}
            sx={{
              px: 1, height: 28, display: 'flex', alignItems: 'center',
              fontSize: 11, borderRadius: '6px', cursor: 'pointer', color: '#6b7c70',
              whiteSpace: 'nowrap',
              '&:hover': { background: '#eaf4ee', color: '#1B7A3E' },
            }}
          >
            {t}
          </Box>
        ))}
      </Box>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'Rédigez le contenu ici...'}
        rows={8}
        style={{
          width: '100%', border: 'none', outline: 'none',
          resize: 'vertical', padding: '12px 16px',
          fontFamily: "'Outfit', sans-serif",
          fontSize: 14, lineHeight: 1.7,
          color: '#0c1a10', background: '#fff',
          boxSizing: 'border-box',
        }}
      />
    </Box>
  )
}

// ─────────────────────────────────────────────────────────────

const TYPES = [
  { value: 'flash',       label: 'Flash Info' },
  { value: 'convocation', label: 'Convocation Parents' },
  { value: 'evenement',   label: 'Événement' },
  { value: 'inscription', label: 'Inscription' },
]

export default function ActualitesForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isEditing = Boolean(id)

  const { register, handleSubmit, control, reset, watch, formState: { errors } } = useForm({
    defaultValues: {
      titre: '',
      contenu: '',
      type: 'flash',        // ← valeur initiale valide
      statut: 'brouillon',  // ← valeur initiale valide
      date_publication: '',
      date_expiration: '',
    },
  })

  const statut = watch('statut')

  // Charger l'actualité en mode édition
  const { data: existingData, isLoading } = useQuery({
    queryKey: ['actualite', id],
    queryFn: () =>
      actualitesApi.adminGetAll().then((r) =>
        r.data.data.data.find((a) => a.id === parseInt(id))
      ),
    enabled: isEditing,
  })

  useEffect(() => {
    if (existingData) {
      reset({
        titre:            existingData.titre || '',
        contenu:          existingData.contenu || '',
        type:             existingData.type || 'flash',
        statut:           existingData.statut || 'brouillon',
        date_publication: existingData.date_publication?.slice(0, 10) || '',
        date_expiration:  existingData.date_expiration?.slice(0, 10) || '',
      })
    }
  }, [existingData, reset])

  const mutation = useMutation({
    mutationFn: (data) =>
      isEditing ? actualitesApi.update(id, data) : actualitesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-actualites'])
      toast.success(isEditing ? 'Actualité mise à jour.' : 'Actualité créée avec succès.')
      navigate('/admin/actualites')
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Une erreur est survenue.')
    },
  })

  if (isLoading) return <LoadingSpinner />

  return (
    <Box>
      <Button
        component={Link}
        to="/admin/actualites"
        startIcon={<ArrowLeft size={15} />}
        sx={{ color: '#6b7c70', fontSize: 12, mb: 1 }}
      >
        Retour
      </Button>

      <PageTitle
        title={isEditing ? "Modifier l'actualité" : 'Nouvelle actualité'}
        subtitle={
          isEditing
            ? `Modification de : ${existingData?.titre || ''}`
            : 'Créez un flash info, une convocation ou une annonce.'
        }
      />

      <Box component="form" onSubmit={handleSubmit((data) => mutation.mutate(data))}>
        <Grid container spacing={2.5}>

          {/* ── COLONNE GAUCHE — Contenu ── */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper sx={{ p: 3, mb: 2.5 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 13, color: '#0c1a10', mb: 2.5, pb: 1.5, borderBottom: '1px solid #dae8df' }}>
                Contenu
              </Typography>

              <TextField
                label="Titre *"
                fullWidth
                error={!!errors.titre}
                helperText={errors.titre?.message}
                sx={{ mb: 3 }}
                {...register('titre', { required: 'Le titre est obligatoire.' })}
              />

              <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: '#6b7c70', mb: 1 }}>
                Contenu *
              </Typography>
              <Controller
                name="contenu"
                control={control}
                rules={{ required: 'Le contenu est obligatoire.' }}
                render={({ field }) => (
                  <Box>
                    <RichTextarea
                      value={field.value}
                      onChange={field.onChange}
                      hasError={!!errors.contenu}
                      placeholder="Rédigez l'actualité ici..."
                    />
                    {errors.contenu && (
                      <Typography sx={{ fontSize: 11.5, color: '#dc2626', mt: 0.5 }}>
                        {errors.contenu.message}
                      </Typography>
                    )}
                  </Box>
                )}
              />
            </Paper>
          </Grid>

          {/* ── COLONNE DROITE — Paramètres ── */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3, mb: 2 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 13, color: '#0c1a10', mb: 2.5, pb: 1.5, borderBottom: '1px solid #dae8df' }}>
                Paramètres
              </Typography>

              {/* ✅ Type — Controller obligatoire pour Select MUI */}
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth size="small" sx={{ mb: 2.5 }}>
                    <InputLabel>Type *</InputLabel>
                    <Select label="Type *" value={field.value} onChange={field.onChange}>
                      {TYPES.map((t) => (
                        <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />

              {/* ✅ Statut — Controller obligatoire pour Select MUI */}
              <Controller
                name="statut"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth size="small" sx={{ mb: 2.5 }}>
                    <InputLabel>Statut *</InputLabel>
                    <Select label="Statut *" value={field.value} onChange={field.onChange}>
                      <MenuItem value="brouillon">Brouillon</MenuItem>
                      <MenuItem value="publie">Publier maintenant</MenuItem>
                      <MenuItem value="planifie">Planifier</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />

              {statut === 'planifie' && (
                <TextField
                  label="Date de publication"
                  type="date"
                  fullWidth
                  size="small"
                  sx={{ mb: 2.5 }}
                  InputLabelProps={{ shrink: true }}
                  {...register('date_publication')}
                />
              )}

              <TextField
                label="Date d'expiration"
                type="date"
                fullWidth
                size="small"
                sx={{ mb: 2 }}
                InputLabelProps={{ shrink: true }}
                helperText="Optionnel — retire l'info automatiquement"
                {...register('date_expiration')}
              />

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={mutation.isPending}
                  startIcon={<Save size={15} />}
                  sx={{ background: '#1B7A3E', '&:hover': { background: '#0f4a25' } }}
                >
                  {mutation.isPending
                    ? 'Enregistrement...'
                    : isEditing ? 'Mettre à jour' : 'Enregistrer'}
                </Button>
                <Button
                  component={Link}
                  to="/admin/actualites"
                  fullWidth
                  sx={{ color: '#6b7c70' }}
                >
                  Annuler
                </Button>
              </Box>
            </Paper>
          </Grid>

        </Grid>
      </Box>
    </Box>
  )
}