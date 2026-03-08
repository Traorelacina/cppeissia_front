import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Box, Grid, Paper, Typography, Table, TableBody,
  TableCell, TableHead, TableRow, Button, Chip, Avatar,
  Divider, Skeleton, Tooltip, IconButton, LinearProgress,
} from '@mui/material'
import {
  Users, Newspaper, Image, MessageSquare, ArrowRight, ClipboardList,
  Plus, Bell, CheckCircle, Clock, TrendingUp,
  CalendarDays, BookOpen, Eye, Pencil, Sparkles,
  LayoutDashboard, Mail, RefreshCw,
} from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { dashboardApi } from '@/api/services'
import { StatusBadge } from '@/components/common'
import { format, formatDistanceToNow, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useAuth } from '@/contexts/AuthContext'

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
const SECTION_META = {
  creche:           { label: 'Crèche',          color: '#e91e8c', bg: '#fce4ec', barColor: '#e91e8c' },
  petite_section:   { label: 'Petite Section',   color: '#b87b0f', bg: '#fff3e0', barColor: '#F5A623' },
  moyenne_section:  { label: 'Moyenne Section',  color: '#1B7A3E', bg: '#eaf4ee', barColor: '#1B7A3E' },
  grande_section:   { label: 'Grande Section',   color: '#6b21a8', bg: '#f3e8ff', barColor: '#9c27b0' },
}

const STATUT_INSC = {
  en_attente: { label: 'En attente', bg: '#fff3e0', color: '#b87b0f' },
  valide:     { label: 'Validée',    bg: '#eaf4ee', color: '#1B7A3E' },
  refuse:     { label: 'Refusée',    bg: '#fce4ec', color: '#c62828' },
}

function timeAgo(date) {
  if (!date) return ''
  try { return formatDistanceToNow(parseISO(date), { addSuffix: true, locale: fr }) }
  catch { return '' }
}

// ─────────────────────────────────────────────────────────────
// KPI Card
// ─────────────────────────────────────────────────────────────
function KpiCard({ icon: Icon, label, value, delta, deltaType, color, sub, loading, to }) {
  const content = (
    <Paper
      sx={{
        p: 2.5, height: '100%', borderRadius: '16px',
        border: '1px solid', borderColor: `${color}22`,
        transition: 'all 0.2s',
        cursor: to ? 'pointer' : 'default',
        position: 'relative', overflow: 'hidden',
        '&:hover': to ? { boxShadow: `0 8px 24px ${color}18`, transform: 'translateY(-3px)' } : {},
      }}
    >
      <Box sx={{ position: 'absolute', top: -20, right: -20, width: 90, height: 90, borderRadius: '50%', background: `${color}08` }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box sx={{ width: 44, height: 44, borderRadius: '12px', background: `${color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={20} color={color} />
        </Box>
        {delta !== undefined && (
          <Chip label={delta} size="small" sx={{
            fontSize: 10.5, fontWeight: 700, height: 22,
            background: deltaType === 'up' ? '#dcfce7' : deltaType === 'warn' ? '#fff3e0' : '#f3f4f6',
            color:      deltaType === 'up' ? '#15803d' : deltaType === 'warn' ? '#b87b0f' : '#6b7280',
          }} />
        )}
      </Box>
      {loading ? (
        <><Skeleton width={70} height={36} sx={{ mb: 0.5 }} /><Skeleton width={90} height={16} /></>
      ) : (
        <>
          <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 700, color: '#0c1a10', lineHeight: 1 }}>
            {value ?? '—'}
          </Typography>
          <Typography sx={{ fontSize: 12.5, color: '#6b7c70', mt: 0.75, fontWeight: 500 }}>{label}</Typography>
          {sub && <Typography sx={{ fontSize: 11, color, mt: 0.5, fontWeight: 600 }}>{sub}</Typography>}
        </>
      )}
    </Paper>
  )
  return to
    ? <Box component={Link} to={to} sx={{ textDecoration: 'none', display: 'block', height: '100%' }}>{content}</Box>
    : content
}

// ─────────────────────────────────────────────────────────────
// En-tête de bloc
// ─────────────────────────────────────────────────────────────
function BlockHeader({ title, icon: Icon, to, toLabel = 'Tout voir', action }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2.5, py: 2, borderBottom: '1px solid #eaf4ee' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
        {Icon && <Icon size={15} color="#1B7A3E" />}
        <Typography sx={{ fontWeight: 700, fontSize: 13.5, color: '#0c1a10' }}>{title}</Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        {action}
        {to && (
          <Button component={Link} to={to} size="small" endIcon={<ArrowRight size={12} />} sx={{ color: '#1B7A3E', fontSize: 11.5, py: 0.4 }}>
            {toLabel}
          </Button>
        )}
      </Box>
    </Box>
  )
}

// ─────────────────────────────────────────────────────────────
// Alertes intelligentes
// ─────────────────────────────────────────────────────────────
function AlertesBanner({ stats }) {
  const alertes = []
  if (stats.messages_non_lus > 0)
    alertes.push({ icon: Mail, color: '#dc2626', bg: '#fce4ec', msg: `${stats.messages_non_lus} message${stats.messages_non_lus > 1 ? 's' : ''} non lu${stats.messages_non_lus > 1 ? 's' : ''}`, to: '/admin/messages' })
  if (stats.actualites_brouillons > 0)
    alertes.push({ icon: Newspaper, color: '#1565c0', bg: '#dbeafe', msg: `${stats.actualites_brouillons} brouillon${stats.actualites_brouillons > 1 ? 's' : ''}`, to: '/admin/actualites' })
  if (alertes.length === 0) return null
  return (
    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 3 }}>
      {alertes.map(({ icon: Icon, color, bg, msg, to }) => (
        <Box key={msg} component={Link} to={to} sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 2, py: 1, borderRadius: '30px', background: bg, textDecoration: 'none', border: `1px solid ${color}30`, transition: 'all 0.15s', '&:hover': { opacity: 0.85 } }}>
          <Icon size={14} color={color} />
          <Typography sx={{ fontSize: 12.5, fontWeight: 700, color }}>{msg}</Typography>
          <ArrowRight size={12} color={color} />
        </Box>
      ))}
    </Box>
  )
}

// ─────────────────────────────────────────────────────────────
// Accès rapides
// ─────────────────────────────────────────────────────────────
const QUICK_LINKS = [
  { label: 'Nouvelle actualité',    icon: Plus,          to: '/admin/actualites/nouvelle', color: '#1B7A3E', bg: '#eaf4ee' },
  { label: 'Nouvelle activité',     icon: Sparkles,      to: '/admin/activites/nouvelle',  color: '#6b21a8', bg: '#f3e8ff' },
  { label: 'Messages',              icon: MessageSquare, to: '/admin/messages',            color: '#1565c0', bg: '#dbeafe' },
  { label: 'Calendrier',            icon: CalendarDays,  to: '/admin/calendrier',          color: '#0f766e', bg: '#ccfbf1' },
  { label: 'Paramètres',            icon: BookOpen,      to: '/admin/parametres',          color: '#64748b', bg: '#f1f5f9' },
]

// ─────────────────────────────────────────────────────────────
// Fonction pour extraire un aperçu du contenu
// ─────────────────────────────────────────────────────────────
function getContentPreview(content, maxLength = 40) {
  if (!content) return 'Sans contenu'
  const plainText = content.replace(/[*_~`#]/g, '')
  return plainText.length > maxLength 
    ? plainText.substring(0, maxLength) + '…' 
    : plainText
}

// ─────────────────────────────────────────────────────────────
// DASHBOARD PRINCIPAL
// ─────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user }       = useAuth()
  const queryClient    = useQueryClient()
  const [spin, setSpin] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn:  () => dashboardApi.getStats(),
    refetchInterval: 60_000,
  })

  const handleRefresh = async () => {
    setSpin(true)
    await queryClient.invalidateQueries(['dashboard'])
    setTimeout(() => setSpin(false), 700)
  }

  const stats               = data?.data?.data?.stats                || {}
  const derniers_messages      = data?.data?.data?.derniers_messages      || []
  const dernieres_actualites   = data?.data?.data?.dernieres_actualites   || []
  const dernieres_activites    = data?.data?.data?.dernieres_activites    || []

  const today     = format(new Date(), "EEEE d MMMM yyyy", { locale: fr })
  const hour      = new Date().getHours()
  const greet     = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir'
  const firstName = user?.name?.split(' ')[0] || 'Directeur'

  return (
    <Box>
      {/* ─── EN-TÊTE ─── */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Box sx={{ width: 36, height: 36, borderRadius: '10px', background: '#eaf4ee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LayoutDashboard size={18} color="#1B7A3E" />
            </Box>
            <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, color: '#0c1a10' }}>
              {greet}, {firstName} 👋
            </Typography>
          </Box>
          <Typography sx={{ fontSize: 13, color: '#9ca3af', ml: 0.5 }}>
            {today.charAt(0).toUpperCase() + today.slice(1)} · Année scolaire 2025-2026
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Tooltip title="Actualiser les données">
            <IconButton onClick={handleRefresh} size="small" sx={{ border: '1px solid #dae8df', borderRadius: '10px', px: 1.25 }}>
              <RefreshCw size={15} color="#6b7c70" style={{ transition: 'transform 0.7s', transform: spin ? 'rotate(360deg)' : 'none' }} />
            </IconButton>
          </Tooltip>
          <Button
            component={Link}
            to="/admin/actualites/nouvelle"
            variant="contained"
            startIcon={<Plus size={15} />}
            sx={{ background: '#1B7A3E', borderRadius: '10px', fontWeight: 700, px: 2.5, '&:hover': { background: '#0f4a25' } }}
          >
            Nouvelle info
          </Button>
        </Box>
      </Box>

      {/* ─── ALERTES ─── */}
      {!isLoading && <AlertesBanner stats={stats} />}

      {/* ─── KPIs ─── */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          {
            icon: Newspaper, label: 'Actualités publiées', value: stats.actualites_publiees,
            delta: stats.actualites_brouillons ? `${stats.actualites_brouillons} brouillons` : undefined,
            deltaType: 'warn', color: '#1565c0', to: '/admin/actualites',
          },
          {
            icon: MessageSquare, label: 'Messages non lus', value: stats.messages_non_lus,
            delta: stats.messages_non_lus > 0 ? 'À traiter' : 'Tout lu ✓',
            deltaType: stats.messages_non_lus > 0 ? 'warn' : 'up',
            color: stats.messages_non_lus > 0 ? '#dc2626' : '#15803d',
            to: '/admin/messages',
          },
          {
            icon: Sparkles, label: 'Activités', value: stats.activites_total || 0,
            color: '#6b21a8', to: '/admin/activites',
          },
        ].map((props) => (
          <Grid item xs={12} sm={4} key={props.label}>
            <KpiCard loading={isLoading} {...props} />
          </Grid>
        ))}
      </Grid>

      {/* ─── ACCÈS RAPIDES ─── */}
      <Paper sx={{ mb: 3, overflow: 'hidden', borderRadius: '16px' }}>
        <BlockHeader title="Accès rapides" icon={TrendingUp} />
        <Box sx={{ p: 2, display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          {QUICK_LINKS.map(({ label, icon: Icon, to, color, bg }) => (
            <Box key={label} component={Link} to={to} sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 2, py: 1.1, borderRadius: '30px', background: bg, textDecoration: 'none', border: `1px solid ${color}22`, transition: 'all 0.18s', '&:hover': { boxShadow: `0 4px 12px ${color}25`, transform: 'translateY(-2px)' } }}>
              <Icon size={14} color={color} />
              <Typography sx={{ fontSize: 12.5, fontWeight: 700, color, whiteSpace: 'nowrap' }}>{label}</Typography>
            </Box>
          ))}
        </Box>
      </Paper>

      {/* ─── LIGNE 1 : ACTUALITÉS ─── */}
      <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
        <Grid item xs={12}>
          <Paper sx={{ overflow: 'hidden', borderRadius: '16px' }}>
            <BlockHeader title="Flash infos récents" icon={Newspaper} to="/admin/actualites"
              action={
                <Tooltip title="Créer une actualité">
                  <IconButton component={Link} to="/admin/actualites/nouvelle" size="small" sx={{ color: '#1B7A3E' }}>
                    <Plus size={15} />
                  </IconButton>
                </Tooltip>
              }
            />

            {isLoading ? (
              <Box sx={{ p: 2.5 }}>{[...Array(4)].map((_, i) => <Skeleton key={i} height={48} sx={{ mb: 1, borderRadius: '8px' }} />)}</Box>
            ) : dernieres_actualites.length === 0 ? (
              <Box sx={{ p: 5, textAlign: 'center' }}>
                <Newspaper size={32} color="#dae8df" style={{ margin: '0 auto 12px' }} />
                <Typography sx={{ color: '#6b7c70', fontSize: 13.5 }}>Aucune actualité pour le moment.</Typography>
                <Button component={Link} to="/admin/actualites/nouvelle" variant="contained" size="small" sx={{ mt: 2, background: '#1B7A3E', borderRadius: '8px' }}>Créer la première</Button>
              </Box>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ background: '#f9fbf9' }}>
                    {['Contenu', 'Type', 'Date', 'Statut', ''].map((h, i) => (
                      <TableCell key={i} align={i === 4 ? 'right' : 'left'} sx={{ fontSize: 10.5, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', display: [2].includes(i) ? { xs: 'none', sm: 'table-cell' } : [1].includes(i) ? { xs: 'none', md: 'table-cell' } : 'table-cell' }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dernieres_actualites.map((actu) => (
                    <TableRow key={actu.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                      <TableCell>
                        <Typography sx={{ fontWeight: 600, fontSize: 13, color: '#0c1a10', maxWidth: { xs: 200, md: 400 }, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {getContentPreview(actu.contenu)}
                        </Typography>
                        <Typography sx={{ fontSize: 11, color: '#9ca3af', mt: 0.2 }}>{actu.auteur?.name || 'Direction'}</Typography>
                      </TableCell>
                      <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                        <Chip label={actu.type || 'flash'} size="small" sx={{ fontSize: 10, textTransform: 'capitalize', background: '#f3f4f6', color: '#4b5563' }} />
                      </TableCell>
                      <TableCell sx={{ fontSize: 12, color: '#6b7c70', whiteSpace: 'nowrap', display: { xs: 'none', sm: 'table-cell' } }}>
                        {actu.created_at ? format(new Date(actu.created_at), 'dd MMM yyyy', { locale: fr }) : '—'}
                      </TableCell>
                      <TableCell><StatusBadge status={actu.statut} /></TableCell>
                      <TableCell align="right">
                        <Tooltip title="Modifier">
                          <IconButton component={Link} to={`/admin/actualites/${actu.id}/modifier`} size="small" sx={{ color: '#1B7A3E' }}>
                            <Pencil size={13} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* ─── LIGNE 2 : MESSAGES + ACTIVITÉS ─── */}
      <Grid container spacing={2.5}>
        {/* MESSAGES */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ overflow: 'hidden', borderRadius: '16px', height: '100%' }}>
            <BlockHeader title="Messages de contact" icon={Mail} to="/admin/messages" />

            {isLoading ? (
              <Box sx={{ p: 2.5 }}>{[...Array(4)].map((_, i) => <Skeleton key={i} height={44} sx={{ mb: 0.75, borderRadius: '8px' }} />)}</Box>
            ) : derniers_messages.length === 0 ? (
              <Box sx={{ p: 5, textAlign: 'center' }}>
                <MessageSquare size={32} color="#dae8df" style={{ margin: '0 auto 12px' }} />
                <Typography sx={{ color: '#6b7c70', fontSize: 13 }}>Aucun message reçu.</Typography>
              </Box>
            ) : (
              <Box>
                {derniers_messages.map((msg, i) => (
                  <Box key={msg.id}>
                    {i > 0 && <Divider sx={{ mx: 2.5 }} />}
                    <Box component={Link} to="/admin/messages" sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25, px: 2.5, py: 1.75, textDecoration: 'none', transition: 'background 0.15s', '&:hover': { background: '#f9fbf9' } }}>
                      <Box sx={{ width: 7, height: 7, borderRadius: '50%', background: msg.lu ? 'transparent' : '#1B7A3E', border: msg.lu ? '1.5px solid #dae8df' : 'none', flexShrink: 0, mt: 0.9 }} />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ fontWeight: msg.lu ? 500 : 700, fontSize: 13, color: '#0c1a10', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.nom}</Typography>
                        <Typography sx={{ fontSize: 12, color: '#6b7c70', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.sujet}</Typography>
                      </Box>
                      <Typography sx={{ fontSize: 10.5, color: '#9ca3af', ml: 'auto', flexShrink: 0, mt: 0.25 }}>
                        {msg.created_at ? format(new Date(msg.created_at), 'dd/MM') : ''}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>

        {/* ACTIVITÉS RÉCENTES */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ overflow: 'hidden', borderRadius: '16px', height: '100%' }}>
            <BlockHeader title="Activités récentes" icon={Sparkles} to="/admin/activites"
              action={
                <Tooltip title="Nouvelle activité">
                  <IconButton component={Link} to="/admin/activites/nouvelle" size="small" sx={{ color: '#1B7A3E' }}>
                    <Plus size={15} />
                  </IconButton>
                </Tooltip>
              }
            />

            {isLoading ? (
              <Box sx={{ p: 2.5 }}>{[...Array(4)].map((_, i) => <Skeleton key={i} height={52} sx={{ mb: 0.75, borderRadius: '8px' }} />)}</Box>
            ) : !dernieres_activites || dernieres_activites.length === 0 ? (
              <Box sx={{ p: 5, textAlign: 'center' }}>
                <Sparkles size={32} color="#dae8df" style={{ margin: '0 auto 12px' }} />
                <Typography sx={{ color: '#6b7c70', fontSize: 13 }}>Aucune activité créée.</Typography>
                <Button component={Link} to="/admin/activites/nouvelle" size="small" variant="contained" sx={{ mt: 2, background: '#1B7A3E', borderRadius: '8px' }}>Créer une activité</Button>
              </Box>
            ) : (
              <Box>
                {dernieres_activites.map((act, i) => {
                  const sm = SECTION_META[act.section] || {}
                  return (
                    <Box key={act.id}>
                      {i > 0 && <Divider sx={{ mx: 2.5 }} />}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2.5, py: 1.75 }}>
                        <Box sx={{ width: 36, height: 36, borderRadius: '10px', flexShrink: 0, background: act.photo_principale ? `url(${act.photo_principale}) center/cover` : (sm.bg || '#f3f4f6'), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {!act.photo_principale && <Image size={15} color={sm.color || '#9ca3af'} />}
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography sx={{ fontWeight: 600, fontSize: 13, color: '#0c1a10', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{act.titre}</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                            {sm.label && <Typography sx={{ fontSize: 11, color: sm.color, fontWeight: 600 }}>{sm.label}</Typography>}
                            {act.nb_photos > 0 && (
                              <><Typography sx={{ fontSize: 10, color: '#c4cfca' }}>·</Typography><Typography sx={{ fontSize: 11, color: '#9ca3af' }}>{act.nb_photos} photo{act.nb_photos > 1 ? 's' : ''}</Typography></>
                            )}
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Tooltip title="Voir sur le site">
                            <IconButton component="a" href={`/activites/${act.slug}`} target="_blank" size="small" sx={{ color: '#9ca3af', '&:hover': { color: '#1B7A3E' } }}>
                              <Eye size={13} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Modifier">
                            <IconButton component={Link} to={`/admin/activites/${act.id}/modifier`} size="small" sx={{ color: '#9ca3af', '&:hover': { color: '#1B7A3E' } }}>
                              <Pencil size={13} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    </Box>
                  )
                })}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* ─── BARRE D'ÉTAT ─── */}
      <Box sx={{ mt: 3, p: 2, borderRadius: '14px', background: '#f9fbf9', border: '1px solid #eaf4ee', display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 0 3px #dcfce7' }} />
          <Typography sx={{ fontSize: 12, color: '#6b7c70', fontWeight: 500 }}>Système opérationnel</Typography>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Typography sx={{ fontSize: 12, color: '#9ca3af' }}>
          Actualisé à {format(new Date(), 'HH:mm')} · Auto-rafraîchissement toutes les 60 s
        </Typography>
        <Box sx={{ ml: 'auto', display: 'flex', gap: 2 }}>
          {[
            { icon: CheckCircle, label: 'API connectée', color: '#22c55e' },
            { icon: CheckCircle, label: 'Stockage OK',   color: '#22c55e' },
            {
              icon:  stats.messages_non_lus > 0 ? Bell : CheckCircle,
              label: stats.messages_non_lus > 0 ? `${stats.messages_non_lus} alerte${stats.messages_non_lus > 1 ? 's' : ''}` : 'Aucune alerte',
              color: stats.messages_non_lus > 0 ? '#f59e0b' : '#22c55e',
            },
          ].map(({ icon: Icon, label, color }) => (
            <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Icon size={12} color={color} />
              <Typography sx={{ fontSize: 11.5, color: '#9ca3af' }}>{label}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}