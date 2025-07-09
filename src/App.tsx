import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProtectedRoute from './routes/ProtectedRoute';
import MainLayout from './components/common/MainLayout';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import DashboardPage from './pages/DashboardPage';
import ContentCalendarPage from './pages/ContentCalendarPage';
import TasksPage from './pages/TasksPage';
import ContentPage from './pages/ContentPage';
import SettingsPage from './pages/SettingsPage';
import DataManagementPage from './pages/DataManagementPage';
import NotFoundPage from './pages/NotFoundPage';
import { useResponsiveLayout } from './hooks/useResponsiveLayout';

// Create a React Query client
const queryClient = new QueryClient();

// Create router with routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
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
        path: '/dashboard',
        element: (
          <MainLayout>
            <DashboardPage />
          </MainLayout>
        ),
      },
      {
        path: '/chat',
        element: (
          <MainLayout>
            <ChatPage />
          </MainLayout>
        ),
      },
      {
        path: '/calendar',
        element: (
          <MainLayout>
            <ContentCalendarPage />
          </MainLayout>
        ),
      },
      {
        path: '/tasks',
        element: (
          <MainLayout>
            <TasksPage />
          </MainLayout>
        ),
      },
      {
        path: '/content/all',
        element: (
          <MainLayout>
            <ContentPage type="all" />
          </MainLayout>
        ),
      },
      {
        path: '/content/posted',
        element: (
          <MainLayout>
            <ContentPage type="Posted" />
          </MainLayout>
        ),
      },
      {
        path: '/content/scheduled-for-publishing',
        element: (
          <MainLayout>
            <ContentPage type="Scheduled for Publishing" />
          </MainLayout>
        ),
      },
      {
        path: '/content/review',
        element: (
          <MainLayout>
            <ContentPage type="Review" />
          </MainLayout>
        ),
      },
      {
        path: '/content/approved-for-publishing',
        element: (
          <MainLayout>
            <ContentPage type="Approved for Publishing" />
          </MainLayout>
        ),
      },
      {
        path: '/content/reject',
        element: (
          <MainLayout>
            <ContentPage type="Reject" />
          </MainLayout>
        ),
      },
      {
        path: '/settings/integrations',
        element: (
          <MainLayout>
            <SettingsPage type="integrations" />
          </MainLayout>
        ),
      },
      {
        path: '/settings/account',
        element: (
          <MainLayout>
            <SettingsPage type="account" />
          </MainLayout>
        ),
      },
      {
        path: '/settings/advanced',
        element: (
          <MainLayout>
            <SettingsPage type="advanced" />
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
