/**
 * Collapsible sidebar navigation
 * 
 * Features:
 * - Icon-only mode when collapsed
 * - Smooth transitions
 * - Dark mode support
 */

import { Link, useLocation } from 'react-router-dom';
import { Home, Search, CheckSquare, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed }: SidebarProps) {
  const location = useLocation();

  // Navigation items
  const navItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: Home,
    },
    {
      label: 'Discover',
      href: '/discover',
      icon: Search,
    },
    {
      label: 'Hosts',
      href: '/hosts',
      icon: Users,
    },
    {
      label: 'Tasks',
      href: '/tasks',
      icon: CheckSquare,
    },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <aside
      className={`bg-white dark:bg-slate-900 border-r dark:border-slate-700 transition-all duration-300 ease-in-out flex flex-col ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo / Branding */}
      <div className="h-16 border-b dark:border-slate-700 flex items-center justify-center px-4">
        <Link to="/" className="font-bold text-lg text-gray-900 dark:text-white truncate">
          {collapsed ? '◉' : 'Shiryoku'}
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link key={item.href} to={item.href}>
              <Button
                variant={active ? 'default' : 'ghost'}
                className={`w-full justify-start ${collapsed ? 'px-0' : ''} ${
                  active
                    ? 'bg-blue-600 text-white dark:bg-blue-600'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                }`}
                title={item.label}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span className="ml-3">{item.label}</span>}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* User Profile (Optional) */}
      <div className="border-t dark:border-slate-700 p-3">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-700 dark:text-gray-300"
        >
          <div className="w-5 h-5 rounded-full bg-blue-500 flex-shrink-0" />
          {!collapsed && <span className="ml-3 text-sm truncate">Profile</span>}
        </Button>
      </div>
    </aside>
  );
}
