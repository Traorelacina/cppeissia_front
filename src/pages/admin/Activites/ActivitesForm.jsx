import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import {
  Box, Paper, Grid, TextField, Button, FormControl, InputLabel,
  Select, MenuItem, Typography, Switch, FormControlLabel, IconButton,
} from '@mui/material'
import { ArrowLeft, Save, Upload, X } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { activitesApi } from '@/api/services'
import { PageTitle } from '@/components/common'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'

// ─────────────────────────────────────────────────────────────
// Éditeur de texte riche — ReactQuill est incompatible avec
// React 19 (findDOMNode supprimé). On utilise un <textarea>
// stylé en remplacement léger. Si tu veux un vrai éditeur,
// installe : npm install @uiw/react-md-editor
// et remplace ce composant par <MDEditor />.
// ─────────────────────────────────────────────────────────────
function RichTextarea({ value, onChange, placeholder }) {
  return (
    <Box
      sx={{
        border: '1px solid #dae8df',
        borderRadius: '10px',
        overflow: 'hidden',
        '&:focus-within': { borderColor: '#1B7A3E', boxShadow: '0 0 0 2px rgba(27,122,62,0.1)' },
      }}
    >
      {/* Barre d'outils fictive — visuelle uniquement */}
      <Box sx={{ display: 'flex', gap: 0.5, px: 1.5, py: 1, borderBottom: '1px solid #dae8df', background: '#f9fbf9' }}>
        {['G', 'I', 'S', '≡', '•', '1.'].map((t) => (
          <Box
            key={t}
            sx={{
              width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, borderRadius: '6px', cursor: 'pointer', color: '#6b7c70',
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
          width: '100%',
          border: 'none',
          outline: 'none',
          resize: 'vertical',
          padding: '12px 16px',
          fontFamily: "'Outfit', sans-serif",
          fontSize: 14,
          lineHeight: 1.7,
          color: '#0c1a10',
          background: '#fff',
          boxSizing: 'border-box',
        }}
      />
    </Box>
  )
}

export default function ActivitesForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isEditing = Boolean(id)
  const [photos, setPhotos] = useState([])

  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: {
      titre: '',
      description: '',
      section: 'toutes',
      date_activite: '',
      publie: false,
    },
  })

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    onDrop: (files) => setPhotos((prev) => [...prev, ...files]),
  })

  const mutation = useMutation({
    mutationFn: (formData) =>
      isEditing ? activitesApi.update(id, formData) : activitesApi.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-activites'])
      toast.success(isEditing ? 'Activité mise à jour.' : 'Activité créée.')
      navigate('/admin/activites')
    },
    onError: () => toast.error('Erreur lors de la sauvegarde.'),
  })

 const onSubmit = (data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([k, v]) => {
    if (k === 'publie') {
      // Convertir le booléen en '1' ou '0'
      formData.append(k, v ? '1' : '0');
    } else {
      formData.append(k, v);
    }
  });
  photos.forEach((f) => formData.append('photos[]', f));
  if (isEditing) formData.append('_method', 'PUT');
  mutation.mutate(formData);
};

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
      <PageTitle title={isEditing ? "Modifier l'activité" : 'Nouvelle activité'} />

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        {/* Grid v2 : plus besoin de item + xs/md sur les enfants directs */}
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
                rules={{ required: true }}
                render={({ field }) => (
                  <RichTextarea
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Décrivez l'activité..."
                  />
                )}
              />
              {errors.description && (
                <Typography sx={{ fontSize: 11.5, color: '#dc2626', mt: 0.5 }}>
                  La description est requise.
                </Typography>
              )}
            </Paper>

            {/* Upload Photos */}
            <Paper sx={{ p: 3 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 2 }}>Photos</Typography>
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
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 2 }}>
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
              )}
            </Paper>
          </Grid>

          {/* ── COLONNE DROITE ── */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 2.5, pb: 1.5, borderBottom: '1px solid #dae8df' }}>
                Paramètres
              </Typography>

              {/* ✅ Select avec Controller pour éviter la valeur undefined */}
              <Controller
                name="section"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth size="small" sx={{ mb: 2.5 }}>
                    <InputLabel>Section</InputLabel>
                    <Select label="Section" value={field.value} onChange={field.onChange}>
                      <MenuItem value="toutes">Toutes les sections</MenuItem>
                      <MenuItem value="creche">Crèche</MenuItem>
                      <MenuItem value="ps">Petite Section</MenuItem>
                      <MenuItem value="ms">Moyenne Section</MenuItem>
                      <MenuItem value="gs">Grande Section</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />

              <TextField
                label="Date de l'activité"
                type="date"
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2.5 }}
                {...register('date_activite')}
              />

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

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={mutation.isPending}
                startIcon={<Save size={15} />}
                sx={{ background: '#1B7A3E', '&:hover': { background: '#0f4a25' } }}
              >
                {mutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </Paper>
          </Grid>

        </Grid>
      </Box>
    </Box>
  )
}