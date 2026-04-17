/**
 * SidebarOrganism Component
 * 
 * Main sidebar navigation for the protected layout.
 * Displays navigation menu, logo, support card, and logout button.
 * 
 * This is a presentational organism - all data and callbacks come from props.
 * No business logic, no API calls, no auth context usage.
 * 
 * @param navItems - Array of navigation items with icons and labels
 * @param currentPath - Current active route path
 * @param onNavigate - Callback when navigation item is clicked
 * @param onLogout - Callback when logout is clicked
 * @param onSupport - Callback when support button is clicked
 */

import { useTranslation } from 'react-i18next';
import { LucideIcon, LogOut } from 'lucide-react';
import { Logo } from '../atoms/Logo';
import { NavMenuItem } from '../molecules/NavMenuItem';
import { SupportCard } from '../molecules/SupportCard';

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
}

interface SidebarOrganismProps {
  navItems: NavItem[];
  currentPath: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
  onSupport?: () => void;
}

export function SidebarOrganism({
  navItems,
  currentPath,
  onNavigate,
  onLogout,
  onSupport,
}: SidebarOrganismProps) {
  const { t } = useTranslation();

  return (
    <aside
      className="w-[240px] h-full bg-white rounded-[24px] shadow-[0px_6px_58px_0px_rgba(196,203,214,0.1)] flex flex-col"
      role="navigation"
      aria-label={t('aria.mainNav')}
    >
      {/* Logo Section */}
      <div className="pt-8 pb-6 px-6">
        <Logo variant="horizontal" />
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-2 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavMenuItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              isActive={currentPath === item.path}
              onClick={() => onNavigate(item.path)}
              href={item.path}
            />
          ))}
        </div>
      </nav>

      {/* Sidebar Footer */}
      <div className="mt-auto pb-6">
        {/* Support Card */}
        <div className="mb-4">
          <SupportCard
            onSupportClick={onSupport}
            buttonLabel={t('nav.support')}
          />
        </div>

        {/* Logout Button */}
        <div className="px-4">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-[#7d8592] hover:text-foreground hover:bg-accent rounded-[10px] transition-all text-[16px] font-semibold"
          >
            <LogOut className="w-6 h-6" />
            <span>{t('nav.logout')}</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
