import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AppRoutes } from '@/routes';
import { useEffect } from 'react';
import { useThemeStore } from '@/stores/theme.store';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 5 * 60 * 1000, retry: 1 },
  },
});

function ThemeInit() {
  const theme = useThemeStore((s) => s.theme);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  return null;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeInit />
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#22272A',
              color: '#F5F1E8',
              border: '1px solid #343A3C',
              fontSize: '13px',
              fontFamily: "'DM Sans', sans-serif",
              borderRadius: '12px',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)',
            },
            success: {
              iconTheme: {
                primary: '#5F8F72',
                secondary: '#171A1D',
              },
            },
            error: {
              iconTheme: {
                primary: '#B85C4A',
                secondary: '#171A1D',
              },
            },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
