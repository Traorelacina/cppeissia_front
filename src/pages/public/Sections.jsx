import { useState } from 'react'
import { Box, Container, Grid, Typography, Chip } from '@mui/material'
import { Baby, Smile, BookOpen, GraduationCap, Clock, Users, Star, Package, ChevronRight } from 'lucide-react'

// COULEUR ORANGE DU MINISTÈRE
const ORANGE = '#FF7F27'

// ─────────────────────────────────────────────────────────────
// Données officielles CPPE Issia 2025-2026
// ─────────────────────────────────────────────────────────────
const SECTIONS_CONFIG = [
  {
    id: 'creche',
    href: '/sections/creche',
    titre: 'Crèche',
    sublabel: 'Section Spéciale',
    tranche: '1 an 6 mois — 2 ans 11 mois',
    icon: Baby,
    // ✅ Vert aligné sur Contact : GREEN_MAIN '#1B7A3E' / GREEN_DARK '#0f4a25'
    color: '#1B7A3E',
    darkColor: '#0f4a25',
    accent: '#eaf4ee',
    accentBorder: '#b2dfca',
    effectif: 'Maximum 25 enfants',
    encadrement: '1 éducatrice pour 6 enfants',
    description: 'La crèche accueille les tout-petits dans un environnement doux, sécurisant et stimulant. Chaque enfant est accompagné individuellement dans ses premières découvertes du monde.',
    objectifs: 'Éveil sensoriel, développement de la motricité et construction de la confiance en soi. Nos éducatrices spécialisées assurent un suivi personnalisé de chaque enfant dans un cadre bienveillant.',
    activites: ['Éveil sensoriel', 'Jeux libres', 'Musique & rythme', 'Motricité globale', 'Modelage', 'Histoires illustrées'],
    fournitures: ['01 Paquet de rame', '01 Paquet de papier hygiénique (Lotus ou Lisse)', '01 Paquet de savon Omo (500 g)', '01 Pot de javel (1 L)'],
  },
  {
    id: 'petite_section',
    href: '/sections/petite-section',
    titre: 'Petite Section',
    sublabel: 'PS',
    tranche: '3 ans — 3 ans 11 mois',
    icon: Smile,
    color: ORANGE,
    darkColor: '#cc6400',
    accent: '#fff8e1',
    accentBorder: '#ffe082',
    effectif: 'Maximum 20 enfants par classe',
    encadrement: '1 enseignant + 1 aide maternelle',
    description: "La Petite Section accompagne l'enfant dans sa première grande aventure scolaire. L'enfant développe son langage, sa socialisation et sa créativité.",
    objectifs: "La Petite Section vise l'épanouissement affectif, l'acquisition du langage oral et l'initiation aux activités graphiques et artistiques.",
    activites: ['Langage oral', 'Dessin & peinture', 'Puzzles', 'Chansons & comptines', 'Jeux de construction', 'Éveil à la nature'],
    fournitures: ['01 Paquet de rame', '01 Paquet de papier hygiénique (Lotus ou Lisse)', '01 Paquet de savon Omo (500 g)', '01 Pot de javel (1 L)'],
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
    effectif: 'Maximum 25 enfants par classe',
    encadrement: '1 enseignant + 1 aide maternelle',
    description: "La Moyenne Section est une année charnière : l'enfant gagne en autonomie, enrichit son vocabulaire et s'initie aux premières notions de logique et de numération.",
    objectifs: "Développement de la motricité fine, du sens de l'observation et de la capacité à travailler en groupe. Accent sur la découverte de l'environnement.",
    activites: ['Pré-écriture', 'Numération (1-10)', 'Découverte du monde', 'Jeux de rôle', 'Poésie', 'Travaux manuels'],
    fournitures: ['01 Paquet de rame', '01 Paquet de papier hygiénique (Lotus ou Lisse)', '01 Paquet de savon Omo (500 g)', '01 Pot de javel (1 L)'],
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
    effectif: 'Maximum 25 enfants par classe',
    encadrement: '1 enseignant + 1 aide maternelle',
    description: "La Grande Section prépare les enfants à l'entrée au cours préparatoire. C'est l'aboutissement du parcours maternelle, riche en apprentissages fondamentaux.",
    objectifs: "Consolidation des acquisitions linguistiques, initiation à la lecture et l'écriture, développement logico-mathématique et renforcement de l'autonomie pour aborder le CP.",
    activites: ["Initiation à l'écriture", 'Lecture (méthode syllabique)', 'Calcul mental', 'Géographie locale', 'Théâtre & expression', 'Éducation physique'],
    fournitures: ['01 Paquet de feutre gros bout (Reynold ou Bic)', '01 Paquet de papier hygiénique (Lotus ou Lisse)', '01 Sachet de savon Omo (500 g)'],
  },
]

// ─────────────────────────────────────────────────────────────
// Composant page Section individuelle
// ─────────────────────────────────────────────────────────────
function SectionPage({ config }) {
  const [showFournitures, setShowFournitures] = useState(true)
  const Icon = config.icon

  return (
    <Box>
      {/* ══════════ HERO ══════════ */}
      <Box sx={{
        background: `linear-gradient(135deg, ${config.darkColor}, ${config.color})`,
        py: { xs: 9, md: 13 },
        px: 3,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Grille de fond subtile */}
        <Box sx={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)',
          backgroundSize: '48px 48px',
          pointerEvents: 'none',
        }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={5} alignItems="center">

            {/* ── GAUCHE — Titre & description ── */}
            <Grid item xs={12} md={7}>
              {/* Icône + badge tranche d'âge */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 3.5, flexWrap: 'wrap' }}>
                <Box sx={{
                  width: 68, height: 68,
                  background: 'rgba(255,255,255,0.18)',
                  borderRadius: '18px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backdropFilter: 'blur(4px)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  flexShrink: 0,
                }}>
                  <Icon size={34} color="#fff" />
                </Box>
                <Box sx={{
                  px: 2.5, py: 1.25,
                  background: 'rgba(255,255,255,0.16)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '30px',
                  backdropFilter: 'blur(4px)',
                }}>
                  <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '1.5px', mb: 0.3 }}>
                    Tranche d'âge
                  </Typography>
                  <Typography sx={{ fontSize: 17, fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>
                    {config.tranche}
                  </Typography>
                </Box>
              </Box>

              {/* Titre principal */}
              <Typography variant="h1" sx={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: { xs: 46, md: 70 },
                fontWeight: 700,
                color: '#fff',
                lineHeight: 1.0,
                mb: 2.25,
              }}>
                {config.titre}
                <Box component="span" sx={{
                  display: 'block',
                  fontSize: { xs: 26, md: 36 },
                  color: 'rgba(255,255,255,0.45)',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  mt: 0.75,
                }}>
                  {config.sublabel}
                </Box>
              </Typography>

              {/* Description */}
              <Typography sx={{
                color: 'rgba(255,255,255,0.78)',
                fontSize: { xs: 16.5, md: 18.5 },
                lineHeight: 1.95,
                maxWidth: 560,
                borderLeft: '3px solid rgba(255,255,255,0.3)',
                pl: 2.5,
              }}>
                {config.description}
              </Typography>
            </Grid>

            {/* ── DROITE — Carte infos (sans Encadrantes / Places / Ratio) ── */}
            <Grid item xs={12} md={5}>
              <Box sx={{
                background: 'rgba(255,255,255,0.11)',
                backdropFilter: 'blur(12px)',
                borderRadius: '22px',
                p: { xs: 3, md: 3.5 },
                border: '1px solid rgba(255,255,255,0.2)',
                display: 'flex',
                flexDirection: 'column',
                gap: 2.75,
              }}>
                {[
                  { icon: Users, label: 'Effectif',           value: config.effectif },
                  { icon: Star,  label: 'Encadrement',         value: config.encadrement },
                  { icon: Clock, label: "Horaires d'accueil",  value: '7h30 — 16h30' },
                ].map(({ icon: I, label, value }) => (
                  <Box key={label} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <Box sx={{
                      width: 44, height: 44,
                      borderRadius: '13px',
                      background: 'rgba(255,255,255,0.18)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <I size={20} color="#fff" />
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: 11.5, color: 'rgba(255,255,255,0.52)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {label}
                      </Typography>
                      <Typography sx={{ fontSize: 17, fontWeight: 700, color: '#fff', mt: 0.3, lineHeight: 1.35 }}>
                        {value}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Grid>

          </Grid>
        </Container>
      </Box>

      {/* ══════════ PROGRAMME ══════════ */}
      <Box sx={{ py: { xs: 8, md: 11 }, background: '#fff' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="flex-start">

            {/* ── GAUCHE — Objectifs + Activités + Fournitures ── */}
            <Grid item xs={12} md={7}>

              {/* Label supérieur */}
              <Typography sx={{
                fontSize: 12, fontWeight: 700, color: config.color,
                letterSpacing: '2.5px', textTransform: 'uppercase', mb: 1,
              }}>
                Programme pédagogique
              </Typography>

              {/* Objectifs */}
              <Typography variant="h2" sx={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: { xs: 34, md: 48 },
                fontWeight: 700, color: '#0c1a10', mb: 2.5, lineHeight: 1.1,
              }}>
                Objectifs de la {config.titre}
              </Typography>
              <Typography sx={{
                color: '#5a6e62',
                fontSize: { xs: 16, md: 17.5 },
                lineHeight: 1.95,
                mb: 5,
              }}>
                {config.objectifs}
              </Typography>

              {/* Activités */}
              <Typography variant="h2" sx={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: { xs: 32, md: 44 },
                fontWeight: 700, color: '#0c1a10', mb: 2.5, lineHeight: 1.1,
              }}>
                Activités pratiquées
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25, mb: 5 }}>
                {config.activites.map((a) => (
                  <Chip key={a} label={a}
                    sx={{
                      background: config.accent,
                      color: config.color,
                      fontWeight: 700,
                      fontSize: 14.5,
                      border: `1px solid ${config.accentBorder}`,
                      height: 38,
                      px: 0.5,
                    }}
                  />
                ))}
              </Box>

              {/* Fournitures */}
              <Box sx={{
                background: '#f4fbf7',
                border: `1px solid ${config.accentBorder}`,
                borderLeft: `4px solid ${config.color}`,
                borderRadius: '14px',
                p: { xs: 2.5, md: 3 },
              }}>
                <Box
                  onClick={() => setShowFournitures(!showFournitures)}
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', userSelect: 'none' }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Package size={19} color={config.color} />
                    <Typography sx={{ fontSize: 15.5, fontWeight: 700, color: config.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Liste de fournitures
                    </Typography>
                    <Chip label="Officielle" size="small" sx={{
                      fontSize: 11.5, height: 23,
                      background: config.accent, color: config.color,
                      border: `1px solid ${config.accentBorder}`,
                    }} />
                  </Box>
                  <ChevronRight
                    size={18} color={config.color}
                    style={{ transform: showFournitures ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}
                  />
                </Box>
                {showFournitures && (
                  <Box sx={{ mt: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {config.fournitures.map((f) => (
                      <Box key={f} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: config.color, flexShrink: 0 }} />
                        <Typography sx={{ fontSize: 16, color: '#2d3a30', lineHeight: 1.55 }}>{f}</Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </Grid>

            {/* ── DROITE — Sidebar ── */}
            <Grid item xs={12} md={5}>
              <Box sx={{
                background: '#f4f8f5',
                borderRadius: '22px',
                p: { xs: 3, md: 4 },
                border: `1px solid ${config.accentBorder}`,
                position: 'sticky',
                top: 24,
              }}>

                {/* Infos pratiques */}
                {[
                  { icon: Clock, label: "Horaires d'accueil", value: '7h30 — 16h30' },
                  { icon: Users, label: 'Effectif par classe',  value: config.effectif },
                  { icon: Star,  label: 'Encadrement',          value: config.encadrement },
                ].map(({ icon: I, label, value }) => (
                  <Box key={label} sx={{ display: 'flex', gap: 2.25, alignItems: 'flex-start', mb: 3.5 }}>
                    <Box sx={{
                      width: 48, height: 48,
                      borderRadius: '13px',
                      background: config.accent,
                      border: `1px solid ${config.accentBorder}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <I size={22} color={config.color} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: 12, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                        {label}
                      </Typography>
                      <Typography sx={{ fontSize: 17, fontWeight: 700, color: '#0c1a10', mt: 0.35, lineHeight: 1.35 }}>
                        {value}
                      </Typography>
                    </Box>
                  </Box>
                ))}

                {/* Scolarité */}
                <Box sx={{
                  p: { xs: 2.5, md: 3 },
                  background: config.accent,
                  borderRadius: '16px',
                  border: `1px solid ${config.accentBorder}`,
                  mb: 3.5,
                }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 700, color: config.color, textTransform: 'uppercase', letterSpacing: '1px', mb: 1.5 }}>
                    Scolarité 2025-2026
                  </Typography>
                  <Typography sx={{ fontSize: 26, fontWeight: 800, color: '#0c1a10', lineHeight: 1.2 }}>
                    50 000 F
                  </Typography>
                  <Typography sx={{ fontSize: 15, color: '#6b7c70', mt: 0.5 }}>
                    + 6 000 F{' '}
                    <Box component="span" sx={{ fontStyle: 'italic', fontSize: 14 }}>(fêtes & photos)</Box>
                  </Typography>
                  <Typography sx={{ fontSize: 15.5, color: '#5a6e62', mt: 1.5, fontWeight: 600 }}>
                    Cantine facultative : <strong>8 000 F / mois</strong>
                  </Typography>
                  <Typography sx={{ fontSize: 14.5, color: config.color, mt: 0.75, fontStyle: 'italic', fontWeight: 600 }}>
                    Goûter + tenue de sport inclus
                  </Typography>
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