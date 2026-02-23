import { Navigate } from 'react-router-dom';
import { Dashboard } from '@/pages/dashboard';

/**
 * Main route configuration
 * 
 * Routes are organized with:
 * - Root path redirects to /dashboard
 * - /dashboard renders the Dashboard page
 */
export const routes = [
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  // TODO: Add additional routes here as needed
  // Examples:
  // {
  //   path: '/hosts',
  //   element: <HostsPage />,
  // },
  // {
  //   path: '/scans',
  //   element: <ScansPage />,
  // },
];
