import React, { useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { isSameTehranDay } from '../../utils/dateUtils';
import { WeeklyReportModal } from './components/WeeklyReportModal';

// Feature subcomponents
import { DashboardHeader } from './components/DashboardHeader';
import { WeekCalendar } from './components/WeekCalendar';
import { TodaysPlan } from './components/TodaysPlan';
import { QuickCapture } from './components/QuickCapture';
import { StatsOverview } from './components/StatsOverview';
import { KeyProjects } from './components/KeyProjects';
import { ProductivityChart } from './components/ProductivityChart';
import { FocusTimer } from './components/FocusTimer';

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const {
    tasks,
    selectedDate,
    setSelectedDate,
    subscription,
    profile,
    onTriggerUpgrade,
  } = useData();

  const [isReportOpen, setIsReportOpen] = useState(false);

  // Calculate selected day's progress for the Header Ring
  const selectedDayProgressStats = useMemo(() => {
    const dayTasks = tasks.filter(t => 
      t.due_date && isSameTehranDay(t.due_date, selectedDate)
    );
    const total = dayTasks.length;
    const completed = dayTasks.filter(t => t.status === 'done').length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { progress, hasTasks: total > 0 };
  }, [tasks, selectedDate]);

  return (
    <div className="pb-2">
      {/* هدر موبایل — فقط موبایل. پروفایل از طریق CustomEvent باز می‌شود (ProfileModal گلوبال در App است) */}
      <div className="lg:hidden">
        <DashboardHeader 
          onOpenProfile={() => window.dispatchEvent(new CustomEvent('hexer:open-profile'))} 
          todayProgress={selectedDayProgressStats.progress}
          hasTasksToday={selectedDayProgressStats.hasTasks}
        />
      </div>
      
      <div className="px-4 sm:px-6 max-w-[1280px] mx-auto pt-5 space-y-6">
        {/* گریدِ داشبورد: موبایل ۱ ستون، دسکتاپ ۲ ستون (سایدبار از App می‌آید، نه اینجا) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 lg:gap-6">
          
          {/* ستون مرکز فرمان */}
          <div className="space-y-6 min-w-0">
            <QuickCapture />
            <ProductivityChart />
            <TodaysPlan />
          </div>

          {/* ستون بافتار داده */}
          <div className="space-y-6 min-w-0">
            <StatsOverview onOpenWeeklyReport={() => setIsReportOpen(true)} />
            <WeekCalendar selectedDate={selectedDate} onDateChange={setSelectedDate} />
            <KeyProjects />
            <FocusTimer />
          </div>
        </div>
      </div>

      <WeeklyReportModal 
        isOpen={isReportOpen} 
        onClose={() => setIsReportOpen(false)} 
      />
    </div>
  );
};

export default Dashboard;

