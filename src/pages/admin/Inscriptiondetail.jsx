import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Box,
  Paper,
  Grid,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Alert,
  TextField,
} from '@mui/material'
import { ArrowLeft, Download, User, Phone, MapPin, Calendar, BookOpen } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { inscriptionsApi } from '@/api/services'
import { PageTitle, StatusBadge, LoadingSpinner } from '@/components/common'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import toast from 'react-hot-toast'

function InfoRow({ label, value }) {
  return (
    <Box sx={{ display: 'flex', gap: 1, py: 1.25, borderBottom: '1px solid #f3f7f4' }}>
      <Typography sx={{ fontSize: 12, color: '#6b7c70', minWidth: 140 }}>{label}</Typography>
      <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#0c1a10', flex: 1 }}>{value || '—'}</Typography>
    </Box>
  )
}

export default function InscriptionDetail() {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const [newStatut, setNewStatut] = useState('')
  const [newPaiement, setNewPaiement] = useState('')
  const [montantVerse, setMontantVerse] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['inscription', id],
    queryFn: () => inscriptionsApi.getOne(id),
    onSuccess: (data) => {
      setNewStatut(data.data.data.statut || 'en_attente')
      setNewPaiement(data.data.data.statut_paiement || 'non_paye')
      setMontantVerse(data.data.data.montant_verse || '')
    },
  })

  const mutation = useMutation({
    mutationFn: () => inscriptionsApi.updateStatut(id, { statut: newStatut, statut_paiement: newPaiement, montant_verse: montantVerse }),
    onSuccess: () => {
      queryClient.invalidateQueries(['inscription', id])
      queryClient.invalidateQueries(['inscriptions'])
      toast.success('Dossier mis à jour.')
    },
    onError: () => toast.error('Erreur lors de la mise à jour.'),
  })

  const handleExportPdf = async () => {
    try {
      const response = await inscriptionsApi.exportPdf(id)
      const url = URL.createObjectURL(response.data)
      const a = document.createElement('a')
      a.href = url
      a.download = `fiche-${insc?.nom_enfant}-${insc?.prenoms_enfant}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      toast.error('Erreur lors de la génération du PDF.')
    }
  }

  if (isLoading) return <LoadingSpinner />

  const insc = data?.data?.data

  return (
    <Box>
      <Box sx={{ mb: 1 }}>
        <Button component={Link} to="/admin/inscriptions" startIcon={<ArrowLeft size={15} />} sx={{ color: '#6b7c70', fontSize: 12 }}>
          Retour à la liste
        </Button>
      </Box>

      <PageTitle
        title={`${insc?.nom_enfant} ${insc?.prenoms_enfant}`}
        subtitle={`Dossier d'inscription · ${insc?.annee_scolaire} · ${insc?.section?.toUpperCase()}`}
        action={
          <Button
            variant="outlined"
            startIcon={<Download size={15} />}
            onClick={handleExportPdf}
            sx={{ borderColor: '#1B7A3E', color: '#1B7A3E' }}
          >
            Télécharger PDF
          </Button>
        }
      />

      <Grid container spacing={2.5}>
        {/* INFOS ENFANT */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 2 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 2.5, pb: 1.5, borderBottom: '1px solid #dae8df', display: 'flex', alignItems: 'center', gap: 1 }}>
              <BookOpen size={16} color="#1B7A3E" /> Informations de l'enfant
            </Typography>
            <InfoRow label="Nom & prénoms" value={`${insc?.nom_enfant} ${insc?.prenoms_enfant}`} />
            <InfoRow label="Date de naissance" value={insc?.date_naissance ? format(new Date(insc.date_naissance), 'dd MMMM yyyy', { locale: fr }) : '—'} />
            <InfoRow label="Lieu de naissance" value={insc?.lieu_naissance} />
            <InfoRow label="Sexe" value={insc?.sexe === 'M' ? 'Masculin' : 'Féminin'} />
            <InfoRow label="Nationalité" value={insc?.nationalite} />
            <InfoRow label="Section demandée" value={insc?.section?.toUpperCase()} />
            <InfoRow label="Année scolaire" value={insc?.annee_scolaire} />
            <InfoRow label="Cantine" value={insc?.cantine ? 'Oui' : 'Non'} />
            {insc?.ancienne_ecole && <InfoRow label="Ancienne école" value={insc.ancienne_ecole} />}
            {insc?.observations && <InfoRow label="Observations" value={insc.observations} />}
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 2.5, pb: 1.5, borderBottom: '1px solid #dae8df', display: 'flex', alignItems: 'center', gap: 1 }}>
              <User size={16} color="#1B7A3E" /> Parents / Tuteur
            </Typography>
            {insc?.nom_pere && (
              <>
                <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#F5A623', textTransform: 'uppercase', letterSpacing: '1px', mb: 1 }}>Père</Typography>
                <InfoRow label="Nom" value={insc.nom_pere} />
                <InfoRow label="Profession" value={insc.profession_pere} />
                <InfoRow label="Téléphone" value={insc.telephone_pere} />
              </>
            )}
            {insc?.nom_mere && (
              <>
                <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#F5A623', textTransform: 'uppercase', letterSpacing: '1px', mt: 2, mb: 1 }}>Mère</Typography>
                <InfoRow label="Nom" value={insc.nom_mere} />
                <InfoRow label="Profession" value={insc.profession_mere} />
                <InfoRow label="Téléphone" value={insc.telephone_mere} />
              </>
            )}
            {insc?.nom_tuteur && (
              <>
                <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#6b7c70', textTransform: 'uppercase', letterSpacing: '1px', mt: 2, mb: 1 }}>Tuteur</Typography>
                <InfoRow label="Nom" value={insc.nom_tuteur} />
                <InfoRow label="Téléphone" value={insc.telephone_tuteur} />
              </>
            )}
            <InfoRow label="Adresse domicile" value={insc?.adresse_domicile} />
          </Paper>
        </Grid>

        {/* STATUT & PAIEMENT */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 2 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 2.5, pb: 1.5, borderBottom: '1px solid #dae8df' }}>
              Statut du dossier
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography sx={{ fontSize: 12, color: '#6b7c70', mb: 0.5 }}>Statut actuel</Typography>
              <StatusBadge status={insc?.statut || 'en_attente'} />
            </Box>

            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel>Nouveau statut</InputLabel>
              <Select label="Nouveau statut" value={newStatut} onChange={(e) => setNewStatut(e.target.value)}>
                <MenuItem value="en_attente">En attente</MenuItem>
                <MenuItem value="valide">Valider</MenuItem>
                <MenuItem value="refuse">Refuser</MenuItem>
              </Select>
            </FormControl>

            <Divider sx={{ my: 2 }} />

            <Typography sx={{ fontSize: 12, color: '#6b7c70', mb: 0.5 }}>Paiement actuel</Typography>
            <StatusBadge status={insc?.statut_paiement || 'non_paye'} />

            <FormControl fullWidth size="small" sx={{ mt: 2, mb: 2 }}>
              <InputLabel>Statut paiement</InputLabel>
              <Select label="Statut paiement" value={newPaiement} onChange={(e) => setNewPaiement(e.target.value)}>
                <MenuItem value="non_paye">Non payé</MenuItem>
                <MenuItem value="partiel">Partiel</MenuItem>
                <MenuItem value="complet">Complet</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Montant versé (FCFA)"
              type="number"
              fullWidth
              size="small"
              value={montantVerse}
              onChange={(e) => setMontantVerse(e.target.value)}
              sx={{ mb: 2.5 }}
            />

            <Box sx={{ background: '#f9fbf9', borderRadius: '10px', p: 2, mb: 2.5, fontSize: 12 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <span style={{ color: '#6b7c70' }}>Scolarité totale</span>
                <span style={{ fontWeight: 700 }}>50 000 FCFA</span>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <span style={{ color: '#6b7c70' }}>Versé</span>
                <span style={{ fontWeight: 700, color: '#15803d' }}>{montantVerse || insc?.montant_verse || 0} FCFA</span>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7c70' }}>Restant</span>
                <span style={{ fontWeight: 700, color: '#dc2626' }}>
                  {50000 - (parseInt(montantVerse || insc?.montant_verse) || 0)} FCFA
                </span>
              </Box>
            </Box>

            <Button
              variant="contained"
              fullWidth
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending}
              sx={{ background: '#1B7A3E', '&:hover': { background: '#0f4a25' } }}
            >
              Enregistrer les modifications
            </Button>
          </Paper>

          <Paper sx={{ p: 2.5 }}>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#6b7c70', textTransform: 'uppercase', letterSpacing: '1px', mb: 1 }}>
              Métadonnées
            </Typography>
            <InfoRow label="ID dossier" value={`#${insc?.id}`} />
            <InfoRow label="Soumis le" value={insc?.created_at ? format(new Date(insc.created_at), 'dd/MM/yyyy HH:mm') : '—'} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}