
import React from 'react';
import { LogoIcon, SettingsIcon } from './Icons';

interface HeaderProps {
    onSettingsClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSettingsClick }) => {
  return (
    <header className="flex justify-between items-center py-2">
      <div className="flex items-center space-x-2">
        <LogoIcon className="w-8 h-8 text-brand-primary" />
        <span className="text-xl font-bold text-light-text">FitGenie</span>
      </div>
      <button
        onClick={onSettingsClick}
        className="p-2 rounded-full hover:bg-dark-card transition-colors focus:outline-none focus:ring-2 focus:ring-brand-secondary"
        aria-label="Open settings"
      >
        <SettingsIcon className="w-6 h-6 text-medium-text" />
      </button>
    </header>
  );
};

export default Header;
