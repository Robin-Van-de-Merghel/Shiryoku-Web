/**
 * Root layout component that wraps all pages
 * 
 * Provides:
 * - Collapsible sidebar navigation
 * - Dark mode toggle
 * - Persistent layout state
 */

import { useState, useEffect } from 'react';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sidebar } from './sidebar';

interface RootLayoutProps {
  children: React.ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
    const savedDarkMode = localStorage.getItem('dark-mode') === 'true';
    setSidebarCollapsed(savedCollapsed);
    setDarkMode(savedDarkMode);
  }, []);

  // Save sidebar state
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  // Save dark mode state and apply to document
  useEffect(() => {
    localStorage.setItem('dark-mode', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`flex h-screen ${darkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="border-b bg-white dark:bg-slate-900 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="lg:hidden"
          >
            {sidebarCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
          </Button>

          <div className="flex-1" />

          {/* Dark mode toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDarkMode(!darkMode)}
            className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-gray-50 dark:bg-slate-950">
          {children}
        </div>
      </div>
    </div>
  );
}
