import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from './components/ui/sonner';
import './index.css';
import GlobalStyle from './style/index.ts';
import Header from './components/header';
import { BrowserRouter, useLocation } from 'react-router-dom';

import { AppProvider } from './contexts/AppContext.tsx';
import AppRoutes from './routes/index.tsx';

function Layout() {
  const location = useLocation();
  const hideHeader =
    location.pathname === '/' ||
    location.pathname === '/register' ||
    location.pathname === '/gamer';

  // Inicializa o tema ao carregar a aplicação
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <AppProvider>
      <GlobalStyle />
      {!hideHeader && <Header />}
      <AppRoutes />
      <Toaster position='top-right' richColors closeButton />
    </AppProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  </StrictMode>
);
