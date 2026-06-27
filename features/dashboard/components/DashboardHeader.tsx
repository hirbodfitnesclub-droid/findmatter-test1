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
  
  const displayName = (profile?.full_name || user?.user_metadata?.full_name || user?.user_metadata?.name || '').trim();
  const avatarLetter = displayName ? displayName.charAt(0).toUpperCase() : null;
  const firstName = displayName ? displayName.split(/\s+/)[0] : 'رفیق';
  
  const size = 44; 
  const strokeWidth = 3; 
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (todayProgress / 100) * circumference;
  
  const isComplete = hasTasksToday && todayProgress === 100;
  
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl border-b border-[var(--border-subtle)] transition-all duration-300 pt-safe bg-[var(--bg-app-glass)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Right Side: Profile & Greeting (RTL Start) */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onOpenProfile}
            className="relative group flex items-center justify-center before:content-[''] before:absolute before:inset-[-8px] before:pointer-events-auto cursor-pointer"
            style={{ width: size, height: size }}
            aria-label="پروفایل کاربری"
          >
            {/* Neon Progress Ring SVG */}
            <svg 
              className="absolute inset-0 transform -rotate-90 overflow-visible" 
              width={size} 
              height={size}
              style={{ filter: isComplete ? 'drop-shadow(0 0 4px rgba(16,185,129,0.4))' : 'drop-shadow(0 0 4px rgba(216,240,102,0.4))' }}
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
                  stroke={isComplete ? "var(--semantic-success)" : "var(--color-primary)"}
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
          
          <div className="flex flex-col justify-center">
            <span className="text-[var(--text-main)] font-bold text-sm sm:text-base leading-none">سلام {firstName}</span>
            <span className="text-[var(--text-muted)] text-[10px] font-medium mt-1 leading-none">
              {hasTasksToday 
                ? (isComplete ? 'همه کارها تموم شد! 🎉' : `${todayProgress}% کارهای انجام‌شده`) 
                : 'برنامه‌ای برای این تاریخ ثبت نشده'}
            </span>
          </div>
        </div>

        {/* Left Side: Brand (RTL End) */}
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tighter text-[var(--text-main)] select-none">
            HEXER
          </h1>
        </div>
      </div>
    </header>
  );
};
