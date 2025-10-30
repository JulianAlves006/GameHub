import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GlobalStyle from './style/index.ts';
import Header from './components/header';
import { BrowserRouter, useLocation } from 'react-router-dom';

import AppRoutes from './routes/index.tsx';

function Layout() {
  const location = useLocation();
  const hideHeader =
    location.pathname === '/' || location.pathname === '/register';

  return (
    <>
      <GlobalStyle />
      {!hideHeader && <Header />}
      <AppRoutes />
      <ToastContainer
        position='top-right'
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
      />
    </>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  </StrictMode>
);
