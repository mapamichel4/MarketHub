import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthPage } from './components/auth/AuthPage';
import { useAuthStore } from './store/authStore';
import '@progress/kendo-theme-default/dist/all.css';
import './styles/theme.css';
import './App.css';

const queryClient = new QueryClient();

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <QueryClientProvider client={queryClient}>
      {isAuthenticated ? (
        <div className="p-8">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>MarketHub Dashboard</h1>
          <p style={{ color: 'var(--text-light)' }}>Welcome to MarketHub!</p>
        </div>
      ) : (
        <AuthPage />
      )}
    </QueryClientProvider>
  );
}

export default App
