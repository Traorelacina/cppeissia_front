// ============================================================
// ACTIVITES LIST - src/pages/admin/Activites/ActivitesList.jsx
// ============================================================
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Box, Paper, Table, TableBody, TableCell, TableHead, TableRow,
  Button, TextField, InputAdornment, IconButton, Tooltip, Typography, Dialog,
  DialogTitle, DialogContent, DialogActions,
} from '@mui/material'
import { Plus, Search, Pencil, Trash2, Drama } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { activitesApi } from '@/api/services'
import { PageTitle, EmptyState, TableSkeleton } from '@/components/common'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import toast from 'react-hot-toast'

export default function ActivitesList() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-activites'],
    queryFn: () => activitesApi.adminGetAll(),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => activitesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-activites'])
      toast.success('Activité supprimée.')
      setDeleteId(null)
    },
  })

  const activites = (data?.data?.data?.data || []).filter(
    (a) => !search || a.titre?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Box>
      <PageTitle
        title="Activités & Blog"
        subtitle="Publiez les comptes-rendus et galeries des activités du CPPE."
        action={
          <Button
            component={Link}
            to="/admin/activites/nouvelle"
            variant="contained"
            startIcon={<Plus size={16} />}
            sx={{ background: '#1B7A3E', '&:hover': { background: '#0f4a25' } }}
          >
            Nouvelle activité
          </Button>
        }
      />

      <Paper sx={{ overflow: 'hidden' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid #dae8df' }}>
          <TextField
            size="small" placeholder="Rechercher..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search size={15} color="#6b7c70" /></InputAdornment> }}
            sx={{ width: 280 }}
          />
        </Box>

        {isLoading ? (
          <Box sx={{ p: 2 }}><TableSkeleton rows={5} cols={4} /></Box>
        ) : activites.length === 0 ? (
          <EmptyState icon={Drama} title="Aucune activité" description="Documentez les activités pédagogiques et fêtes scolaires." />
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ background: '#f9fbf9' }}>
                <TableCell>Titre</TableCell>
                <TableCell>Section</TableCell>
                <TableCell>Date activité</TableCell>
                <TableCell>Photos</TableCell>
                <TableCell>Publié</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {activites.map((actu) => (
                <TableRow key={actu.id} hover>
                  <TableCell>
                    <Typography sx={{ fontWeight: 600, fontSize: 13, maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {actu.titre}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'inline-block', px: 1, py: 0.3, borderRadius: '4px', fontSize: 10, fontWeight: 700, background: '#eaf4ee', color: '#1B7A3E', textTransform: 'uppercase' }}>
                      {actu.section}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontSize: 12.5, color: '#6b7c70' }}>
                    {actu.date_activite ? format(new Date(actu.date_activite), 'dd MMM yyyy', { locale: fr }) : '—'}
                  </TableCell>
                  <TableCell sx={{ fontSize: 12.5, color: '#6b7c70' }}>{actu.media_count || 0} fichiers</TableCell>
                  <TableCell>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', background: actu.publie ? '#15803d' : '#dae8df' }} />
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                      <Tooltip title="Modifier">
                        <IconButton size="small" onClick={() => navigate(`/admin/activites/${actu.id}/modifier`)} sx={{ color: '#1B7A3E' }}>
                          <Pencil size={15} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton size="small" onClick={() => setDeleteId(actu.id)} sx={{ color: '#dc2626' }}>
                          <Trash2 size={15} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} PaperProps={{ sx: { borderRadius: '16px', maxWidth: 400 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Supprimer cette activité ?</DialogTitle>
        <DialogContent><Typography sx={{ color: '#6b7c70', fontSize: 13.5 }}>Toutes les photos liées seront également supprimées.</Typography></DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setDeleteId(null)} sx={{ color: '#6b7c70' }}>Annuler</Button>
          <Button variant="contained" onClick={() => deleteMutation.mutate(deleteId)} sx={{ background: '#dc2626' }}>Supprimer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}