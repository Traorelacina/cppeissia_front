import { useState } from 'react'
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  Chip,
  Alert,
} from '@mui/material'
import { Plus, Pencil, Trash2, RotateCcw, Users, Shield } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '@/api/services'
import { PageTitle, EmptyState, LoadingSpinner } from '@/components/common'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const ROLES = [
  { value: 'super-admin', label: 'Super Administrateur', color: '#4ade80', bg: 'rgba(27,122,62,0.2)' },
  { value: 'directeur', label: 'Directeur', color: '#F5A623', bg: 'rgba(245,166,35,0.2)' },
  { value: 'secretaire', label: 'Secrétaire', color: '#60a5fa', bg: 'rgba(59,130,246,0.2)' },
]

function RoleBadge({ role }) {
  const r = ROLES.find(r => r.value === role) || ROLES[2]
  return (
    <Box
      component="span"
      sx={{
        px: 1.25,
        py: 0.35,
        borderRadius: '5px',
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.5px',
        background: r.bg,
        color: r.color,
      }}
    >
      {r.label.toUpperCase()}
    </Box>
  )
}

export default function Utilisateurs() {
  const queryClient = useQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [editUser, setEditUser] = useState(null)
  const [resetPwdResult, setResetPwdResult] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getAll(),
  })

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const createMutation = useMutation({
    mutationFn: (data) => usersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['users'])
      toast.success('Compte créé avec succès.')
      setDialogOpen(false)
      reset()
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Erreur.'),
  })

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }) => usersApi.updateRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries(['users'])
      toast.success('Rôle mis à jour.')
      setEditUser(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => usersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['users'])
      toast.success('Compte supprimé.')
      setDeleteId(null)
    },
  })

  const resetPwdMutation = useMutation({
    mutationFn: (id) => usersApi.resetPassword(id),
    onSuccess: (data) => {
      setResetPwdResult(data.data.data.nouveau_mot_de_passe)
    },
    onError: () => toast.error('Erreur lors de la réinitialisation.'),
  })

  const users = data?.data?.data || []

  return (
    <Box>
      <PageTitle
        title="Utilisateurs & Rôles"
        subtitle="Gérez les comptes et les accès de l'équipe administrative."
        action={
          <Button
            variant="contained"
            startIcon={<Plus size={16} />}
            onClick={() => setDialogOpen(true)}
            sx={{ background: '#1B7A3E', '&:hover': { background: '#0f4a25' } }}
          >
            Nouveau compte
          </Button>
        }
      />

      <Alert severity="info" icon={<Shield size={18} />} sx={{ mb: 2.5, borderRadius: '12px', fontSize: 13 }}>
        Cette section est réservée aux Super Administrateurs. Toute modification est enregistrée et auditée.
      </Alert>

      <Paper sx={{ overflow: 'hidden' }}>
        {isLoading ? (
          <LoadingSpinner />
        ) : users.length === 0 ? (
          <EmptyState icon={Users} title="Aucun utilisateur" />
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ background: '#f9fbf9' }}>
                <TableCell>Utilisateur</TableCell>
                <TableCell>Rôle</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Créé le</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          background: '#F5A623',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 900,
                          fontSize: 14,
                          color: '#0f4a25',
                        }}
                      >
                        {user.name?.[0]?.toUpperCase()}
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 700, fontSize: 13, color: '#0c1a10' }}>{user.name}</Typography>
                        <Typography sx={{ fontSize: 12, color: '#6b7c70' }}>{user.email}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <RoleBadge role={user.roles?.[0]} />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.actif ? 'Actif' : 'Inactif'}
                      size="small"
                      sx={{
                        fontSize: 11,
                        fontWeight: 700,
                        background: user.actif ? '#dcfce7' : '#f3f4f6',
                        color: user.actif ? '#15803d' : '#6b7280',
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: 12.5, color: '#6b7c70' }}>
                    {user.created_at ? format(new Date(user.created_at), 'dd MMM yyyy', { locale: fr }) : '—'}
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                      <Tooltip title="Changer le rôle">
                        <IconButton size="small" onClick={() => setEditUser(user)} sx={{ color: '#1B7A3E' }}>
                          <Pencil size={15} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Réinitialiser mot de passe">
                        <IconButton size="small" onClick={() => resetPwdMutation.mutate(user.id)} sx={{ color: '#6b7c70' }}>
                          <RotateCcw size={15} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton size="small" onClick={() => setDeleteId(user.id)} sx={{ color: '#dc2626' }}>
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

      {/* DIALOG CRÉATION */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
        <DialogTitle sx={{ fontWeight: 700, fontSize: 18 }}>Nouveau compte</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField label="Nom complet *" size="small" fullWidth {...register('name', { required: true })} />
            <TextField label="E-mail *" type="email" size="small" fullWidth {...register('email', { required: true })} />
            <TextField label="Mot de passe *" type="password" size="small" fullWidth {...register('password', { required: true, minLength: 8 })} />
            <TextField label="Confirmer le mot de passe *" type="password" size="small" fullWidth {...register('password_confirmation', { required: true })} />
            <FormControl size="small" fullWidth>
              <InputLabel>Rôle *</InputLabel>
              <Select label="Rôle *" defaultValue="secretaire" {...register('role', { required: true })}>
                {ROLES.map(r => <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ color: '#6b7c70' }}>Annuler</Button>
          <Button
            variant="contained"
            onClick={handleSubmit((data) => createMutation.mutate(data))}
            sx={{ background: '#1B7A3E' }}
          >
            Créer
          </Button>
        </DialogActions>
      </Dialog>

      {/* DIALOG CHANGEMENT ROLE */}
      {editUser && (
        <Dialog open onClose={() => setEditUser(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
          <DialogTitle sx={{ fontWeight: 700, fontSize: 18 }}>Modifier le rôle</DialogTitle>
          <DialogContent>
            <Typography sx={{ color: '#6b7c70', fontSize: 13, mb: 2 }}>Utilisateur : <strong>{editUser.name}</strong></Typography>
            <FormControl fullWidth size="small">
              <InputLabel>Nouveau rôle</InputLabel>
              <Select
                label="Nouveau rôle"
                defaultValue={editUser.roles?.[0] || 'secretaire'}
                onChange={(e) => updateRoleMutation.mutate({ id: editUser.id, role: e.target.value })}
              >
                {ROLES.map(r => <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>)}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button onClick={() => setEditUser(null)} sx={{ color: '#6b7c70' }}>Fermer</Button>
          </DialogActions>
        </Dialog>
      )}

      {/* DIALOG MOT DE PASSE RÉINITIALISÉ */}
      {resetPwdResult && (
        <Dialog open onClose={() => setResetPwdResult(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
          <DialogTitle sx={{ fontWeight: 700, fontSize: 18 }}>Mot de passe réinitialisé</DialogTitle>
          <DialogContent>
            <Alert severity="warning" sx={{ mb: 1, fontSize: 13 }}>
              Transmettez ce mot de passe à l'utilisateur de façon sécurisée. Il ne sera plus affiché.
            </Alert>
            <Box sx={{ background: '#f9fbf9', borderRadius: '10px', p: 2, fontFamily: 'monospace', fontSize: 18, fontWeight: 700, textAlign: 'center', letterSpacing: '2px', color: '#0c1a10' }}>
              {resetPwdResult}
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button variant="contained" onClick={() => setResetPwdResult(null)} sx={{ background: '#1B7A3E' }}>
              J'ai noté le mot de passe
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* SUPPRESSION */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} PaperProps={{ sx: { borderRadius: '16px', maxWidth: 400 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Supprimer ce compte ?</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#6b7c70', fontSize: 13.5 }}>Cette action est irréversible.</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setDeleteId(null)} sx={{ color: '#6b7c70' }}>Annuler</Button>
          <Button
            variant="contained"
            onClick={() => deleteMutation.mutate(deleteId)}
            sx={{ background: '#dc2626', '&:hover': { background: '#b91c1c' } }}
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}