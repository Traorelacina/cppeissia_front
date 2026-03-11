import { Link } from 'react-router-dom'
import { Box, Container, Grid, Typography, Divider } from '@mui/material'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { parametresApi, actualitesApi } from '@/api/services'
import { FlashTicker } from '@/pages/public/Home'
import logo from '@/assets/logo.jpeg'

const ORANGE = '#FF7F27'

const LINKS = {
  etablissement: [
    { label: 'Présentation',       href: '/presentation' },
    { label: 'Mot du Directeur',   href: '/mot-du-directeur' },
    { label: 'Flash Infos',        href: '/flash-infos' },
    { label: 'Calendrier scolaire', href: '/calendrier' },
  ],
  sections: [
    { label: 'Crèche',          href: '/sections/creche' },
    { label: 'Petite Section',  href: '/sections/petite-section' },
    { label: 'Moyenne Section', href: '/sections/moyenne-section' },
    { label: 'Grande Section',  href: '/sections/grande-section' },
  ],
}

export default function PublicFooter() {
  const { data: parametresData } = useQuery({
    queryKey: ['parametres-public'],
    queryFn:  () => parametresApi.getAll(),
    staleTime: 5 * 60 * 1000,
  })

  // Même queryKey que Home → cache partagé, pas de double requête réseau
  const { data: flashData } = useQuery({
    queryKey: ['flash-infos-ticker'],
    queryFn:  () => actualitesApi.getAll({ type: 'flash', statut: 'publie', per_page: 20 }),
  })

  const params     = parametresData?.data?.data || {}
  const flashItems = flashData?.data?.data?.data || []

  const isOpen    = params.inscriptions_ouvertes !== 'false'
  const annee     = params.annee_scolaire_courante || '2025-2026'
  const adresse   = params.adresse   || "Complexe Socio-Éducatif d'Issia, Haut-Sassandra"
  const telephone = params.telephone || '07 07 18 65 59 / 05 06 48 22 01'
  const email     = params.email     || 'direction@cppe-issia.ci'
  const horaires  = params.horaires  || 'Lun–Ven  ·  7h30 – 16h30'
  const montant   = params.scolarite_montant
    ? Number(params.scolarite_montant).toLocaleString('fr-FR')
    : '50 000'

  const anneeVersement = annee.includes('-') ? annee.split('-')[0].trim() : annee

  return (
    <Box component="footer" sx={{ background: '#0c1a10', color: 'rgba(255,255,255,0.6)', mt: 0 }}>

      {/* ── BANDE TICKER DÉFILANTE ── */}
      <FlashTicker params={params} flashItems={flashItems} />

      {/* ── CORPS DU FOOTER ── */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>

          {/* BLOC 1 — IDENTITÉ + CONTACT */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  border: '2px solid rgba(255,127,39,0.3)',
                }}
              >
                <img
                  src={logo}
                  alt="Logo CPPE Issia"
                  style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                />
              </Box>
              <Box>
                <Box sx={{ color: '#fff', fontWeight: 800, fontSize: 18, lineHeight: 1.2 }}>
                  CPPE <span style={{ color: ORANGE }}>ISSIA</span>
                </Box>
                <Box sx={{ fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>
                  Centre de Protection
                </Box>
                <Box sx={{ fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>
                  de la Petite Enfance
                </Box>
              </Box>
            </Box>

            <Typography sx={{ fontSize: 13, lineHeight: 1.8, mb: 3, maxWidth: 300 }}>
              Centre de Protection de la Petite Enfance d'Issia, sous la tutelle du Ministère de la Femme, de la Famille et de l'Enfant.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {[
                { icon: MapPin, text: adresse },
                { icon: Phone,  text: telephone },
                { icon: Mail,   text: email },
                { icon: Clock,  text: horaires },
              ].map(({ icon: Icon, text }) => (
                <Box key={text} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <Icon size={15} color={ORANGE} style={{ flexShrink: 0, marginTop: 2 }} />
                  <Typography sx={{ fontSize: 12.5 }}>{text}</Typography>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* BLOC 2 — LIENS ÉTABLISSEMENT */}
          <Grid item xs={6} md={2}>
            <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '1.5px', mb: 2 }}>
              Établissement
            </Typography>
            {LINKS.etablissement.map((l) => (
              <Link key={l.href} to={l.href} style={{ textDecoration: 'none' }}>
                <Typography
                  sx={{
                    fontSize: 13,
                    mb: 1,
                    color: 'rgba(255,255,255,0.5)',
                    transition: 'color 0.2s',
                    '&:hover': { color: ORANGE },
                  }}
                >
                  {l.label}
                </Typography>
              </Link>
            ))}
          </Grid>

          {/* BLOC 3 — LIENS SECTIONS */}
          <Grid item xs={6} md={2}>
            <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '1.5px', mb: 2 }}>
              Nos Sections
            </Typography>
            {LINKS.sections.map((l) => (
              <Link key={l.href} to={l.href} style={{ textDecoration: 'none' }}>
                <Typography
                  sx={{
                    fontSize: 13,
                    mb: 1,
                    color: 'rgba(255,255,255,0.5)',
                    transition: 'color 0.2s',
                    '&:hover': { color: ORANGE },
                  }}
                >
                  {l.label}
                </Typography>
              </Link>
            ))}
          </Grid>

       {/* BLOC 4 — SCOLARITÉ */}
<Grid item xs={12} md={4}>
  <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '1.5px', mb: 2 }}>
    Scolarité {annee}
  </Typography>
  <Box
    sx={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '12px',
      p: 2.5,
      fontSize: 13,
    }}
  >
    {[
      ['Montant annuel', `${montant} FCFA`],
      ['1er versement',  "À l'inscription"],
      ['2e versement',   `Fin Novembre ${anneeVersement}`],
      ['3e versement',   `Fin Décembre ${anneeVersement}`],
      ['Cantine',        'En option'],
    ].map(([label, value]) => (
      <Box
        key={label}
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', py: 2 }}
      >
        <span style={{ color: 'rgba(255,255,255,0.45)' }}>{label}</span>
        <span style={{ color: ORANGE, fontWeight: 600 }}>{value}</span>
      </Box>
    ))}
  </Box>
</Grid>

        </Grid>
      </Container>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />

      {/* ── BAS DU FOOTER ── */}
      <Box sx={{ py: 2 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                
                <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>
                  © {new Date().getFullYear()} CPPE ISSIA
                </Typography>
              </Box>
              <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>
                Ministère de la Femme, de la Famille et de l'Enfant
              </Typography>
            </Box>
            <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>
              République de Côte d'Ivoire
            </Typography>
          </Box>
        </Container>
      </Box>

    </Box>
  )
}