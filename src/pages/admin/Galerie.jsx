import { useState } from 'react'
import {
  Box, Paper, Grid, Typography, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, Select, MenuItem, FormControl, InputLabel, IconButton,
} from '@mui/material'
import { Upload, Trash2, X, Image } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { mediasApi, activitesApi } from '@/api/services'
import { PageTitle, EmptyState, LoadingSpinner } from '@/components/common'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'

export default function Galerie() {
  const queryClient = useQueryClient()
  const [activiteId, setActiviteId] = useState('')
  const [uploadFiles, setUploadFiles] = useState([])
  const [uploadOpen, setUploadOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const { data: mediasData, isLoading } = useQuery({
    queryKey: ['medias'],
    queryFn: () => mediasApi.getAll({ per_page: 50 }),
  })

  const { data: activitesData } = useQuery({
    queryKey: ['activites-list'],
    queryFn: () => activitesApi.adminGetAll({ per_page: 100 }),
  })

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [], 'video/*': [] },
    onDrop: (files) => setUploadFiles((prev) => [...prev, ...files]),
  })

  const uploadMutation = useMutation({
    mutationFn: async () => {
      for (const file of uploadFiles) {
        const fd = new FormData()
        fd.append('activite_id', activiteId)
        fd.append('fichier', file)
        fd.append('collection', file.type.startsWith('video/') ? 'videos' : 'photos')
        await mediasApi.upload(fd)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['medias'])
      setUploadFiles([])
      setActiviteId('')
      setUploadOpen(false)
      toast.success('Fichiers uploadés.')
    },
    onError: () => toast.error('Erreur lors de l\'upload.'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => mediasApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['medias'])
      toast.success('Fichier supprimé.')
      setDeleteId(null)
    },
  })

  const medias = mediasData?.data?.data?.data || []
  const activites = activitesData?.data?.data?.data || []

  return (
    <Box>
      <PageTitle
        title="Galerie Médias"
        subtitle="Gérez les photos et vidéos des activités du CPPE."
        action={
          <Button
            variant="contained"
            startIcon={<Upload size={16} />}
            onClick={() => setUploadOpen(true)}
            sx={{ background: '#1B7A3E', '&:hover': { background: '#0f4a25' } }}
          >
            Uploader des fichiers
          </Button>
        }
      />

      {/* GRILLE MÉDIAS */}
      {isLoading ? (
        <LoadingSpinner />
      ) : medias.length === 0 ? (
        <EmptyState
          icon={Image}
          title="Galerie vide"
          description="Uploadez des photos et vidéos des activités du CPPE."
          action={
            <Button variant="contained" size="small" onClick={() => setUploadOpen(true)} sx={{ background: '#1B7A3E' }}>
              Uploader maintenant
            </Button>
          }
        />
      ) : (
        <Grid container spacing={1.5}>
          {medias.map((media) => (
            <Grid item xs={6} sm={4} md={3} lg={2} key={media.id}>
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid #dae8df',
                  aspectRatio: '1',
                  background: '#f3f7f4',
                  '&:hover .media-actions': { opacity: 1 },
                }}
              >
                <Box
                  component="img"
                  src={media.url_thumb || media.url}
                  alt={media.nom}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.style.display = 'none' }}
                />
                <Box
                  className="media-actions"
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.2s',
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => setDeleteId(media.id)}
                    sx={{ background: '#dc2626', color: '#fff', '&:hover': { background: '#b91c1c' } }}
                  >
                    <Trash2 size={14} />
                  </IconButton>
                </Box>
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
                    px: 1,
                    py: 0.75,
                  }}
                >
                  <Typography sx={{ fontSize: 10, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {media.nom}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      {/* DIALOG UPLOAD */}
      <Dialog open={uploadOpen} onClose={() => setUploadOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
        <DialogTitle sx={{ fontWeight: 700, fontSize: 18 }}>Uploader des fichiers</DialogTitle>
        <DialogContent>
          <FormControl fullWidth size="small" sx={{ mb: 2.5 }}>
            <InputLabel>Activité associée *</InputLabel>
            <Select label="Activité associée *" value={activiteId} onChange={(e) => setActiviteId(e.target.value)}>
              {activites.map((a) => (
                <MenuItem key={a.id} value={a.id}>{a.titre}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box
            {...getRootProps()}
            sx={{
              border: `2px dashed ${isDragActive ? '#1B7A3E' : '#dae8df'}`,
              borderRadius: '12px',
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              background: isDragActive ? '#eaf4ee' : 'transparent',
              '&:hover': { borderColor: '#1B7A3E' },
              mb: 2,
            }}
          >
            <input {...getInputProps()} />
            <Upload size={28} color="#dae8df" style={{ marginBottom: 8 }} />
            <Typography sx={{ fontSize: 13, color: '#6b7c70' }}>
              Glissez vos fichiers ici ou cliquez
            </Typography>
            <Typography sx={{ fontSize: 11, color: '#9ca3af', mt: 0.5 }}>JPEG, PNG, WebP, MP4</Typography>
          </Box>

          {uploadFiles.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {uploadFiles.map((file, i) => (
                <Box key={i} sx={{ position: 'relative', display: 'inline-block' }}>
                  <Box
                    component="img"
                    src={URL.createObjectURL(file)}
                    sx={{ width: 70, height: 70, borderRadius: '8px', objectFit: 'cover', border: '1px solid #dae8df' }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => setUploadFiles((prev) => prev.filter((_, j) => j !== i))}
                    sx={{ position: 'absolute', top: -6, right: -6, background: '#dc2626', color: '#fff', width: 18, height: 18, '&:hover': { background: '#b91c1c' } }}
                  >
                    <X size={10} />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setUploadOpen(false)} sx={{ color: '#6b7c70' }}>Annuler</Button>
          <Button
            variant="contained"
            onClick={() => uploadMutation.mutate()}
            disabled={!activiteId || uploadFiles.length === 0 || uploadMutation.isPending}
            sx={{ background: '#1B7A3E' }}
          >
            {uploadMutation.isPending ? 'Upload en cours...' : `Uploader ${uploadFiles.length} fichier(s)`}
          </Button>
        </DialogActions>
      </Dialog>

      {/* SUPPRESSION */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} PaperProps={{ sx: { borderRadius: '16px', maxWidth: 400 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Supprimer ce fichier ?</DialogTitle>
        <DialogContent><Typography sx={{ color: '#6b7c70', fontSize: 13.5 }}>Cette action est irréversible.</Typography></DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setDeleteId(null)} sx={{ color: '#6b7c70' }}>Annuler</Button>
          <Button variant="contained" onClick={() => deleteMutation.mutate(deleteId)} sx={{ background: '#dc2626' }}>Supprimer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}