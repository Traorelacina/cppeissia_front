import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Select,
  MenuItem,
  FormControl,
  Tooltip,
} from '@mui/material'
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Newspaper,
  Filter,
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { actualitesApi } from '@/api/services'
import { PageTitle, StatusBadge, LoadingSpinner, EmptyState, TableSkeleton } from '@/components/common'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import toast from 'react-hot-toast'

export default function ActualitesList() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [statut, setStatut] = useState('')
  const [deleteId, setDeleteId] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-actualites', search, statut],
    queryFn: () => actualitesApi.adminGetAll({ search: search || undefined, statut: statut || undefined }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => actualitesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-actualites'])
      toast.success('Actualité supprimée.')
      setDeleteId(null)
    },
    onError: () => toast.error('Erreur lors de la suppression.'),
  })

  const toggleStatut = useMutation({
    mutationFn: ({ id, statut }) => actualitesApi.updateStatut(id, statut),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-actualites'])
      toast.success('Statut mis à jour.')
    },
  })

  const actualites = data?.data?.data?.data || []

  return (
    <Box>
      <PageTitle
        title="Flash Infos & Actualités"
        subtitle="Gérez les annonces, convocations et informations publiées sur le site."
        action={
          <Button
            component={Link}
            to="/admin/actualites/nouvelle"
            variant="contained"
            startIcon={<Plus size={16} />}
            sx={{ background: '#1B7A3E', '&:hover': { background: '#0f4a25' } }}
          >
            Nouvelle info
          </Button>
        }
      />

      <Paper sx={{ overflow: 'hidden' }}>
        {/* BARRE DE FILTRES */}
        <Box sx={{ display: 'flex', gap: 2, p: 2, borderBottom: '1px solid #dae8df', flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Search size={15} color="#6b7c70" /></InputAdornment>,
            }}
            sx={{ flex: 1, minWidth: 200 }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <Select
              value={statut}
              onChange={(e) => setStatut(e.target.value)}
              displayEmpty
              startAdornment={<Filter size={14} color="#6b7c70" style={{ marginRight: 6 }} />}
              sx={{ fontSize: 13 }}
            >
              <MenuItem value="">Tous les statuts</MenuItem>
              <MenuItem value="publie">Publié</MenuItem>
              <MenuItem value="brouillon">Brouillon</MenuItem>
              <MenuItem value="planifie">Planifié</MenuItem>
              <MenuItem value="archive">Archivé</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {isLoading ? (
          <Box sx={{ p: 2 }}>
            <TableSkeleton rows={6} cols={5} />
          </Box>
        ) : actualites.length === 0 ? (
          <EmptyState
            icon={Newspaper}
            title="Aucune actualité"
            description="Créez votre première actualité pour informer les parents."
            action={
              <Button
                component={Link}
                to="/admin/actualites/nouvelle"
                variant="contained"
                size="small"
                sx={{ background: '#1B7A3E' }}
              >
                Créer une info
              </Button>
            }
          />
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ background: '#f9fbf9' }}>
                <TableCell>Titre</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Auteur</TableCell>
                <TableCell>Date publication</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {actualites.map((actu) => (
                <TableRow key={actu.id} hover>
                  <TableCell>
                    <Typography sx={{ fontWeight: 600, fontSize: 13, color: '#0c1a10', maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {actu.titre}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: 'inline-block',
                        px: 1,
                        py: 0.3,
                        borderRadius: '4px',
                        fontSize: 10,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        background: '#eaf4ee',
                        color: '#1B7A3E',
                      }}
                    >
                      {actu.type}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontSize: 12.5, color: '#6b7c70' }}>
                    {actu.auteur?.name || '—'}
                  </TableCell>
                  <TableCell sx={{ fontSize: 12.5, color: '#6b7c70', whiteSpace: 'nowrap' }}>
                    {actu.date_publication
                      ? format(new Date(actu.date_publication), 'dd MMM yyyy', { locale: fr })
                      : '—'}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={actu.statut} />
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                      <Tooltip title={actu.statut === 'publie' ? 'Dépublier' : 'Publier'}>
                        <IconButton
                          size="small"
                          onClick={() => toggleStatut.mutate({ id: actu.id, statut: actu.statut === 'publie' ? 'brouillon' : 'publie' })}
                          sx={{ color: actu.statut === 'publie' ? '#b87b0f' : '#15803d' }}
                        >
                          {actu.statut === 'publie' ? <EyeOff size={16} /> : <Eye size={16} />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Modifier">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/admin/actualites/${actu.id}/modifier`)}
                          sx={{ color: '#1B7A3E' }}
                        >
                          <Pencil size={16} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton
                          size="small"
                          onClick={() => setDeleteId(actu.id)}
                          sx={{ color: '#dc2626' }}
                        >
                          <Trash2 size={16} />
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

      {/* DIALOG CONFIRMATION SUPPRESSION */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} PaperProps={{ sx: { borderRadius: '16px', maxWidth: 400 } }}>
        <DialogTitle sx={{ fontWeight: 700, fontSize: 18, color: '#0c1a10', pb: 1 }}>
          Supprimer cette actualité ?
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#6b7c70', fontSize: 13.5 }}>
            Cette action est irréversible. L'actualité sera définitivement supprimée.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0, gap: 1 }}>
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