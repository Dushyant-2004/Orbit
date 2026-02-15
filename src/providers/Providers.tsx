'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { AuthProvider } from './AuthProvider';
import { CartProvider } from './CartProvider';
import { AuthGate } from '@/components/ui/AuthGate';

interface ProvidersProps {
  children: React.ReactNode;
}

// Theme Context
interface ThemeContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const saved = localStorage.getItem('orbit-theme') as 'dark' | 'light' | null;
    if (saved) setTheme(saved);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('orbit-theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Main Providers Component
export function Providers({ children }: ProvidersProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show matching dark background during hydration (Preloader will handle actual loading)
  if (!mounted) {
    return (
      <div 
        className="fixed inset-0 z-[9999]"
        style={{
          background: 'radial-gradient(ellipse at center, #0a0a1a 0%, #000000 100%)',
        }}
      />
    );
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <AuthGate>
            {children}
          </AuthGate>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
