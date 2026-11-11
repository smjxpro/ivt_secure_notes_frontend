import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AuthPage } from "./pages/AuthPage";
import { AdminRoute, ProtectedRoute } from "./components/RouteGuards";
import { NotesPage } from "./pages/NotesPage";
import { AggregationsPage } from "./pages/AggregationsPage";
import { AdminUsersPage } from "./pages/AdminUsersPage";
import { PageLayout } from "./components/PageLayout";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<AuthPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<PageLayout />}>
              <Route path="/" element={<Navigate to={"/notes"} replace />} />
              <Route path="/notes" element={<NotesPage />} />
              <Route path="/aggregations" element={<AggregationsPage />} />

              <Route element={<AdminRoute />}>
                <Route path="/admin/users" element={<AdminUsersPage />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to={"/login"} replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}