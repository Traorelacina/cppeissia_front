import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material'
import { Eye, EyeOff, BookOpen, Mail, Lock, Shield } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/admin/dashboard'

  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setError('')
    const result = await login(data)
    if (result.success) {
      toast.success('Connexion réussie !')
      navigate(from, { replace: true })
    } else {
      setError(result.message)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        background: '#f0f4f1',
      }}
    >
      {/* PANNEAU GAUCHE */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(145deg, #0a2e18, #0f4a25)',
          p: 6,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Décoration */}
        <Box
          sx={{
            position: 'absolute',
            width: 500,
            height: 500,
            right: -150,
            top: -150,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245,166,35,0.08) 0%, transparent 70%)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <Box
            sx={{
              width: 72,
              height: 72,
              background: '#F5A623',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
              boxShadow: '0 8px 32px rgba(245,166,35,0.3)',
            }}
          >
            <BookOpen size={36} color="#0f4a25" strokeWidth={2.5} />
          </Box>

          <Typography
            sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 700, color: '#fff', lineHeight: 1.1, mb: 1.5 }}
          >
            CPPE <span style={{ color: '#F5A623' }}>ISSIA</span>
          </Typography>

          <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, lineHeight: 1.8, maxWidth: 320, mx: 'auto' }}>
            Espace d'administration sécurisé du Centre de Protection de la Petite Enfance d'Issia.
          </Typography>

          <Box sx={{ mt: 5, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[
              'Gestion des actualités et flash infos',
              'Suivi des inscriptions et paiements',
              'Galerie photos des activités',
              'Calendrier scolaire et événements',
            ].map((item) => (
              <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Shield size={14} color="#F5A623" />
                <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{item}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Badge MFFE */}
        <Box sx={{ position: 'absolute', bottom: 32, left: 0, right: 0, textAlign: 'center' }}>
          <Typography sx={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', letterSpacing: '1px', textTransform: 'uppercase' }}>
            Ministère de la Femme, de la Famille et de l'Enfant — Côte d'Ivoire
          </Typography>
        </Box>
      </Box>

      {/* PANNEAU DROIT - FORMULAIRE */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: { xs: 3, md: 6 },
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          {/* Logo mobile */}
          <Box sx={{ display: { md: 'none' }, textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                background: '#1B7A3E',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
              }}
            >
              <BookOpen size={28} color="#fff" strokeWidth={2.5} />
            </Box>
          </Box>

          <Typography
            sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 700, color: '#0c1a10', mb: 0.5 }}
          >
            Connexion
          </Typography>
          <Typography sx={{ color: '#6b7c70', fontSize: 13.5, mb: 4 }}>
            Accédez à l'espace d'administration du CPPE.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, fontSize: 13, borderRadius: '10px' }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label="Adresse e-mail"
              type="email"
              fullWidth
              autoComplete="email"
              autoFocus
              error={!!errors.email}
              helperText={errors.email?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail size={16} color="#6b7c70" />
                  </InputAdornment>
                ),
              }}
              {...register('email', {
  required: "L'adresse e-mail est requise.",
  pattern: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Format invalide.',
  },
})}
            />

            <TextField
              label="Mot de passe"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              autoComplete="current-password"
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock size={16} color="#6b7c70" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              {...register('password', { required: 'Le mot de passe est requis.' })}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                background: '#1B7A3E',
                color: '#fff',
                fontWeight: 700,
                py: 1.5,
                fontSize: 14,
                mt: 0.5,
                '&:hover': { background: '#0f4a25' },
              }}
            >
              {loading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Se connecter'}
            </Button>
          </Box>

          <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid #dae8df', textAlign: 'center' }}>
            <Typography sx={{ fontSize: 11, color: '#6b7c70', letterSpacing: '0.5px' }}>
              Accès réservé au personnel autorisé du CPPE d'Issia.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}