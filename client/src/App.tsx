// client/src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
// import ProductCatalog from './pages/ProductCatalog';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route 
            path="/login" 
            element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} 
          />
          <Route 
            path="/register" 
            element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/" />} 
          />
          {/* <Route 
            path="/" 
            element={isAuthenticated ? <ProductCatalog /> : <Navigate to="/login" />} 
          /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;