import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useData } from '../../../contexts/DataContext';
import { UserIcon } from '../../../components/icons';

interface DashboardHeaderProps {
  onOpenProfile: () => void;
  todayProgress: number;
  hasTasksToday: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onOpenProfile,
  todayProgress,
  hasTasksToday,
}) => {
  const { user } = useAuth();
  const { profile } = useData();
  
  const size = 44; 
  const strokeWidth = 3; 
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (todayProgress / 100) * circumference;
  
  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('hexer-theme', isDark ? 'dark' : 'light');
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', isDark ? '#121212' : '#F4F5F7');
  };
  
  const displayName = (profile?.full_name || user?.user_metadata?.full_name || user?.user_metadata?.name || '').trim();
  const avatarLetter = displayName ? displayName.charAt(0).toUpperCase() : null;
  const firstName = displayName ? displayName.split(/\s+/)[0] : 'رفیق';
  
  const isComplete = hasTasksToday && todayProgress === 100;
  
  return (
    <header className="pt-8 pb-4 px-5 sticky top-0 z-20 backdrop-blur-xl border-b border-[var(--border-subtle)] bg-[var(--bg-app-glass)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Right Side: Profile & Greeting (RTL Start) */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenProfile}
            className="relative group flex items-center justify-center cursor-pointer select-none"
            style={{ width: size, height: size }}
            aria-label="پروفایل کاربری"
          >
            {/* Neon Progress Ring SVG */}
            <svg 
              className="absolute inset-0 transform -rotate-90 overflow-visible" 
              width={size} 
              height={size}
            >
              {/* Track */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="var(--border-subtle)"
                strokeWidth={strokeWidth}
                fill="none"
              />
              {/* Progress */}
              {hasTasksToday && (
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke="var(--color-primary)"
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  style={{ 
                    transition: 'stroke-dashoffset 1s ease-out',
                  }}
                />
              )}
            </svg>

            {/* Avatar - w-10 = 40px */}
            <div className="w-10 h-10 bg-[var(--text-main)] rounded-full flex items-center justify-center text-[var(--bg-app-glass)] font-bold text-sm overflow-hidden relative z-10 border border-[var(--border-subtle)]">
              {avatarLetter || <UserIcon className="w-5 h-5"/>}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </button>
          
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme}
            className="theme-toggle w-10 h-10 rounded-full glass-card flex items-center justify-center"
            aria-label="تغییر تم"
          >
            {/* Sun Icon */}
            <svg className="theme-icon-light w-5 h-5 text-[var(--text-main)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
            </svg>
            {/* Moon Icon */}
            <svg className="theme-icon-dark w-5 h-5 text-[var(--text-main)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>
          
          <div className="flex flex-col justify-center">
            <span className="text-[12px] font-bold text-[var(--text-muted)] leading-none">سلام {firstName}</span>
            <span className="text-[10px] font-medium text-[var(--text-muted)] mt-1 leading-none">
              {hasTasksToday 
                ? (isComplete ? 'همه کارها تموم شد! 🎉' : `${todayProgress}% کارهای انجام‌شده`) 
                : 'برنامه‌ای برای این تاریخ ثبت نشده'}
            </span>
          </div>
        </div>

        {/* Left Side: Brand (RTL End) */}
        <div>
          <h1 className="font-black tracking-tight text-[22px] text-[var(--text-main)] select-none">
            HEXER
          </h1>
        </div>
      </div>
    </header>
  );
};
