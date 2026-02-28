import { Routes, Route, Navigate } from 'react-router-dom'

// Layouts
import PublicLayout from '@/components/layout/PublicLayout'
import AdminLayout from '@/components/layout/AdminLayout'

// Public Pages
import Home from '@/pages/public/Home'
import About from '@/pages/public/About'
import MotDirecteur from '@/pages/public/MotDirecteur'
import FlashInfos from '@/pages/public/FlashInfos'
import Inscription from '@/pages/public/Inscription'
import { Creche, PetiteSection, MoyenneSection, GrandeSection } from '@/pages/public/Sections'
import Activites from '@/pages/public/Activites'
import ActiviteDetail from '@/pages/public/ActiviteDetail'
import Calendrier from '@/pages/public/Calendrier'
import Contact from '@/pages/public/Contact'

// Admin Pages
import Login from '@/pages/admin/Login'
import Dashboard from '@/pages/admin/Dashboard'
import ActualitesList from '@/pages/admin/Actualites/ActualitesList'
import ActualitesForm from '@/pages/admin/Actualites/ActualitesForm'
import ActivitesList from '@/pages/admin/Activites/ActivitesList'
import ActivitesForm from '@/pages/admin/Activites/ActivitesForm'
import Galerie from '@/pages/admin/Galerie'
import InscriptionsList from '@/pages/admin/Inscriptionslist'
import InscriptionDetail from '@/pages/admin/InscriptionDetail'
import Messages from '@/pages/admin/Messages'
import CalendrierAdmin from '@/pages/admin/Calendrier/CalendrierAdmin'
import Utilisateurs from '@/pages/admin/Utilisateurs'
import Parametres from '@/pages/admin/Parametres'

// Auth Guard
import ProtectedRoute from '@/router/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      {/* ========================
          SITE PUBLIC
      ======================== */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/presentation" element={<About />} />
        <Route path="/mot-du-directeur" element={<MotDirecteur />} />
        <Route path="/flash-infos" element={<FlashInfos />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/sections/creche" element={<Creche />} />
        <Route path="/sections/petite-section" element={<PetiteSection />} />
        <Route path="/sections/moyenne-section" element={<MoyenneSection />} />
        <Route path="/sections/grande-section" element={<GrandeSection />} />
        <Route path="/activites" element={<Activites />} />
        <Route path="/activites/:slug" element={<ActiviteDetail />} />
        <Route path="/calendrier" element={<Calendrier />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* ========================
          ADMIN — LOGIN
      ======================== */}
      <Route path="/admin/login" element={<Login />} />

      {/* ========================
          ADMIN — PROTÉGÉ
      ======================== */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {/* /admin → /admin/dashboard */}
        <Route index element={<Navigate to="/admin/dashboard" replace />} />

        <Route path="dashboard" element={<Dashboard />} />

        <Route path="actualites" element={<ActualitesList />} />
        <Route path="actualites/nouvelle" element={<ActualitesForm />} />
        <Route path="actualites/:id/modifier" element={<ActualitesForm />} />

        <Route path="activites" element={<ActivitesList />} />
        <Route path="activites/nouvelle" element={<ActivitesForm />} />
        <Route path="activites/:id/modifier" element={<ActivitesForm />} />

        <Route path="galerie" element={<Galerie />} />

        {/* ✅ CHEMINS RELATIFS — pas de /admin/ devant */}
        <Route path="inscriptions" element={<InscriptionsList />} />
        <Route path="inscriptions/:id" element={<InscriptionDetail />} />

        <Route path="messages" element={<Messages />} />
        <Route path="calendrier" element={<CalendrierAdmin />} />

        <Route
          path="utilisateurs"
          element={
            <ProtectedRoute roles={['super-admin']}>
              <Utilisateurs />
            </ProtectedRoute>
          }
        />
        <Route path="parametres" element={<Parametres />} />
      </Route>

      {/* 404 — catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}