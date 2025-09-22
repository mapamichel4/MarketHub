// src/components/layout/Header.tsx
import { useState } from 'react';
import { Drawer, DrawerContent } from '@progress/kendo-react-layout';
import { Button } from '@progress/kendo-react-buttons';
import { useAuthStore } from '../../store/authStore';
import { KendoButton } from '../ui/KendoButton';
import { useTheme } from '../../theme/ThemeProvider';

export const Header: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    setDrawerVisible(false);
  };

  const menuItems = [
    { text: 'Accueil', path: '/' },
    { text: 'Mes Produits', path: '/my-products' },
    { text: 'Messages', path: '/messages' },
  ];

  return (
    <header className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button
              icon="menu"
              look="flat"
              onClick={() => setDrawerVisible(true)}
              className="md:hidden"
            />
            <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">
              MARCHÉHUB
            </h1>
          </div>

          <nav className="hidden md:flex space-x-6">
            {menuItems.map(item => (
              <a
                key={item.path}
                href={item.path}
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                {item.text}
              </a>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <Button
              icon={theme === 'dark' ? 'sun' : 'moon'}
              look="flat"
              onClick={toggleTheme}
              title="Changer de thème"
            />
            
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {user.name}
                </span>
                <KendoButton
                  variant="secondary"
                  size="sm"
                  onClick={handleLogout}
                >
                  Déconnexion
                </KendoButton>
              </div>
            ) : (
              <div className="flex space-x-2">
                <KendoButton
                  variant="secondary"
                  size="sm"
                  onClick={() => (window.location.href = '/login')}
                >
                  Connexion
                </KendoButton>
                <KendoButton
                  size="sm"
                  onClick={() => (window.location.href = '/register')}
                >
                  Inscription
                </KendoButton>
              </div>
            )}
          </div>
        </div>
      </div>

      <Drawer
        expanded={drawerVisible}
        position="start"
        onOverlayClick={() => setDrawerVisible(false)}
      >
        <DrawerContent>
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Navigation</h2>
            <nav className="space-y-2">
              {menuItems.map(item => (
                <a
                  key={item.path}
                  href={item.path}
                  className="block py-2 px-3 text-gray-700 hover:bg-gray-100 rounded"
                  onClick={() => setDrawerVisible(false)}
                >
                  {item.text}
                </a>
              ))}
            </nav>
          </div>
        </DrawerContent>
      </Drawer>
    </header>
  );
};