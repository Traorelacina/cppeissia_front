import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Paper, Table, TableBody, TableCell, TableHead, TableRow,
  Button, TextField, InputAdornment, Typography, Select, MenuItem,
  FormControl, Tooltip, IconButton, TablePagination, Chip,
} from '@mui/material'
import { Search, Eye, Download, ClipboardList, FileDown } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { inscriptionsApi } from '@/api/services'
import { PageTitle, StatusBadge, EmptyState, TableSkeleton } from '@/components/common'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import toast from 'react-hot-toast'

const SECTIONS = [
  { value: '',       label: 'Toutes les sections' },
  { value: 'creche', label: 'Crèche' },
  { value: 'ps',     label: 'Petite Section' },
  { value: 'ms',     label: 'Moyenne Section' },
  { value: 'gs',     label: 'Grande Section' },
]

export default function InscriptionsList() {
  // ✅ navigate vers /admin/inscriptions/:id — le backend route show() attend un ID entier
  const navigate = useNavigate()
  const [search,  setSearch]  = useState('')
  const [section, setSection] = useState('')
  const [statut,  setStatut]  = useState('')
  const [page,    setPage]    = useState(0)

  const { data, isLoading } = useQuery({
    queryKey: ['inscriptions', search, section, statut, page],
    queryFn: () =>
      inscriptionsApi.getAll({
        search:   search   || undefined,
        section:  section  || undefined,
        statut:   statut   || undefined,
        page:     page + 1,
        per_page: 20,
      }),
  })

  const inscriptions = data?.data?.data?.data || []
  const total        = data?.data?.data?.total || 0

  const handleExportPdf = async (id, nom) => {
    try {
      const response = await inscriptionsApi.exportPdf(id)
      const url = URL.createObjectURL(response.data)
      const a = document.createElement('a')
      a.href = url
      a.download = `fiche-${nom}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      toast.error('Erreur lors de la génération du PDF.')
    }
  }

  return (
    <Box>
      <PageTitle
        title="Inscriptions"
        subtitle="Gérez les dossiers d'inscription pour l'année scolaire en cours."
        action={
          <Button
            variant="outlined"
            startIcon={<FileDown size={15} />}
            onClick={async () => {
              try {
                const res = await inscriptionsApi.exportExcel()
                const url = URL.createObjectURL(res.data)
                const a = document.createElement('a')
                a.href = url
                a.download = 'inscriptions.csv'
                a.click()
              } catch {
                toast.error('Erreur export')
              }
            }}
            sx={{ borderColor: '#1B7A3E', color: '#1B7A3E' }}
          >
            Exporter CSV
          </Button>
        }
      />

      <Paper sx={{ overflow: 'hidden' }}>
        {/* FILTRES */}
        <Box sx={{ display: 'flex', gap: 2, p: 2, borderBottom: '1px solid #dae8df', flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Nom, prénom, parent..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0) }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={15} color="#6b7c70" />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1, minWidth: 200 }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <Select
              value={section}
              onChange={(e) => { setSection(e.target.value); setPage(0) }}
              displayEmpty
              sx={{ fontSize: 13 }}
            >
              {SECTIONS.map((s) => (
                <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <Select
              value={statut}
              onChange={(e) => { setStatut(e.target.value); setPage(0) }}
              displayEmpty
              sx={{ fontSize: 13 }}
            >
              <MenuItem value="">Tous statuts</MenuItem>
              <MenuItem value="en_attente">En attente</MenuItem>
              <MenuItem value="valide">Validé</MenuItem>
              <MenuItem value="refuse">Refusé</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {isLoading ? (
          <Box sx={{ p: 2 }}><TableSkeleton rows={8} cols={6} /></Box>
        ) : inscriptions.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="Aucune inscription"
            description="Les dossiers d'inscription soumis apparaîtront ici."
          />
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow sx={{ background: '#f9fbf9' }}>
                  <TableCell>Enfant</TableCell>
                  <TableCell>Section</TableCell>
                  <TableCell>Parent / Tuteur</TableCell>
                  <TableCell>Téléphone</TableCell>
                  <TableCell>Statut dossier</TableCell>
                  <TableCell>Paiement</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inscriptions.map((insc) => (
                  <TableRow key={insc.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{
                          width: 32, height: 32, borderRadius: '50%',
                          background: '#eaf4ee',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700, fontSize: 13, color: '#1B7A3E', flexShrink: 0,
                        }}>
                          {insc.nom_enfant?.[0]?.toUpperCase()}
                        </Box>
                        <Box>
                          <Typography sx={{ fontWeight: 700, fontSize: 13, color: '#0c1a10' }}>
                            {insc.nom_enfant} {insc.prenoms_enfant}
                          </Typography>
                          <Typography sx={{ fontSize: 11, color: '#6b7c70' }}>
                            {insc.sexe === 'M' ? 'Garçon' : 'Fille'}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={insc.section?.toUpperCase()}
                        size="small"
                        sx={{ fontWeight: 700, fontSize: 10, background: '#eaf4ee', color: '#1B7A3E' }}
                      />
                    </TableCell>

                    <TableCell sx={{ fontSize: 12.5, color: '#2d3a30' }}>
                      {insc.nom_pere || insc.nom_mere || insc.nom_tuteur || '—'}
                    </TableCell>

                    <TableCell sx={{ fontSize: 12.5, color: '#6b7c70' }}>
                      {insc.telephone_pere || insc.telephone_mere || '—'}
                    </TableCell>

                    <TableCell>
                      <StatusBadge status={insc.statut || 'en_attente'} />
                    </TableCell>

                    <TableCell>
                      <StatusBadge status={insc.statut_paiement || 'non_paye'} />
                    </TableCell>

                    <TableCell sx={{ fontSize: 12, color: '#6b7c70', whiteSpace: 'nowrap' }}>
                      {insc.created_at
                        ? format(new Date(insc.created_at), 'dd MMM yyyy', { locale: fr })
                        : '—'}
                    </TableCell>

                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                        <Tooltip title="Voir le dossier">
                          <IconButton
                            size="small"
                            // ✅ Route détail correcte : /admin/inscriptions/:id
                            onClick={() => navigate(`/admin/inscriptions/${insc.id}`)}
                            sx={{ color: '#1B7A3E' }}
                          >
                            <Eye size={16} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Télécharger PDF">
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleExportPdf(
                                insc.id,
                                `${insc.nom_enfant}-${insc.prenoms_enfant}`
                              )
                            }
                            sx={{ color: '#6b7c70' }}
                          >
                            <Download size={16} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <TablePagination
              component="div"
              count={total}
              page={page}
              rowsPerPage={20}
              rowsPerPageOptions={[20]}
              onPageChange={(_, newPage) => setPage(newPage)}
              labelDisplayedRows={({ from, to, count }) => `${from}–${to} sur ${count}`}
            />
          </>
        )}
      </Paper>
    </Box>
  )
}