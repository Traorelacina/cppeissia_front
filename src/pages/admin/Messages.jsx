import { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Button,
  Divider,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
} from '@mui/material'
import { Mail, MailOpen, Trash2, MessageSquare, Search } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { messagesApi } from '@/api/services'
import { PageTitle, EmptyState, LoadingSpinner } from '@/components/common'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import toast from 'react-hot-toast'

export default function Messages() {
  const queryClient = useQueryClient()
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['messages'],
    queryFn: () => messagesApi.getAll(),
  })

  const marquerLuMutation = useMutation({
    mutationFn: (id) => messagesApi.marquerLu(id),
    onSuccess: () => queryClient.invalidateQueries(['messages']),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => messagesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['messages'])
      if (selected?.id === deleteId) setSelected(null)
      setDeleteId(null)
      toast.success('Message supprimé.')
    },
  })

  const messages = (data?.data?.data?.data || []).filter(
    (m) => !search || m.nom?.toLowerCase().includes(search.toLowerCase()) || m.sujet?.toLowerCase().includes(search.toLowerCase())
  )

  const handleSelect = (msg) => {
    setSelected(msg)
    if (!msg.lu) marquerLuMutation.mutate(msg.id)
  }

  return (
    <Box>
      <PageTitle
        title="Messages de contact"
        subtitle="Consultez et gérez les messages envoyés via le formulaire de contact."
      />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '340px 1fr' }, gap: 2, height: 'calc(100vh - 200px)', minHeight: 500 }}>
        {/* LISTE DES MESSAGES */}
        <Paper sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Box sx={{ p: 2, borderBottom: '1px solid #dae8df' }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Search size={14} color="#6b7c70" /></InputAdornment>,
              }}
            />
          </Box>

          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            {isLoading ? (
              <LoadingSpinner />
            ) : messages.length === 0 ? (
              <EmptyState icon={MessageSquare} title="Aucun message" />
            ) : (
              messages.map((msg, i) => (
                <Box
                  key={msg.id}
                  onClick={() => handleSelect(msg)}
                  sx={{
                    px: 2,
                    py: 2,
                    borderBottom: '1px solid #f3f7f4',
                    cursor: 'pointer',
                    background: selected?.id === msg.id ? '#eaf4ee' : 'transparent',
                    transition: 'background 0.15s',
                    '&:hover': { background: selected?.id === msg.id ? '#eaf4ee' : '#f9fbf9' },
                    borderLeft: !msg.lu ? '3px solid #1B7A3E' : '3px solid transparent',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography sx={{ fontWeight: msg.lu ? 500 : 700, fontSize: 13, color: '#0c1a10' }}>
                      {msg.nom}
                    </Typography>
                    <Typography sx={{ fontSize: 10.5, color: '#6b7c70' }}>
                      {msg.created_at ? format(new Date(msg.created_at), 'dd/MM') : ''}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: 12.5, color: '#6b7c70', mt: 0.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {msg.sujet}
                  </Typography>
                  <Typography sx={{ fontSize: 11.5, color: '#9ca3af', mt: 0.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {msg.email}
                  </Typography>
                </Box>
              ))
            )}
          </Box>
        </Paper>

        {/* DETAIL DU MESSAGE */}
        <Paper sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {!selected ? (
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 1.5 }}>
              <Mail size={40} color="#dae8df" />
              <Typography sx={{ color: '#6b7c70', fontSize: 13 }}>Sélectionnez un message</Typography>
            </Box>
          ) : (
            <>
              <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid #dae8df', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: 17, color: '#0c1a10', mb: 0.5 }}>
                    {selected.sujet}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Typography sx={{ fontSize: 12.5, color: '#6b7c70' }}>
                      De : <strong style={{ color: '#0c1a10' }}>{selected.nom}</strong> ({selected.email})
                    </Typography>
                    {selected.telephone && (
                      <Typography sx={{ fontSize: 12.5, color: '#6b7c70' }}>
                        Tel : {selected.telephone}
                      </Typography>
                    )}
                  </Box>
                  <Typography sx={{ fontSize: 11.5, color: '#9ca3af', mt: 0.5 }}>
                    {selected.created_at ? format(new Date(selected.created_at), "dd MMMM yyyy 'à' HH:mm", { locale: fr }) : ''}
                  </Typography>
                </Box>
                <Tooltip title="Supprimer">
                  <IconButton
                    size="small"
                    onClick={() => setDeleteId(selected.id)}
                    sx={{ color: '#dc2626' }}
                  >
                    <Trash2 size={17} />
                  </IconButton>
                </Tooltip>
              </Box>

              <Box sx={{ flex: 1, p: 3, overflowY: 'auto' }}>
                <Box
                  sx={{
                    background: '#f9fbf9',
                    borderRadius: '12px',
                    p: 2.5,
                    fontSize: 14,
                    color: '#2d3a30',
                    lineHeight: 1.8,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {selected.message}
                </Box>
              </Box>

              <Box sx={{ px: 3, py: 2, borderTop: '1px solid #dae8df' }}>
                <Button
                  variant="outlined"
                  size="small"
                  component="a"
                  href={`mailto:${selected.email}?subject=Re: ${selected.sujet}`}
                  sx={{ borderColor: '#1B7A3E', color: '#1B7A3E', fontSize: 12 }}
                >
                  Répondre par email →
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </Box>

      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} PaperProps={{ sx: { borderRadius: '16px', maxWidth: 400 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Supprimer ce message ?</DialogTitle>
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