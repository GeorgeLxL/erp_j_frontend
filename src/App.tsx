import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import SignIn from './pages/SignIn';
import WorkerLayout from './pages/worker/WorkerLayout';
import WorkerCaseList from './pages/worker/WorkerCaseList';
import WorkerNewCase from './pages/worker/WorkerNewCase';
import StaffLayout from './pages/staff/StaffLayout';
import StaffCaseList from './pages/staff/StaffCaseList';
import StaffCaseDetail from './pages/staff/StaffCaseDetail';
import AdminLayout from './pages/admin/AdminLayout';
import AdminUsers from './pages/admin/AdminUsers';
import ChangePassword from './pages/ChangePassword';

function RoleRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/signin" replace />;
  if (user.role === 'WORKER') return <Navigate to="/worker" replace />;
  if (user.role === 'STAFF') return <Navigate to="/staff" replace />;
  return <Navigate to="/admin" replace />;
}

function RequireAuth({ children, roles }: { children: JSX.Element; roles?: string[] }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/signin" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/" element={<RoleRedirect />} />

          <Route path="/worker" element={<RequireAuth roles={['WORKER', 'ADMIN']}><WorkerLayout /></RequireAuth>}>
            <Route index element={<WorkerCaseList />} />
            <Route path="new" element={<WorkerNewCase />} />
          </Route>

          <Route path="/staff" element={<RequireAuth roles={['STAFF', 'ADMIN']}><StaffLayout /></RequireAuth>}>
            <Route index element={<StaffCaseList />} />
            <Route path="cases/:id" element={<StaffCaseDetail />} />
          </Route>

          <Route path="/admin" element={<RequireAuth roles={['ADMIN']}><AdminLayout /></RequireAuth>}>
            <Route index element={<AdminUsers />} />
          </Route>

          <Route path="/change-password" element={<RequireAuth><ChangePassword /></RequireAuth>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
