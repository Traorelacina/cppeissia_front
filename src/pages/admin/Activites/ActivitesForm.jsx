// ============================================================
// ACTIVITES FORM - src/pages/admin/Activites/ActivitesForm.jsx
// ============================================================
import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import {
  Box, Paper, Grid, TextField, Button, FormControl, InputLabel,
  Select, MenuItem, Typography, Switch, FormControlLabel, Divider,
  IconButton,
} from '@mui/material'
import { ArrowLeft, Save, Upload, X } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { activitesApi } from '@/api/services'
import { PageTitle, LoadingSpinner } from '@/components/common'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'

// ─────────────────────────────────────────────────────────────
// Éditeur de texte riche — ReactQuill est incompatible avec
// React 19 (findDOMNode supprimé). On utilise un <textarea>
// stylé en remplacement léger.
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
        placeholder={placeholder || 'Rédigez la description ici...'}
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

export default function ActivitesForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isEditing = Boolean(id)
  const [photos, setPhotos] = useState([])
  const [existingPhotos, setExistingPhotos] = useState([])

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
    defaultValues: {
      titre: '',
      description: '',
      date_activite: '',
      publie: false,
      section: 'toutes', // Valeur par défaut pour le backend
    },
  })

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    onDrop: (files) => setPhotos((prev) => [...prev, ...files]),
  })

  // Charger l'activité en mode édition
  const { data: existingData, isLoading } = useQuery({
    queryKey: ['activite', id],
    queryFn: () => activitesApi.adminGetAll().then((r) =>
      r.data.data.data.find((a) => a.id === parseInt(id))
    ),
    enabled: isEditing,
  })

  useEffect(() => {
    if (existingData) {
      reset({
        titre: existingData.titre || '',
        description: existingData.description || '',
        date_activite: existingData.date_activite || '',
        publie: existingData.publie || false,
        section: existingData.section || 'toutes',
      })
      
      // Stocker les photos existantes si elles existent
      if (existingData.photos) {
        setExistingPhotos(existingData.photos)
      }
    }
  }, [existingData, reset])

  const mutation = useMutation({
    mutationFn: (formData) =>
      isEditing ? activitesApi.update(id, formData) : activitesApi.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-activites'])
      toast.success(isEditing ? 'Activité mise à jour.' : 'Activité créée.')
      navigate('/admin/activites')
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Erreur lors de la sauvegarde.')
    },
  })

  const onSubmit = (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (k === 'publie') {
        formData.append(k, v ? '1' : '0');
      } else {
        formData.append(k, v);
      }
    });
    
    // Ajouter les nouvelles photos
    photos.forEach((f) => formData.append('photos[]', f));
    
    if (isEditing) {
      formData.append('_method', 'PUT');
    }
    
    mutation.mutate(formData);
  }

  const removeExistingPhoto = (photoId) => {
    setExistingPhotos(prev => prev.filter(p => p.id !== photoId))
    // Optionnel: appeler une API pour supprimer la photo du serveur
    // activitesApi.deletePhoto(photoId)
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <Box>
      <Button
        component={Link}
        to="/admin/activites"
        startIcon={<ArrowLeft size={15} />}
        sx={{ color: '#6b7c70', fontSize: 12, mb: 1 }}
      >
        Retour
      </Button>

      <PageTitle
        title={isEditing ? "Modifier l'activité" : 'Nouvelle activité'}
        subtitle={
          isEditing
            ? `Modification de : ${existingData?.titre || ''}`
            : 'Créez une nouvelle activité ou un article de blog.'
        }
      />

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2.5}>

          {/* ── COLONNE GAUCHE ── */}
          <Grid size={{ xs: 12, md: 8 }}>

            {/* Contenu */}
            <Paper sx={{ p: 3, mb: 2.5 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 2.5, pb: 1.5, borderBottom: '1px solid #dae8df' }}>
                Contenu
              </Typography>

              <TextField
                label="Titre *"
                fullWidth
                sx={{ mb: 3 }}
                error={!!errors.titre}
                helperText={errors.titre ? 'Le titre est requis.' : ''}
                {...register('titre', { required: true })}
              />

              <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: '#6b7c70', mb: 1 }}>
                Description *
              </Typography>
              <Controller
                name="description"
                control={control}
                rules={{ required: 'La description est requise.' }}
                render={({ field }) => (
                  <Box>
                    <RichTextarea
                      value={field.value}
                      onChange={field.onChange}
                      hasError={!!errors.description}
                      placeholder="Décrivez l'activité..."
                    />
                    {errors.description && (
                      <Typography sx={{ fontSize: 11.5, color: '#dc2626', mt: 0.5 }}>
                        {errors.description.message}
                      </Typography>
                    )}
                  </Box>
                )}
              />
            </Paper>

            {/* Upload Photos */}
            <Paper sx={{ p: 3 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 2 }}>Photos</Typography>
              
              {/* Photos existantes (en mode édition) */}
              {existingPhotos.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#6b7c70', mb: 1.5 }}>
                    Photos existantes
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                    {existingPhotos.map((photo) => (
                      <Box key={photo.id} sx={{ position: 'relative' }}>
                        <Box
                          component="img"
                          src={photo.thumb || photo.url}
                          alt=""
                          sx={{
                            width: 80, height: 80, borderRadius: '10px',
                            objectFit: 'cover', border: '1px solid #dae8df',
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => removeExistingPhoto(photo.id)}
                          sx={{
                            position: 'absolute', top: -6, right: -6,
                            background: '#dc2626', color: '#fff',
                            width: 18, height: 18,
                            '&:hover': { background: '#b91c1c' },
                          }}
                        >
                          <X size={10} />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              <Box
                {...getRootProps()}
                sx={{
                  border: `2px dashed ${isDragActive ? '#1B7A3E' : '#dae8df'}`,
                  borderRadius: '12px',
                  p: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: isDragActive ? '#eaf4ee' : 'transparent',
                  transition: 'all 0.2s',
                  '&:hover': { borderColor: '#1B7A3E', background: '#f9fbf9' },
                }}
              >
                <input {...getInputProps()} />
                <Upload size={28} color={isDragActive ? '#1B7A3E' : '#dae8df'} style={{ marginBottom: 8 }} />
                <Typography sx={{ fontSize: 13.5, color: '#6b7c70' }}>
                  {isDragActive ? 'Déposez les photos ici' : 'Glissez des photos ou cliquez pour sélectionner'}
                </Typography>
                <Typography sx={{ fontSize: 11, color: '#9ca3af', mt: 0.5 }}>
                  JPEG, PNG, WebP · Max 50 Mo par fichier
                </Typography>
              </Box>

              {photos.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#6b7c70', mb: 1.5 }}>
                    Nouvelles photos
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                    {photos.map((file, i) => (
                      <Box key={i} sx={{ position: 'relative' }}>
                        <Box
                          component="img"
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          sx={{
                            width: 80, height: 80, borderRadius: '10px',
                            objectFit: 'cover', border: '1px solid #dae8df',
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => setPhotos((prev) => prev.filter((_, j) => j !== i))}
                          sx={{
                            position: 'absolute', top: -6, right: -6,
                            background: '#dc2626', color: '#fff',
                            width: 18, height: 18,
                            '&:hover': { background: '#b91c1c' },
                          }}
                        >
                          <X size={10} />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* ── COLONNE DROITE ── */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 2.5, pb: 1.5, borderBottom: '1px solid #dae8df' }}>
                Paramètres
              </Typography>

              <TextField
                label="Date de l'activité"
                type="date"
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2.5 }}
                {...register('date_activite')}
              />

              {/* Champ caché pour la section (pour compatibilité backend) */}
              <input type="hidden" {...register('section')} value="toutes" />

              <Controller
                name="publie"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={field.value}
                        onChange={field.onChange}
                        sx={{ '& .MuiSwitch-thumb': { background: field.value ? '#1B7A3E' : '#dae8df' } }}
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: 13.5, fontWeight: 600 }}>
                        Publier immédiatement
                      </Typography>
                    }
                    sx={{ mb: 3 }}
                  />
                )}
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
                  to="/admin/activites"
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