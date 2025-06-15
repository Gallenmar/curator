import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import UserDashboard from "./pages/user/UserDashboard";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import ManagerApartments from "./pages/manager/ManagerApartments";
import ManagerSingleApartmentPage from "./pages/manager/ManagerSingleApartmentPage";
import ManagerUsers from "./pages/manager/ManagerUsers";
import ManagerBuildings from "./pages/manager/ManagerBuildings";
import AccountSettings from "./pages/AccountSettings";
import NotFound from "./pages/NotFound";
import ManagerMeters from "./pages/manager/ManagerMeters";

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />

              {/* User Routes */}
              <Route
                path="/user"
                element={
                  <ProtectedRoute allowedRoles={["user"]}>
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Manager Routes */}
              <Route
                path="/manager"
                element={
                  <ProtectedRoute allowedRoles={["manager"]}>
                    <ManagerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manager/apartments"
                element={
                  <ProtectedRoute allowedRoles={["manager"]}>
                    <ManagerApartments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manager/apartments/:id"
                element={
                  <ProtectedRoute allowedRoles={["manager"]}>
                    <ManagerSingleApartmentPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manager/users"
                element={
                  <ProtectedRoute allowedRoles={["manager"]}>
                    <ManagerUsers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manager/buildings"
                element={
                  <ProtectedRoute allowedRoles={["manager"]}>
                    <ManagerBuildings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manager/meters"
                element={
                  <ProtectedRoute allowedRoles={["manager"]}>
                    <ManagerMeters />
                  </ProtectedRoute>
                }
              />

              {/* Common Routes */}
              <Route
                path="/settings"
                element={
                  <ProtectedRoute allowedRoles={["user", "manager"]}>
                    <AccountSettings />
                  </ProtectedRoute>
                }
              />

              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
