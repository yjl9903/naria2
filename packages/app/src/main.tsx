import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, useNavigate } from 'react-router-dom';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import './styles/main.css';
import App from './App.tsx';
import Connect from './pages/Connect.tsx';
import { useAria2 } from './aria2.ts';
import { Toaster } from '@/components/ui/toaster';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App></App>,
    errorElement: <ErrorBoundary></ErrorBoundary>
  },
  {
    path: '/connect',
    element: <Connect></Connect>
  }
]);

function ErrorBoundary() {
  // const error = useRouteError();
  const navigate = useNavigate();
  const { client } = useAria2();
  useEffect(() => {
    if (client) {
      navigate('/');
    } else {
      navigate('/connect');
    }
  }, [client]);

  return null;
}

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster></Toaster>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
