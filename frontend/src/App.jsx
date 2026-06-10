import { BrowserRouter } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AppProviders } from './context/AppProviders.jsx';
import AppRoutes from './routes/AppRoutes.jsx';
import ToastCenter from './components/ToastCenter.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppProviders>
          <AnimatePresence mode="wait">
            <AppRoutes />
          </AnimatePresence>
          <ToastCenter />
        </AppProviders>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
