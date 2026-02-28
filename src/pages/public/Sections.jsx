import { Box, Container, Grid, Typography, Chip, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import { Baby, Smile, BookOpen, GraduationCap, Clock, Users, Star, Package, ChevronRight } from 'lucide-react'
import { useState } from 'react'

// ─────────────────────────────────────────────────────────────
// Données officielles issues du document CPPE Issia 2025-2026
// ─────────────────────────────────────────────────────────────
const SECTIONS_CONFIG = [
  {
    id: 'creche',
    href: '/sections/creche',
    titre: 'Crèche',
    sublabel: 'Section Spéciale',
    tranche: '1 an 6 mois — 2 ans 11 mois',
    icon: Baby,
    color: '#1B7A3E',
    darkColor: '#0a2e18',
    accent: '#eaf4ee',
    accentBorder: '#b2dfca',
    places: '25',
    description: 'La crèche accueille les tout-petits dans un environnement doux, sécurisant et stimulant. Chaque enfant est accompagné individuellement dans ses premières découvertes du monde.',
    objectifs: 'Éveil sensoriel, développement de la motricité et construction de la confiance en soi. Nos éducatrices spécialisées assurent un suivi personnalisé de chaque enfant dans un cadre bienveillant.',
    activites: ['Éveil sensoriel', 'Jeux libres', 'Musique & rythme', 'Motricité globale', 'Modelage', 'Histoires illustrées'],
    fournitures: ['01 Paquet de rame', '01 Paquet de papier hygiénique (Lotus ou Lisse)', '01 Paquet de savon Omo (500 g)', '01 Pot de javel (1 L)'],
    effectif: 'Maximum 25 enfants',
    encadrement: '1 éducatrice pour 6 enfants',
    stats: [{ label: "Tranche d'âge", value: '1½-3' }, { label: 'Encadrantes', value: '4' }, { label: 'Places', value: '25' }, { label: 'Ratio', value: '1/6' }],
  },
  {
    id: 'petite_section',
    href: '/sections/petite-section',
    titre: 'Petite Section',
    sublabel: 'PS',
    tranche: '3 ans — 3 ans 11 mois',
    icon: Smile,
    color: '#F5A623',
    darkColor: '#b87b0f',
    accent: '#fff8e1',
    accentBorder: '#ffe082',
    places: '40',
    description: "La Petite Section accompagne l'enfant dans sa première grande aventure scolaire. L'enfant développe son langage, sa socialisation et sa créativité.",
    objectifs: "La Petite Section vise l'épanouissement affectif, l'acquisition du langage oral et l'initiation aux activités graphiques et artistiques.",
    activites: ['Langage oral', 'Dessin & peinture', 'Puzzles', 'Chansons & comptines', 'Jeux de construction', 'Éveil à la nature'],
    fournitures: ['01 Paquet de rame', '01 Paquet de papier hygiénique (Lotus ou Lisse)', '01 Paquet de savon Omo (500 g)', '01 Pot de javel (1 L)'],
    effectif: 'Maximum 20 enfants par classe',
    encadrement: '1 enseignant + 1 aide maternelle',
    stats: [{ label: "Tranche d'âge", value: '3-4' }, { label: 'Classes', value: '2' }, { label: 'Places', value: '40' }, { label: 'Ratio', value: '1/20' }],
  },
  {
    id: 'moyenne_section',
    href: '/sections/moyenne-section',
    titre: 'Moyenne Section',
    sublabel: 'MS',
    tranche: '4 ans — 4 ans 11 mois',
    icon: BookOpen,
    color: '#1565c0',
    darkColor: '#0d47a1',
    accent: '#e3f2fd',
    accentBorder: '#90caf9',
    places: '50',
    description: "La Moyenne Section est une année charnière : l'enfant gagne en autonomie, enrichit son vocabulaire et s'initie aux premières notions de logique et de numération.",
    objectifs: "Développement de la motricité fine, du sens de l'observation et de la capacité à travailler en groupe. Accent sur la découverte de l'environnement.",
    activites: ['Pré-écriture', 'Numération (1-10)', 'Découverte du monde', 'Jeux de rôle', 'Poésie', 'Travaux manuels'],
    fournitures: ['01 Paquet de rame', '01 Paquet de papier hygiénique (Lotus ou Lisse)', '01 Paquet de savon Omo (500 g)', '01 Pot de javel (1 L)'],
    effectif: 'Maximum 25 enfants par classe',
    encadrement: '1 enseignant + 1 aide maternelle',
    stats: [{ label: "Tranche d'âge", value: '4-5' }, { label: 'Classes', value: '2' }, { label: 'Places', value: '50' }, { label: 'Ratio', value: '1/25' }],
  },
  {
    id: 'grande_section',
    href: '/sections/grande-section',
    titre: 'Grande Section',
    sublabel: 'GS',
    tranche: '5 ans — 5 ans 11 mois',
    icon: GraduationCap,
    color: '#c62828',
    darkColor: '#8b0000',
    accent: '#ffebee',
    accentBorder: '#ef9a9a',
    places: '50',
    description: "La Grande Section prépare les enfants à l'entrée au cours préparatoire. C'est l'aboutissement du parcours maternelle, riche en apprentissages fondamentaux.",
    objectifs: "Consolidation des acquisitions linguistiques, initiation à la lecture et l'écriture, développement logico-mathématique et renforcement de l'autonomie pour aborder le CP.",
    activites: ['Initiation à l\'écriture', 'Lecture (méthode syllabique)', 'Calcul mental', 'Géographie locale', 'Théâtre & expression', 'Éducation physique'],
    fournitures: ['01 Paquet de feutre gros bout (Reynold ou Bic)', '01 Paquet de papier hygiénique (Lotus ou Lisse)', '01 Sachet de savon Omo (500 g)'],
    effectif: 'Maximum 25 enfants par classe',
    encadrement: '1 enseignant + 1 aide maternelle',
    stats: [{ label: "Tranche d'âge", value: '5-6' }, { label: 'Classes', value: '2' }, { label: 'Places', value: '50' }, { label: 'Ratio', value: '1/25' }],
  },
]

// ─────────────────────────────────────────────────────────────
// Composant page Section individuelle (interne)
// ─────────────────────────────────────────────────────────────
function SectionPage({ config }) {
  const [showFournitures, setShowFournitures] = useState(false)
  const Icon = config.icon

  return (
    <Box>
      {/* ── HERO ── */}
      <Box sx={{
        background: `linear-gradient(135deg, ${config.darkColor}, ${config.color})`,
        py: { xs: 8, md: 12 }, px: 3,
        position: 'relative', overflow: 'hidden',
      }}>
        <Box sx={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />

        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
                <Box sx={{ width: 58, height: 58, background: 'rgba(255,255,255,0.18)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
                  <Icon size={28} color="#fff" />
                </Box>
                <Chip
                  label={config.tranche}
                  size="small"
                  sx={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 700, fontSize: 11, border: '1px solid rgba(255,255,255,0.35)' }}
                />
              </Box>

              <Typography variant="h1" sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: { xs: 36, md: 58 }, fontWeight: 700, color: '#fff', lineHeight: 1.05, mb: 1.5 }}>
                {config.titre}
                <Box component="span" sx={{ display: 'block', fontSize: { xs: 20, md: 28 }, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', fontWeight: 400, mt: 0.5 }}>
                  {config.sublabel}
                </Box>
              </Typography>

              <Typography sx={{ color: 'rgba(255,255,255,0.72)', fontSize: 14.5, lineHeight: 1.85, maxWidth: 520, borderLeft: '3px solid rgba(255,255,255,0.3)', pl: 2 }}>
                {config.description}
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Grid container spacing={1.5}>
                {config.stats.map(({ label, value }) => (
                  <Grid item xs={6} key={label}>
                    <Box sx={{ background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(8px)', borderRadius: '14px', p: 2, textAlign: 'center', border: '1px solid rgba(255,255,255,0.2)' }}>
                      <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 700, color: '#fff', lineHeight: 1 }}>{value}</Typography>
                      <Typography sx={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', mt: 0.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── PROGRAMME ── */}
      <Box sx={{ py: { xs: 6, md: 8 }, background: '#fff' }}>
        <Container maxWidth="lg">
          <Grid container spacing={5} alignItems="flex-start">

            <Grid item xs={12} md={7}>
              <Typography sx={{ fontSize: 10, fontWeight: 700, color: config.color, letterSpacing: '2.5px', textTransform: 'uppercase', mb: 0.75 }}>
                Programme pédagogique
              </Typography>
              <Typography variant="h2" sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: { xs: 26, md: 36 }, fontWeight: 700, color: '#0c1a10', mb: 2 }}>
                Objectifs de la {config.titre}
              </Typography>
              <Typography sx={{ color: '#6b7c70', fontSize: 14, lineHeight: 1.9, mb: 3 }}>
                {config.objectifs}
              </Typography>

              <Typography sx={{ fontWeight: 700, fontSize: 13.5, color: '#0c1a10', mb: 1.5 }}>Activités pratiquées</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 3 }}>
                {config.activites.map((a) => (
                  <Chip key={a} label={a} size="small"
                    sx={{ background: config.accent, color: config.color, fontWeight: 600, fontSize: 11.5, border: `1px solid ${config.accentBorder}` }}
                  />
                ))}
              </Box>

              <Box sx={{ background: '#f4fbf7', border: `1px solid ${config.accentBorder}`, borderLeft: `3px solid ${config.color}`, borderRadius: '10px', p: 2.5 }}>
                <Box
                  onClick={() => setShowFournitures(!showFournitures)}
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', userSelect: 'none' }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Package size={15} color={config.color} />
                    <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: config.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Liste de fournitures
                    </Typography>
                    <Chip label="Officielle" size="small" sx={{ fontSize: 9, height: 18, background: config.accent, color: config.color, border: `1px solid ${config.accentBorder}` }} />
                  </Box>
                  <ChevronRight size={14} color={config.color} style={{ transform: showFournitures ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                </Box>
                {showFournitures && (
                  <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                    {config.fournitures.map((f) => (
                      <Box key={f} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 5, height: 5, borderRadius: '50%', background: config.color, flexShrink: 0 }} />
                        <Typography sx={{ fontSize: 12.5, color: '#2d3a30' }}>{f}</Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} md={5}>
              <Box sx={{ background: '#f4f8f5', borderRadius: '20px', p: 3, border: `1px solid ${config.accentBorder}` }}>
                {[
                  { icon: Clock, label: "Horaires d'accueil",  value: '7h30 — 16h30' },
                  { icon: Users, label: 'Effectif par classe',  value: config.effectif },
                  { icon: Star,  label: 'Encadrement',          value: config.encadrement },
                ].map(({ icon: I, label, value }) => (
                  <Box key={label} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mb: 2.5 }}>
                    <Box sx={{ width: 36, height: 36, borderRadius: '10px', background: config.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1px solid ${config.accentBorder}` }}>
                      <I size={16} color={config.color} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: 10, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px' }}>{label}</Typography>
                      <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: '#0c1a10', mt: 0.25 }}>{value}</Typography>
                    </Box>
                  </Box>
                ))}

                <Box sx={{ mt: 2, p: 2, background: config.accent, borderRadius: '12px', border: `1px solid ${config.accentBorder}` }}>
                  <Typography sx={{ fontSize: 10, fontWeight: 700, color: config.color, textTransform: 'uppercase', letterSpacing: '0.8px', mb: 1 }}>Scolarité 2025-2026</Typography>
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#0c1a10' }}>
                    50 000 F + 6 000 F{' '}
                    <Typography component="span" sx={{ fontSize: 10, color: '#6b7c70', fontWeight: 400 }}>(fêtes & photos)</Typography>
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: '#6b7c70', mt: 0.5 }}>Cantine facultative : 8 000 F/mois</Typography>
                  <Typography sx={{ fontSize: 10.5, color: config.color, mt: 0.5, fontStyle: 'italic' }}>Goûter + tenue de sport inclus</Typography>
                </Box>

                <Box sx={{ mt: 2.5, pt: 2, borderTop: `1px solid ${config.accentBorder}`, textAlign: 'center' }}>
                  <Typography sx={{ fontSize: 12.5, color: '#6b7c70', mb: 1.5 }}>Inscriptions ouvertes · dès le 1er Sept. 2025</Typography>
                  <Button
                    component={Link} to="/inscription" variant="contained" fullWidth
                    sx={{ background: config.color, py: 1.2, borderRadius: '10px', fontWeight: 700, '&:hover': { background: config.darkColor, transform: 'translateY(-1px)' }, transition: 'all 0.2s' }}
                  >
                    Inscrire mon enfant
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  )
}

// ─────────────────────────────────────────────────────────────
// Exports nommés — un par section, attendus par App.tsx
// import { Creche, PetiteSection, MoyenneSection, GrandeSection }
//   from '@/pages/public/Sections'
// ─────────────────────────────────────────────────────────────
export function Creche()         { return <SectionPage config={SECTIONS_CONFIG[0]} /> }
export function PetiteSection()  { return <SectionPage config={SECTIONS_CONFIG[1]} /> }
export function MoyenneSection() { return <SectionPage config={SECTIONS_CONFIG[2]} /> }
export function GrandeSection()  { return <SectionPage config={SECTIONS_CONFIG[3]} /> }