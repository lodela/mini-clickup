/**
 * HeaderOrganism Component
 * 
 * Main header for the protected layout.
 * Contains search input, notifications, and user menu.
 * 
 * This is a presentational organism - all data and callbacks come from props.
 * No business logic, no API calls.
 * 
 * @param user - Current user data
 * @param notificationCount - Number of unread notifications
 * @param onSearch - Callback when search input changes
 * @param onNotificationClick - Callback when notification bell is clicked
 * @param userMenuItems - Items for the user dropdown menu
 */

import { useTranslation } from 'react-i18next';
import { SearchInput } from '../atoms/SearchInput';
import { NotificationBell } from '../atoms/NotificationBell';
import { UserMenuDropdown } from '../molecules/UserMenuDropdown';
import { LanguageSwitcher } from '../atoms/LanguageSwitcher';

interface HeaderOrganismProps {
  user: {
    name: string;
    email?: string;
    photo?: string;
  };
  notificationCount?: number;
  onSearch?: (value: string) => void;
  onNotificationClick?: () => void;
  userMenuItems: Array<{
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  }>;
}

export function HeaderOrganism({
  user,
  notificationCount = 0,
  onSearch,
  onNotificationClick,
  userMenuItems,
}: HeaderOrganismProps) {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (language: 'es' | 'en') => {
    i18n.changeLanguage(language);
  };

  return (
    <header
      className="h-[64px] px-6 flex items-center justify-between gap-4"
      role="banner"
    >
      {/* Search Input */}
      <div className="flex-1 max-w-[480px]">
        <SearchInput
          placeholder={t('header.search')}
          onChange={onSearch}
          ariaLabel={t('aria.globalSearch')}
        />
      </div>

      {/* Right Section: Notifications + User Menu */}
      <div className="flex items-center gap-4">
        {/* Language Switcher */}
        <LanguageSwitcher
          currentLanguage={i18n.language as 'es' | 'en'}
          onLanguageChange={handleLanguageChange}
        />
        
        <NotificationBell
          count={notificationCount}
          onClick={onNotificationClick}
          ariaLabel={t('aria.notificationsCount', { count: notificationCount })}
        />
        
        <UserMenuDropdown
          user={user}
          menuItems={userMenuItems}
        />
      </div>
    </header>
  );
}