import React, { useMemo } from 'react';
import { useData } from '../../../contexts/DataContext';
import { isSameTehranDay } from '../../../utils/dateUtils';
import { Priority } from '../../../types';
import { CheckIcon, ListChecksIcon } from '../../../components/icons';
import { WidgetContainer } from './WidgetContainer';

const formatTime = (dateInput: Date | string) => {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (!date || isNaN(date.getTime())) return '—';
  const hours = date.getHours();
  const minutes = date.getMinutes();
  if (hours === 0 && minutes === 0) return '—';
  const formattedHours = String(hours).padStart(2, '0').replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d)]);
  const formattedMinutes = String(minutes).padStart(2, '0').replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d)]);
  return `${formattedHours}:${formattedMinutes}`;
};

export const TodaysPlan: React.FC = () => {
  const { tasks, selectedDate, toggleTaskCompletion } = useData();

  const todaysTasks = useMemo(() => {
    return tasks
      .filter(t => t.due_date && isSameTehranDay(t.due_date, selectedDate))
      .sort((a, b) => (a.status === 'done' ? 1 : 0) - (b.status === 'done' ? 1 : 0));
  }, [tasks, selectedDate]);

  return (
    <WidgetContainer>
      <h2 className="text-lg font-bold text-[var(--text-main)] mb-4">برنامه امروز</h2>
      {todaysTasks.length > 0 ? (
        <div className="max-h-64 overflow-y-auto pl-2 space-y-3">
          {todaysTasks.map((task, index) => {
            const isLast = index === todaysTasks.length - 1;
            return (
              <div 
                key={task.id} 
                className={`relative flex gap-3 items-stretch pb-3 ${task.status === 'done' ? 'opacity-60' : ''}`}
              >
                {/* Time Column (Right) */}
                <div className="w-12 flex items-start justify-end pt-3 shrink-0">
                  <span className="font-mono font-bold text-xs text-[var(--text-muted)]">
                    {task.due_date ? formatTime(task.due_date) : '—'}
                  </span>
                </div>
                
                {/* Axis Column (Middle) */}
                <div className="relative flex flex-col items-center w-6 shrink-0">
                  {!isLast && <div className="absolute top-3 bottom-0 w-[1.5px] bg-[var(--border-subtle)]"></div>}
                  {task.status === 'done' ? (
                    <div className="absolute top-3 z-10 w-4 h-4 rounded-full bg-[var(--semantic-success)] text-white flex items-center justify-center border-2 border-[var(--border-subtle)]">
                      <CheckIcon className="w-2.5 h-2.5 text-white stroke-[3px]" />
                    </div>
                  ) : (
                    <div className="absolute top-3 z-10 w-4 h-4 rounded-full bg-[var(--color-primary)] text-black flex items-center justify-center border-2 border-[var(--border-subtle)]">
                      <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
                    </div>
                  )}
                </div>

                {/* Card Column (Left) */}
                <div className="flex-1 bg-[var(--bg-card)] backdrop-blur-xl border border-[var(--border-subtle)] p-3 rounded-[var(--radius-md)] flex items-center gap-3">
                  <button
                    onClick={() => toggleTaskCompletion(task.id)}
                    className={`task-check w-5 h-5 shrink-0 rounded-full border-[1.5px] flex items-center justify-center transition ${task.status === 'done' ? 'is-done' : 'border-[var(--text-muted)] hover:border-[var(--text-main)]'}`}
                    aria-label={task.status === 'done' ? `لغو انجام ${task.title}` : `انجام ${task.title}`}
                  >
                    {task.status === 'done' && <CheckIcon className="w-3 h-3 text-black stroke-[3px]"/>}
                  </button>
                  <span className={`flex-1 text-sm ${task.status === 'done' ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-main)]'}`}>
                    {task.title}
                  </span>
                  <div 
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      task.priority === Priority.High 
                        ? 'bg-error shadow-[0_0_8px_rgb(var(--error-rgb)/0.5)]' 
                        : task.priority === Priority.Medium 
                        ? 'bg-warning shadow-[0_0_8px_rgb(var(--warning-rgb)/0.5)]' 
                        : 'bg-primary/80 shadow-[0_0_8px_rgb(var(--color-primary-rgb)/0.3)]'
                    }`}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10 text-[var(--text-muted)] text-sm">
          <ListChecksIcon className="w-10 h-10 mx-auto mb-2 text-[var(--text-muted)] opacity-60" />
          <p>در این تاریخ کاری ثبت نشده است.</p>
        </div>
      )}
    </WidgetContainer>
  );
};
