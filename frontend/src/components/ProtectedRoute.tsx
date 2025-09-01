import { Navigate, Outlet, useLocation } from 'react-router-dom';

const isAuthed = () => !!localStorage.getItem('token');
const isOnboardingCompleted = () => localStorage.getItem('onboardingCompleted') === 'true';

const ProtectedRoute = () => {
  const location = useLocation();
  if (!isAuthed()) return <Navigate to="/login" replace />;
  const onboardingDone = isOnboardingCompleted();
  const onOnboardingRoute = location.pathname === '/onboarding';
  if (!onboardingDone && !onOnboardingRoute) {
    return <Navigate to="/onboarding" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
