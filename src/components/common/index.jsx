import { Box, CircularProgress, Typography, Skeleton } from '@mui/material'
import { AlertCircle } from 'lucide-react'

// ========================
// LOADING SPINNER
// ========================
export function LoadingSpinner({ message = 'Chargement...' }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8, gap: 2 }}>
      <CircularProgress sx={{ color: '#1B7A3E' }} size={36} />
      <Typography sx={{ color: '#6b7c70', fontSize: 13 }}>{message}</Typography>
    </Box>
  )
}

// ========================
// ERROR STATE
// ========================
export function ErrorState({ message = 'Une erreur est survenue.', onRetry }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8, gap: 2 }}>
      <AlertCircle size={36} color="#dc2626" />
      <Typography sx={{ color: '#dc2626', fontWeight: 600 }}>{message}</Typography>
      {onRetry && (
        <Box
          onClick={onRetry}
          sx={{ color: '#1B7A3E', fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}
        >
          Réessayer
        </Box>
      )}
    </Box>
  )
}

// ========================
// SECTION HEADER
// ========================
export function SectionHeader({ eyebrow, title, subtitle, centered = false, dark = false }) {
  return (
    <Box sx={{ mb: 4, textAlign: centered ? 'center' : 'left' }}>
      {eyebrow && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, justifyContent: centered ? 'center' : 'flex-start' }}>
          <Box sx={{ width: 30, height: 2, background: '#F5A623', flexShrink: 0 }} />
          <Typography
            sx={{ fontSize: 11, fontWeight: 700, color: '#F5A623', letterSpacing: '3px', textTransform: 'uppercase' }}
          >
            {eyebrow}
          </Typography>
        </Box>
      )}
      <Typography
        variant="h2"
        sx={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: { xs: 32, md: 44 },
          fontWeight: 700,
          color: dark ? '#fff' : '#0c1a10',
          lineHeight: 1.1,
          mb: subtitle ? 1.5 : 0,
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          sx={{
            fontSize: 15,
            color: dark ? 'rgba(255,255,255,0.6)' : '#6b7c70',
            fontWeight: 300,
            lineHeight: 1.8,
            maxWidth: centered ? 560 : 640,
            mx: centered ? 'auto' : 0,
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  )
}

// ========================
// STATUS BADGE
// ========================
const BADGE_STYLES = {
  publie: { bg: '#dcfce7', color: '#15803d', dot: '#15803d', label: 'Publié' },
  brouillon: { bg: '#fef9c3', color: '#854d0e', dot: '#ca8a04', label: 'Brouillon' },
  planifie: { bg: '#dbeafe', color: '#1d4ed8', dot: '#3b82f6', label: 'Planifié' },
  archive: { bg: '#f3f4f6', color: '#6b7280', dot: '#9ca3af', label: 'Archivé' },
  en_attente: { bg: '#fef9c3', color: '#854d0e', dot: '#ca8a04', label: 'En attente' },
  valide: { bg: '#dcfce7', color: '#15803d', dot: '#15803d', label: 'Validé' },
  refuse: { bg: '#fee2e2', color: '#dc2626', dot: '#dc2626', label: 'Refusé' },
  non_paye: { bg: '#fee2e2', color: '#dc2626', dot: '#dc2626', label: 'Non payé' },
  partiel: { bg: '#fef9c3', color: '#854d0e', dot: '#ca8a04', label: 'Partiel' },
  complet: { bg: '#dcfce7', color: '#15803d', dot: '#15803d', label: 'Complet' },
}

export function StatusBadge({ status }) {
  const style = BADGE_STYLES[status] || BADGE_STYLES.archive
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        px: 1.25,
        py: 0.4,
        borderRadius: '50px',
        background: style.bg,
        color: style.color,
        fontSize: 11,
        fontWeight: 700,
        '&::before': {
          content: '""',
          display: 'block',
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: style.dot,
          flexShrink: 0,
        },
      }}
    >
      {style.label}
    </Box>
  )
}

// ========================
// PAGE TITLE (Admin)
// ========================
export function PageTitle({ title, subtitle, action }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
      <Box>
        <Typography
          variant="h4"
          sx={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: '#0c1a10', fontSize: { xs: 24, md: 30 } }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography sx={{ color: '#6b7c70', fontSize: 13, mt: 0.5 }}>{subtitle}</Typography>
        )}
      </Box>
      {action && <Box>{action}</Box>}
    </Box>
  )
}

// ========================
// STAT CARD (Admin Dashboard)
// ========================
export function StatCard({ label, value, delta, deltaType = 'up', icon: Icon, color = '#1B7A3E' }) {
  return (
    <Box
      sx={{
        background: '#fff',
        borderRadius: '14px',
        p: 2.5,
        border: '1px solid #dae8df',
        transition: 'transform 0.2s',
        '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 8px 24px rgba(27,122,62,0.08)' },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#6b7c70', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {label}
        </Typography>
        {Icon && (
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              background: `${color}18`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon size={18} color={color} />
          </Box>
        )}
      </Box>
      <Typography
        sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 34, fontWeight: 700, color: '#0c1a10', lineHeight: 1 }}
      >
        {value}
      </Typography>
      {delta && (
        <Typography
          sx={{
            mt: 0.75,
            fontSize: 11,
            fontWeight: 600,
            color: deltaType === 'up' ? '#15803d' : deltaType === 'warn' ? '#b87b0f' : '#dc2626',
          }}
        >
          {delta}
        </Typography>
      )}
    </Box>
  )
}

// ========================
// EMPTY STATE
// ========================
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8, gap: 1.5, textAlign: 'center' }}>
      {Icon && (
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '16px',
            background: '#eaf4ee',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 1,
          }}
        >
          <Icon size={28} color="#1B7A3E" />
        </Box>
      )}
      <Typography sx={{ fontWeight: 700, fontSize: 16, color: '#0c1a10' }}>{title}</Typography>
      {description && (
        <Typography sx={{ color: '#6b7c70', fontSize: 13, maxWidth: 320 }}>{description}</Typography>
      )}
      {action && <Box sx={{ mt: 1 }}>{action}</Box>}
    </Box>
  )
}

// ========================
// TABLE SKELETON
// ========================
export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <Box>
      {Array.from({ length: rows }).map((_, i) => (
        <Box key={i} sx={{ display: 'flex', gap: 2, py: 1.5, borderBottom: '1px solid #f3f7f4' }}>
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} variant="text" sx={{ flex: 1, borderRadius: '6px' }} />
          ))}
        </Box>
      ))}
    </Box>
  )
}