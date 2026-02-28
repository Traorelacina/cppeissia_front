import { useState } from 'react'
import {
  Box, Paper, Table, TableBody, TableCell, TableHead, TableRow,
  Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Select, MenuItem, FormControl, InputLabel, IconButton, Tooltip, Chip,
} from '@mui/material'
import { Plus, Pencil, Trash2, CalendarDays } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { calendrierApi } from '@/api/services'
import { PageTitle, EmptyState, LoadingSpinner } from '@/components/common'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const TYPE_COLORS = {
  vacances: { bg: '#dbeafe', color: '#1d4ed8', label: 'Vacances' },
  ferie:    { bg: '#fce4ec', color: '#c62828', label: 'Jour férié' },
  rentree:  { bg: '#dcfce7', color: '#15803d', label: 'Rentrée' },
  evenement:{ bg: '#fff3e0', color: '#7c3d00', label: 'Événement' },
  examen:   { bg: '#f3e8ff', color: '#6b21a8', label: 'Examen' },
}

export default function CalendrierAdmin() {
  const queryClient = useQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editItem, setEditItem]     = useState(null)
  const [deleteId, setDeleteId]     = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-calendrier'],
    queryFn:  () => calendrierApi.adminGetAll(),
  })

  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      label: '', date_debut: '', date_fin: '',
      type: 'vacances', annee_scolaire: '2025-2026', description: '',
    },
  })

  const openCreate = () => { reset(); setEditItem(null); setDialogOpen(true) }

  const openEdit = (item) => {
    setEditItem(item)
    setValue('label',          item.label)
    setValue('date_debut',     item.date_debut?.slice(0, 10))
    setValue('date_fin',       item.date_fin?.slice(0, 10))
    setValue('type',           item.type)
    setValue('annee_scolaire', item.annee_scolaire)
    setValue('description',    item.description || '')
    setDialogOpen(true)
  }

  const createMutation = useMutation({
    mutationFn: (d) => calendrierApi.create(d),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-calendrier'])
      toast.success('Événement ajouté.')
      setDialogOpen(false)
    },
    onError: () => toast.error('Erreur lors de l\'enregistrement.'),
  })

  const updateMutation = useMutation({
    mutationFn: (d) => calendrierApi.update(editItem.id, d),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-calendrier'])
      toast.success('Événement mis à jour.')
      setDialogOpen(false)
    },
    onError: () => toast.error('Erreur lors de la mise à jour.'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => calendrierApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-calendrier'])
      toast.success('Événement supprimé.')
      setDeleteId(null)
    },
  })

  const onSubmit = (d) => editItem ? updateMutation.mutate(d) : createMutation.mutate(d)

  const evenements = data?.data?.data || []

  return (
    <Box>
      <PageTitle
        title="Calendrier Scolaire"
        subtitle="Gérez les vacances, jours fériés et événements de l'année 2025-2026."
        action={
          <Button
            variant="contained"
            startIcon={<Plus size={16} />}
            onClick={openCreate}
            sx={{ background: '#1B7A3E', '&:hover': { background: '#0f4a25' } }}
          >
            Ajouter un événement
          </Button>
        }
      />

      <Paper sx={{ overflow: 'hidden' }}>
        {isLoading ? (
          <LoadingSpinner />
        ) : evenements.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="Calendrier vide"
            description="Ajoutez les vacances et événements de l'année scolaire 2025-2026."
            action={<Button variant="contained" size="small" onClick={openCreate} sx={{ background: '#1B7A3E' }}>Ajouter</Button>}
          />
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ background: '#f9fbf9' }}>
                <TableCell>Événement</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Début</TableCell>
                <TableCell>Fin</TableCell>
                <TableCell>Durée</TableCell>
                <TableCell>Année scolaire</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {evenements.map((ev) => {
                const tc = TYPE_COLORS[ev.type] || TYPE_COLORS.evenement
                const debut = ev.date_debut ? new Date(ev.date_debut) : null
                const fin   = ev.date_fin   ? new Date(ev.date_fin)   : null
                const duree = debut && fin
                  ? Math.round((fin - debut) / 86400000) + 1
                  : null

                return (
                  <TableRow key={ev.id} hover>
                    <TableCell>
                      <Typography sx={{ fontWeight: 600, fontSize: 13, color: '#0c1a10' }}>
                        {ev.label}
                      </Typography>
                      {ev.description && (
                        <Typography sx={{ fontSize: 11.5, color: '#9ca3af', mt: 0.3 }}>
                          {ev.description}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={tc.label}
                        size="small"
                        sx={{ background: tc.bg, color: tc.color, fontWeight: 700, fontSize: 10.5 }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: 12.5, color: '#2d3a30', whiteSpace: 'nowrap' }}>
                      {debut ? format(debut, 'dd MMM yyyy', { locale: fr }) : '—'}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12.5, color: '#2d3a30', whiteSpace: 'nowrap' }}>
                      {fin ? format(fin, 'dd MMM yyyy', { locale: fr }) : '—'}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12.5, color: '#6b7c70' }}>
                      {duree ? `${duree} j.` : '—'}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12.5, color: '#6b7c70' }}>
                      {ev.annee_scolaire}
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                        <Tooltip title="Modifier">
                          <IconButton size="small" onClick={() => openEdit(ev)} sx={{ color: '#1B7A3E' }}>
                            <Pencil size={15} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer">
                          <IconButton size="small" onClick={() => setDeleteId(ev.id)} sx={{ color: '#dc2626' }}>
                            <Trash2 size={15} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </Paper>

      {/* DIALOG CRÉATION / ÉDITION */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: 18 }}>
          {editItem ? 'Modifier l\'événement' : 'Nouvel événement'}
        </DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}
          >
            <TextField
              label="Intitulé *"
              size="small"
              fullWidth
              {...register('label', { required: true })}
            />

            <FormControl size="small" fullWidth>
              <InputLabel>Type *</InputLabel>
              <Select label="Type *" defaultValue="vacances" {...register('type', { required: true })}>
                {Object.entries(TYPE_COLORS).map(([val, { label }]) => (
                  <MenuItem key={val} value={val}>{label}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Date de début *"
              type="date"
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
              {...register('date_debut', { required: true })}
            />
            <TextField
              label="Date de fin *"
              type="date"
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
              {...register('date_fin', { required: true })}
            />
            <TextField
              label="Année scolaire"
              size="small"
              fullWidth
              {...register('annee_scolaire')}
            />
            <TextField
              label="Description (optionnel)"
              size="small"
              fullWidth
              multiline
              rows={2}
              {...register('description')}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0, gap: 1 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ color: '#6b7c70' }}>
            Annuler
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            disabled={createMutation.isPending || updateMutation.isPending}
            sx={{ background: '#1B7A3E', '&:hover': { background: '#0f4a25' } }}
          >
            {editItem ? 'Mettre à jour' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* DIALOG SUPPRESSION */}
      <Dialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        PaperProps={{ sx: { borderRadius: '16px', maxWidth: 400 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Supprimer cet événement ?</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#6b7c70', fontSize: 13.5 }}>
            Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setDeleteId(null)} sx={{ color: '#6b7c70' }}>Annuler</Button>
          <Button
            variant="contained"
            onClick={() => deleteMutation.mutate(deleteId)}
            disabled={deleteMutation.isPending}
            sx={{ background: '#dc2626', '&:hover': { background: '#b91c1c' } }}
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}