import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProtectedRoute from './routes/ProtectedRoute';
import MainLayout from './components/common/MainLayout';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import DataManagementPage from './pages/DataManagementPage';
import NotFoundPage from './pages/NotFoundPage';
import { useResponsiveLayout } from './hooks/useResponsiveLayout';

// Create a React Query client
const queryClient = new QueryClient();

// Create router with routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/chat" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    // Protected routes
    element: <ProtectedRoute />,
    children: [
      {
        path: '/chat',
        element: (
          <MainLayout>
            <ChatPage />
          </MainLayout>
        ),
      },
      {
        path: '/data',
        element: (
          <MainLayout>
            <DataManagementPage />
          </MainLayout>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

function App() {
  // Setup responsive layout detection
  useResponsiveLayout();

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
