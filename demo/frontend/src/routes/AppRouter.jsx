import { Routes, Route, Navigate } from 'react-router-dom'
import PrivateRoute from '../guards/PrivateRoute'
import Layout from '../components/Layout'

import LoginPage from '../pages/LoginPage'
import DashboardPage from '../pages/reporting/DashboardPage'
import OrganismesPage from '../pages/organismes/OrganismesPage'
import EmployesPage from '../pages/employes/EmployesPage'
import ProjetsPage from '../pages/projets/ProjetsPage'
import PhasesPage from '../pages/phases/PhasesPage'
import AffectationsPage from '../pages/affectations/AffectationsPage'
import LivrablesPage from '../pages/livrables/LivrablesPage'
import DocumentsPage from '../pages/documents/DocumentsPage'
import FacturesPage from '../pages/factures/FacturesPage'
import ProfilPage from '../pages/profil/ProfilPage'  // ✅ NOUVEAU

export default function AppRouter() {
  return (
    <Routes>
      {/* Route publique */}
      <Route path="/login" element={<LoginPage />} />

      {/* Routes protégées dans le Layout */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />

        <Route path="dashboard" element={<DashboardPage />} />

        {/* ✅ NOUVEAU : page profil accessible à tous */}
        <Route path="profil" element={<ProfilPage />} />

        <Route
          path="organismes"
          element={
            <PrivateRoute allowedRoles={['ADMIN', 'SECRETAIRE', 'DIRECTEUR']}>
              <OrganismesPage />
            </PrivateRoute>
          }
        />

        <Route path="employes" element={<EmployesPage />} />

        <Route path="projets" element={<ProjetsPage />} />

        <Route
          path="projets/:projetId/phases"
          element={
            <PrivateRoute allowedRoles={['ADMIN', 'CHEF_PROJET', 'DIRECTEUR']}>
              <PhasesPage />
            </PrivateRoute>
          }
        />

        <Route
          path="phases/:phaseId/affectations"
          element={
            <PrivateRoute allowedRoles={['ADMIN', 'CHEF_PROJET']}>
              <AffectationsPage />
            </PrivateRoute>
          }
        />

        <Route
          path="phases/:phaseId/livrables"
          element={
            <PrivateRoute allowedRoles={['ADMIN', 'CHEF_PROJET']}>
              <LivrablesPage />
            </PrivateRoute>
          }
        />

        <Route
          path="projets/:projetId/documents"
          element={
            <PrivateRoute allowedRoles={['ADMIN', 'CHEF_PROJET', 'SECRETAIRE']}>
              <DocumentsPage />
            </PrivateRoute>
          }
        />

        <Route
          path="factures"
          element={
            <PrivateRoute allowedRoles={['ADMIN', 'COMPTABLE']}>
              <FacturesPage />
            </PrivateRoute>
          }
        />

        <Route
          path="reporting"
          element={
            <PrivateRoute allowedRoles={['ADMIN', 'DIRECTEUR', 'COMPTABLE']}>
              <DashboardPage />
            </PrivateRoute>
          }
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}