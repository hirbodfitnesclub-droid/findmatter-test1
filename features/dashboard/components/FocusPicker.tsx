import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Task, Priority } from '../../../types';
import { getTehranNow, isSameTehranDay } from '../../../utils/dateUtils';
import { ChevronDownIcon } from '../../../components/icons';

interface FocusPickerProps {
  tasks: Task[];
  selectedTask: { id: string | null; title: string } | null;
  onSelect: (task: { id: string | null; title: string }) => void;
}

const priorityConfig: Record<string, { label: string; badge: string }> = {
  [Priority.High]: { label: 'زیاد', badge: 'bg-error/10 text-error border-error/30 dark:border-error/20' },
  [Priority.Medium]: { label: 'متوسط', badge: 'bg-primary/10 text-primary-text border-primary/30 dark:border-primary/20' },
  [Priority.Low]: { label: 'کم', badge: 'bg-primary/10 text-primary-text border-primary/30 dark:border-primary/20' },
};

const priorityWeights: Record<string, number> = {
  [Priority.High]: 3,
  [Priority.Medium]: 2,
  [Priority.Low]: 1,
};

export const FocusPicker: React.FC<FocusPickerProps> = ({ tasks, selectedTask, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Filters: only incomplete tasks (status !== 'done') AND due today OR no due_date (catch-all)
  const todayTasks = useMemo(() => {
    const today = getTehranNow();
    return tasks.filter((t) => {
      if (t.status === 'done') return false;
      return !t.due_date || isSameTehranDay(t.due_date, today);
    });
  }, [tasks]);

  // Sorted by priority (high first)
  const sortedTasks = useMemo(() => {
    return [...todayTasks].sort((a, b) => {
      const weightA = priorityWeights[a.priority] || 0;
      const weightB = priorityWeights[b.priority] || 0;
      return weightB - weightA;
    });
  }, [todayTasks]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full h-[32px] rounded-full bg-white/5 border border-white/10 hover:bg-white/10 px-3.5 flex items-center justify-between text-[11px] font-bold text-white/90 transition active:scale-[0.99] cursor-pointer"
      >
        <span className="truncate max-w-[90%]">{selectedTask?.title ?? 'انتخاب تسک'}</span>
        <ChevronDownIcon className="w-3.5 h-3.5 text-white/50" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 text-white"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-[#1e1e24] border border-white/10 rounded-2xl w-full max-w-sm p-5 flex flex-col max-h-[80vh] text-right shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
              dir="rtl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                <span className="font-black text-sm text-primary-text">انتخاب تسک</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-6 h-6 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Quick Options */}
              <div className="flex flex-col gap-1.5">
                <div className="text-[10px] font-bold text-white/40 mb-1">گزینه‌های سریع</div>
                <button
                  onClick={() => {
                    onSelect({ id: null, title: 'تمرکز آزاد' });
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-start text-right px-3.5 py-2 text-xs font-bold rounded-xl bg-white/5 border border-white/10 hover:bg-primary/10 hover:border-primary/30 transition text-white/90 cursor-pointer min-h-[40px]"
                >
                  <span className="line-clamp-1 text-right w-full leading-normal">تمرکز آزاد</span>
                </button>
                <button
                  onClick={() => {
                    onSelect({ id: null, title: 'مطالعه و یادگیری' });
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-start text-right px-3.5 py-2 text-xs font-bold rounded-xl bg-white/5 border border-white/10 hover:bg-primary/10 hover:border-primary/30 transition text-white/90 cursor-pointer min-h-[40px]"
                >
                  <span className="line-clamp-1 text-right w-full leading-normal">مطالعه و یادگیری</span>
                </button>
              </div>

              <div className="h-px bg-white/5 my-3" />

              {/* Active Tasks List */}
              <div className="flex-1 overflow-y-auto soft-scroll flex flex-col gap-1.5 min-h-0 pr-0.5">
                <div className="text-[10px] font-bold text-white/40 mb-1">کارهای فعال امروز</div>
                {sortedTasks.length > 0 ? (
                  sortedTasks.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        onSelect({ id: t.id, title: t.title });
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center justify-between text-right px-3.5 py-2 text-xs font-bold rounded-xl bg-white/5 hover:bg-primary/10 transition text-white/90 border border-transparent cursor-pointer min-h-[40px] gap-2"
                    >
                      <span className="line-clamp-1 text-right flex-1 leading-normal">{t.title}</span>
                      {t.priority && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${priorityConfig[t.priority]?.badge || 'bg-subtle/10 text-subtle'}`}>
                          {priorityConfig[t.priority]?.label || 'متوسط'}
                        </span>
                      )}
                    </button>
                  ))
                ) : (
                  <div className="text-center py-6 text-xs text-white/30 font-medium">
                    کار فعال یا برنامه‌ریزی شده برای امروز یافت نشد.
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
