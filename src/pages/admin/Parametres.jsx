import { useEffect, useState, useRef } from 'react'
import {
  Box, Paper, Grid, TextField, Button, Typography,
  Divider, CircularProgress, Alert, IconButton,
} from '@mui/material'
import { Save, Settings, User, Phone, Clock, BookOpen, Upload, X, Image } from 'lucide-react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { parametresApi } from '@/api/services'
import { PageTitle, LoadingSpinner } from '@/components/common'
import toast from 'react-hot-toast'

// ========================
// COMPOSANT SECTION
// ========================
function ParamSection({ title, icon: Icon, children }) {
  return (
    <Paper sx={{ p: 3, mb: 2.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5, pb: 1.5, borderBottom: '1px solid #dae8df' }}>
        <Box sx={{ width: 32, height: 32, borderRadius: '8px', background: '#eaf4ee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={16} color="#1B7A3E" />
        </Box>
        <Typography sx={{ fontWeight: 700, fontSize: 14, color: '#0c1a10' }}>{title}</Typography>
      </Box>
      {children}
    </Paper>
  )
}

// ========================
// SÉLECTEUR DE PHOTO
// ========================
function PhotoPicker({ value, onChange }) {
  const inputRef  = useRef(null)
  const [preview, setPreview] = useState(value || null)
  const [isDrag,  setIsDrag]  = useState(false)

  // Synchronise le preview si la valeur externe change (ex: chargement initial)
  useEffect(() => {
    setPreview(value || null)
  }, [value])

  const handleFile = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Le fichier doit être une image (JPG, PNG, WEBP…)')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('L\'image ne doit pas dépasser 5 Mo.')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const base64 = e.target.result  // "data:image/jpeg;base64,..."
      setPreview(base64)
      onChange(base64)
    }
    reader.readAsDataURL(file)
  }

  const handleInputChange = (e) => handleFile(e.target.files?.[0])

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDrag(false)
    handleFile(e.dataTransfer.files?.[0])
  }

  const handleRemove = () => {
    setPreview(null)
    onChange('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <Box>
      {/* Input fichier caché */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleInputChange}
      />

      {preview ? (
        /* ── APERÇU de la photo sélectionnée ── */
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
          {/* Photo */}
          <Box
            sx={{
              width: 96,
              height: 96,
              borderRadius: '50%',
              overflow: 'hidden',
              border: '3px solid #F5A623',
              boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              flexShrink: 0,
              position: 'relative',
            }}
          >
            <Box
              component="img"
              src={preview}
              alt="Photo du Directeur"
              sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={() => {
                // Si l'URL stockée est invalide, on affiche le placeholder
                setPreview(null)
              }}
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight: 600, fontSize: 13, color: '#0c1a10', mb: 0.5 }}>
              Photo sélectionnée
            </Typography>
            <Typography sx={{ fontSize: 11.5, color: '#6b7c70', mb: 1.5, lineHeight: 1.5 }}>
              {preview.startsWith('data:')
                ? 'Image chargée depuis votre appareil'
                : 'Image chargée depuis une URL'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                variant="outlined"
                startIcon={<Upload size={13} />}
                onClick={() => inputRef.current?.click()}
                sx={{ borderColor: '#1B7A3E', color: '#1B7A3E', fontSize: 12, fontWeight: 600, '&:hover': { background: '#eaf4ee' } }}
              >
                Changer
              </Button>
              <Button
                size="small"
                variant="outlined"
                startIcon={<X size={13} />}
                onClick={handleRemove}
                sx={{ borderColor: '#e0e0e0', color: '#9e9e9e', fontSize: 12, '&:hover': { borderColor: '#ef5350', color: '#ef5350', background: '#fff5f5' } }}
              >
                Supprimer
              </Button>
            </Box>
          </Box>
        </Box>
      ) : (
        /* ── ZONE DE DÉPÔT / SÉLECTION ── */
        <Box
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDrag(true) }}
          onDragLeave={() => setIsDrag(false)}
          onDrop={handleDrop}
          sx={{
            border: `2px dashed ${isDrag ? '#1B7A3E' : '#dae8df'}`,
            borderRadius: '16px',
            p: 3,
            textAlign: 'center',
            cursor: 'pointer',
            background: isDrag ? '#eaf4ee' : '#fafdfb',
            transition: 'all 0.2s ease',
            '&:hover': { border: '2px dashed #1B7A3E', background: '#eaf4ee' },
          }}
        >
          {/* Icône centrale */}
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: isDrag ? '#1B7A3E' : '#eaf4ee',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 1.5,
              transition: 'all 0.2s',
            }}
          >
            <Image size={24} color={isDrag ? '#fff' : '#1B7A3E'} />
          </Box>

          <Typography sx={{ fontWeight: 700, fontSize: 13.5, color: '#0c1a10', mb: 0.5 }}>
            {isDrag ? 'Déposez l\'image ici' : 'Sélectionner une photo'}
          </Typography>
          <Typography sx={{ fontSize: 12, color: '#6b7c70', lineHeight: 1.6 }}>
            Cliquez ou glissez-déposez une image<br />
            JPG, PNG, WEBP · 5 Mo max
          </Typography>

          <Button
            size="small"
            variant="contained"
            startIcon={<Upload size={13} />}
            onClick={(e) => { e.stopPropagation(); inputRef.current?.click() }}
            sx={{ mt: 2, background: '#1B7A3E', fontWeight: 700, fontSize: 12, '&:hover': { background: '#0f4a25' } }}
          >
            Parcourir…
          </Button>
        </Box>
      )}
    </Box>
  )
}

// ========================
// PAGE PARAMÈTRES
// ========================
export default function Parametres() {
  const [values, setValues] = useState({})
  const [saved,  setSaved]  = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-parametres'],
    queryFn:  () => parametresApi.adminGetAll(),
  })

  useEffect(() => {
    if (data?.data?.data) setValues(data.data.data)
  }, [data])

  const updateMutation = useMutation({
    mutationFn: async (params) => {
      for (const [cle, valeur] of Object.entries(params)) {
        await parametresApi.update(cle, valeur)
      }
    },
    onSuccess: () => {
      toast.success('Paramètres sauvegardés.')
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    },
    onError: () => toast.error('Erreur lors de la sauvegarde.'),
  })

  const handleChange = (cle, val) =>
    setValues((prev) => ({ ...prev, [cle]: val }))

  const handleSave = () => updateMutation.mutate(values)

  if (isLoading) return <LoadingSpinner />

  return (
    <Box>
      <PageTitle
        title="Paramètres du site"
        subtitle="Configurez les informations générales affichées sur le portail public."
        action={
          <Button
            variant="contained"
            startIcon={
              updateMutation.isPending
                ? <CircularProgress size={14} sx={{ color: '#fff' }} />
                : <Save size={15} />
            }
            onClick={handleSave}
            disabled={updateMutation.isPending}
            sx={{ background: '#1B7A3E', '&:hover': { background: '#0f4a25' } }}
          >
            Enregistrer tout
          </Button>
        }
      />

      {saved && (
        <Alert severity="success" sx={{ mb: 2.5, borderRadius: '12px', fontSize: 13 }}>
          Paramètres sauvegardés avec succès.
        </Alert>
      )}

      <Grid container spacing={2.5}>
        {/* ── COLONNE GAUCHE ── */}
        <Grid item xs={12} md={8}>

          {/* MOT DU DIRECTEUR */}
          <ParamSection title="Mot du Directeur" icon={User}>
            <Grid container spacing={2.5}>

              {/* Nom */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Nom du Directeur"
                  fullWidth
                  size="small"
                  value={values.nom_directeur || ''}
                  onChange={(e) => handleChange('nom_directeur', e.target.value)}
                  placeholder="Ex : M. Kouamé Jean-Baptiste"
                />
              </Grid>

              {/* Photo — sélecteur fichier */}
              <Grid item xs={12}>
                <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: '#4b5e52', mb: 1.25 }}>
                  Photo du Directeur
                </Typography>
                <PhotoPicker
                  value={values.photo_directeur || ''}
                  onChange={(val) => handleChange('photo_directeur', val)}
                />
                <Typography sx={{ fontSize: 11, color: '#9ca3af', mt: 1 }}>
                  L'image est convertie et stockée directement. Elle sera affichée sur la page "Mot du Directeur" et sur la page d'accueil.
                </Typography>
              </Grid>

              {/* Message */}
              <Grid item xs={12}>
                <TextField
                  label="Message du Directeur"
                  fullWidth
                  multiline
                  rows={6}
                  value={values.mot_directeur || ''}
                  onChange={(e) => handleChange('mot_directeur', e.target.value)}
                  helperText="Ce texte apparaît sur la page 'Mot du Directeur' et en aperçu sur la page d'accueil."
                  placeholder="Chers parents, chers enfants,&#10;&#10;Bienvenue au Centre de Protection de la Petite Enfance d'Issia…"
                />
              </Grid>
            </Grid>
          </ParamSection>

          {/* COORDONNÉES */}
          <ParamSection title="Coordonnées de l'établissement" icon={Phone}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Téléphone principal"
                  fullWidth
                  size="small"
                  value={values.telephone || ''}
                  onChange={(e) => handleChange('telephone', e.target.value)}
                  placeholder="07 07 18 65 59"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="E-mail de contact"
                  type="email"
                  fullWidth
                  size="small"
                  value={values.email || ''}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="direction@cppe-issia.ci"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Adresse complète"
                  fullWidth
                  size="small"
                  value={values.adresse || ''}
                  onChange={(e) => handleChange('adresse', e.target.value)}
                  placeholder="Complexe Socio-Éducatif d'Issia, Haut-Sassandra"
                />
              </Grid>
            </Grid>
          </ParamSection>

          {/* HORAIRES */}
          <ParamSection title="Horaires d'ouverture" icon={Clock}>
            <TextField
              label="Horaires (affiché sur le site)"
              fullWidth
              size="small"
              value={values.horaires || ''}
              onChange={(e) => handleChange('horaires', e.target.value)}
              placeholder="Lundi au vendredi, 7h30 à 16h30"
            />
          </ParamSection>
        </Grid>

        {/* ── COLONNE DROITE ── */}
        <Grid item xs={12} md={4}>

          {/* INSCRIPTIONS */}
          <ParamSection title="Année scolaire & Inscriptions" icon={BookOpen}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Année scolaire en cours"
                fullWidth
                size="small"
                value={values.annee_scolaire_courante || ''}
                onChange={(e) => handleChange('annee_scolaire_courante', e.target.value)}
                placeholder="2025-2026"
                helperText="Format : AAAA-AAAA (ex : 2025-2026)"
              />
              <TextField
                label="Date de rentrée"
                fullWidth
                size="small"
                value={values.date_rentree || ''}
                onChange={(e) => handleChange('date_rentree', e.target.value)}
                placeholder="06 octobre 2025"
              />
              <TextField
                label="Montant scolarité (FCFA)"
                fullWidth
                size="small"
                type="number"
                value={values.scolarite_montant || ''}
                onChange={(e) => handleChange('scolarite_montant', e.target.value)}
                placeholder="50000"
                helperText="Montant de base, hors fêtes et photos"
              />

              <Divider />

              {/* Toggle inscriptions ouvertes */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 2,
                  borderRadius: '10px',
                  border: '1px solid #dae8df',
                  background: values.inscriptions_ouvertes === 'true' ? '#eaf4ee' : '#f9f9f9',
                  transition: 'background 0.2s',
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: 13, color: '#0c1a10' }}>
                    Inscriptions ouvertes
                  </Typography>
                  <Typography sx={{ fontSize: 11.5, color: '#6b7c70', mt: 0.25 }}>
                    Affiche ou masque le formulaire public
                  </Typography>
                </Box>
                <Button
                  size="small"
                  variant={values.inscriptions_ouvertes === 'true' ? 'contained' : 'outlined'}
                  onClick={() =>
                    handleChange(
                      'inscriptions_ouvertes',
                      values.inscriptions_ouvertes === 'true' ? 'false' : 'true'
                    )
                  }
                  sx={
                    values.inscriptions_ouvertes === 'true'
                      ? { background: '#1B7A3E', '&:hover': { background: '#0f4a25' }, fontSize: 11 }
                      : { borderColor: '#dae8df', color: '#6b7c70', fontSize: 11 }
                  }
                >
                  {values.inscriptions_ouvertes === 'true' ? 'Ouvertes' : 'Fermées'}
                </Button>
              </Box>
            </Box>
          </ParamSection>

          {/* INFO BOX */}
          <Box
            sx={{
              background: '#eaf4ee',
              border: '1px solid rgba(27,122,62,0.2)',
              borderRadius: '12px',
              p: 2,
              fontSize: 12.5,
              color: '#2d3a30',
              lineHeight: 1.7,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75, fontWeight: 700, color: '#1B7A3E' }}>
              <Settings size={14} />
              Information
            </Box>
            Les paramètres sont appliqués immédiatement sur le site public après enregistrement.
            La photo du directeur est stockée en base64 directement dans la base de données.
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}