import { Link } from 'react-router-dom'
import { Box, Container, Grid, Typography, Divider } from '@mui/material'
import { MapPin, Phone, Mail, Clock, BookOpen, ArrowUpRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { parametresApi } from '@/api/services'

const LINKS = {
  etablissement: [
    { label: 'Présentation', href: '/presentation' },
    { label: 'Mot du Directeur', href: '/mot-du-directeur' },
    { label: 'Flash Infos', href: '/flash-infos' },
    { label: 'Calendrier scolaire', href: '/calendrier' },
  ],
  sections: [
    { label: 'Crèche', href: '/sections/creche' },
    { label: 'Petite Section', href: '/sections/petite-section' },
    { label: 'Moyenne Section', href: '/sections/moyenne-section' },
    { label: 'Grande Section', href: '/sections/grande-section' },
  ],
}

export default function PublicFooter() {
  const { data: parametresData } = useQuery({
    queryKey: ['parametres-public'],
    queryFn:  () => parametresApi.getAll(),
    staleTime: 5 * 60 * 1000,
  })

  const params = parametresData?.data?.data || {}

  const isOpen      = params.inscriptions_ouvertes !== 'false'
  const annee       = params.annee_scolaire_courante || '2025-2026'
  const adresse     = params.adresse   || "Complexe Socio-Éducatif d'Issia, Haut-Sassandra"
  const telephone   = params.telephone || '07 07 18 65 59 / 05 06 48 22 01'
  const email       = params.email     || 'direction@cppe-issia.ci'
  const horaires    = params.horaires  || 'Lun–Ven  ·  7h30 – 16h30'
  const montant     = params.scolarite_montant
    ? Number(params.scolarite_montant).toLocaleString('fr-FR')
    : '50 000'

  // Extrait la 1ère année de "2025-2026" → 2025
  // Les versements 2 et 3 tombent en Novembre et Décembre de la 1ère année
  const anneeVersement = annee.includes('-') ? annee.split('-')[0].trim() : annee

  return (
    <Box component="footer" sx={{ background: '#0c1a10', color: 'rgba(255,255,255,0.6)', mt: 0 }}>

      {/* BANDE SUPÉRIEURE — visible seulement si inscriptions ouvertes */}
      {isOpen && (
        <Box sx={{ background: '#1B7A3E', py: 2 }}>
          <Container maxWidth="lg">
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
              <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>
                Inscriptions {annee} ouvertes — {horaires}
              </Typography>
              <Link to="/inscription" style={{ textDecoration: 'none' }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    background: '#F5A623',
                    color: '#0f4a25',
                    px: 2,
                    py: 0.75,
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: 13,
                  }}
                >
                  Constituer un dossier <ArrowUpRight size={14} />
                </Box>
              </Link>
            </Box>
          </Container>
        </Box>
      )}

      {/* CORPS DU FOOTER */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>

          {/* BLOC 1 — IDENTITÉ + CONTACT */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  background: '#F5A623',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BookOpen size={20} color="#0f4a25" strokeWidth={2.5} />
              </Box>
              <Box>
                <Box sx={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>
                  CPPE <span style={{ color: '#F5A623' }}>ISSIA</span>
                </Box>
                <Box sx={{ fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                  Petite Enfance
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
                  <Icon size={15} color="#F5A623" style={{ flexShrink: 0, marginTop: 2 }} />
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
                    '&:hover': { color: '#F5A623' },
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
                    '&:hover': { color: '#F5A623' },
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
                p: 2,
                fontSize: 13,
                lineHeight: 2.2,
              }}
            >
              {[
                ['Montant annuel', `${montant} FCFA`],
                ['1er versement', "À l'inscription"],
                ['2e versement', `Fin Novembre ${anneeVersement}`],
                ['3e versement', `Fin Décembre ${anneeVersement}`],
                ['Cantine', 'En option'],
              ].map(([label, value]) => (
                <Box
                  key={label}
                  sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', py: 0.3 }}
                >
                  <span style={{ color: 'rgba(255,255,255,0.45)' }}>{label}</span>
                  <span style={{ color: '#F5A623', fontWeight: 600 }}>{value}</span>
                </Box>
              ))}
            </Box>
          </Grid>

        </Grid>
      </Container>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />

      {/* BAS DU FOOTER */}
      <Box sx={{ py: 2 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>
              © {new Date().getFullYear()} CPPE ISSIA — Ministère de la Femme, de la Famille et de l'Enfant — République de Côte d'Ivoire
            </Typography>
            <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>
              Portail numérique officiel · v1.0
            </Typography>
          </Box>
        </Container>
      </Box>

    </Box>
  )
}