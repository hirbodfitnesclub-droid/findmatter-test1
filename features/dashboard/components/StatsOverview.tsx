import React, { useMemo } from 'react';
import { useData } from '../../../contexts/DataContext';
import { getTehranDateString, compareTehranDates, isSameTehranDay } from '../../../utils/dateUtils';
import { Priority } from '../../../types';
import { WidgetContainer } from './WidgetContainer';

interface StatsOverviewProps {
  onOpenWeeklyReport: () => void;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ onOpenWeeklyReport }) => {
  const { tasks, projects, selectedDate } = useData();

  const stats = useMemo(() => {
    const todayStr = getTehranDateString(new Date());

    const overdue = tasks.filter(t => 
      t.status !== 'done' && 
      t.due_date && 
      compareTehranDates(t.due_date, todayStr) < 0
    ).length;

    const highPriorityProjects = projects.filter(p => 
      p.priority === Priority.High || p.priority === 'high'
    ).length;

    const completedToday = tasks.filter(t => 
      t.status === 'done' && 
      t.due_date && 
      isSameTehranDay(t.due_date, new Date())
    ).length;

    const inbox = tasks.filter(t => 
      t.status !== 'done' && 
      !t.due_date
    ).length;

    return { overdue, highPriorityProjects, completedToday, inbox };
  }, [tasks, projects]);

  const totalTodayTasks = useMemo(() => {
    return tasks.filter(t => 
      t.due_date && isSameTehranDay(t.due_date, new Date())
    ).length;
  }, [tasks]);

  const progress = useMemo(() => {
    const dayTasks = tasks.filter(t => 
      t.due_date && isSameTehranDay(t.due_date, selectedDate)
    );
    const total = dayTasks.length;
    const completed = dayTasks.filter(t => t.status === 'done').length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }, [tasks, selectedDate]);

  const strokeDashoffset = useMemo(() => {
    return 219.9 - (219.9 * progress) / 100;
  }, [progress]);

  const inProgressPercent = useMemo(() => {
    return totalTodayTasks > 0 ? Math.round(((totalTodayTasks - stats.completedToday) / totalTodayTasks) * 100) : 0;
  }, [totalTodayTasks, stats.completedToday]);

  const nonHighPriorityProjectsPercent = useMemo(() => {
    return projects.length > 0 ? Math.round(((projects.length - stats.highPriorityProjects) / projects.length) * 100) : 0;
  }, [projects.length, stats.highPriorityProjects]);

  return (
    <WidgetContainer className="flex gap-3 h-[145px] !p-0 !bg-transparent !border-none !backdrop-blur-none !shadow-none">
      {/* Box 1: Weekly Status */}
      <div className="w-[110px] shrink-0 rounded-[var(--radius-lg)] p-3 flex flex-col items-center justify-between relative hover:-translate-y-[2px] transition-all duration-200 bg-[var(--ink-bg)] border border-[var(--border-neon)] shadow-sm">
        <h4 className="text-[11px] font-bold text-center">وضعیت هفته</h4>
        
        <div className="relative w-[68px] h-[68px] shrink-0 my-1">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="35" fill="none" stroke="var(--border-subtle)" strokeWidth="14" className="stroke-[var(--border-subtle)]" />
            <circle 
              className="ring-fill transition-all duration-1000 ease-out" 
              cx="50" 
              cy="50" 
              r="35" 
              fill="none" 
              stroke="var(--color-primary)" 
              strokeWidth="14" 
              strokeLinecap="round" 
              strokeDasharray="219.9" 
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-[13px] font-black mt-0.5">
            {progress}%
          </div>
        </div>

        <button 
          onClick={onOpenWeeklyReport} 
          className="w-full max-w-[80px] bg-primary text-[var(--text-on-primary)] text-[10px] font-bold py-1.5 rounded-full hover:scale-105 active:scale-95 transition shadow-sm"
        >
          مشاهده
        </button>
      </div>

      {/* Box 2: Today at a Glance */}
      <div className="tile-lime flex-1 rounded-[var(--radius-lg)] p-3 relative flex flex-col justify-between hover:-translate-y-[2px] transition-all duration-200 shadow-sm text-[var(--text-on-primary)]">
        <div className="text-right pr-1">
          <h3 className="font-black text-[13px]">کارهای امروز در یک نگاه</h3>
        </div>
        
        <div className="flex flex-col gap-1.5 mt-1">
          {/* Row 1 */}
          <div className="flex items-center gap-1.5 w-full">
            <div className="bg-[#16161A] text-white rounded-full h-[24px] flex-1 flex items-center px-3 justify-start text-[11px] font-bold">
              تعداد: {stats.completedToday}/{totalTodayTasks}
            </div>
            <div 
              className="border-[1.5px] border-dashed border-black/40 rounded-full h-[24px] shrink-0" 
              style={{ width: `${inProgressPercent}%` }}
            ></div>
          </div>
          
          {/* Row 2 */}
          <div className="flex items-center gap-1.5 w-full">
            <div className="bg-[#16161A] text-white rounded-full h-[24px] flex-1 flex items-center px-3 justify-start text-[11px] font-bold">
              مهم: {stats.highPriorityProjects}/{projects.length}
            </div>
            <div 
              className="border-[1.5px] border-dashed border-black/40 rounded-full h-[24px] shrink-0" 
              style={{ width: `${nonHighPriorityProjectsPercent}%` }}
            ></div>
          </div>
          
          {/* Row 3 */}
          <div className="bg-[#16161A] rounded-full h-[24px] w-full flex items-center justify-between p-[2px]">
            <div className="text-white text-[11px] font-bold pr-2.5">
              عقب افتاده: {stats.overdue}
            </div>
            <button className="text-white/80 hover:text-white hover:scale-110 active:scale-95 transition p-1 ml-1" title="مشاهده">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-start gap-3 pt-1">
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full border-[1.5px] border-dashed border-black shrink-0"></div>
            <span className="text-[9px] font-bold text-black/80">در حال انجام</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-black shrink-0"></div>
            <span className="text-[9px] font-bold text-black">انجام شده</span>
          </div>
        </div>
      </div>
    </WidgetContainer>
  );
};
