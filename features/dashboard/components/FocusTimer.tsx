import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useData } from '../../../contexts/DataContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ClockIcon, 
  PlayIcon, 
  PauseIcon, 
  RotateCcwIcon, 
  ChevronDownIcon, 
  ChevronUpIcon, 
  SparklesIcon 
} from '../../../components/icons';

export const FocusTimer: React.FC = () => {
  const { tasks } = useData();

  const FOCUS_SECONDS = 25 * 60;
  const BREAK_SECONDS = 5 * 60;

  const [timeLeft, setTimeLeft] = useState(FOCUS_SECONDS);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter tasks to only show incomplete ones
  const activeTasks = useMemo(() => {
    return tasks.filter((t) => t.status !== 'done');
  }, [tasks]);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Timer interval with cleanup
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            // Toggle modes on complete
            if (!isBreak) {
              setIsBreak(true);
              return BREAK_SECONDS;
            } else {
              setIsBreak(false);
              return FOCUS_SECONDS;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, isBreak]);

  // Toggle mode manually
  const handleToggleMode = () => {
    setIsRunning(false);
    if (isBreak) {
      setIsBreak(false);
      setTimeLeft(FOCUS_SECONDS);
    } else {
      setIsBreak(true);
      setTimeLeft(BREAK_SECONDS);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className="bg-[#16161a] border border-white/10 text-white rounded-[var(--radius-lg)] p-4 relative overflow-hidden min-h-[160px] flex flex-col justify-between dark:border-[var(--border-neon)] dark:shadow-[0_0_20px_rgb(var(--color-primary-rgb)/0.15)] mt-auto"
      id="focus-timer-widget"
    >
      {/* Abstract background halo */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#16161a] via-black/20 to-white/5 opacity-40 pointer-events-none"></div>
      
      {/* Blur Glow Effect */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/5 dark:bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Row: Title & Enter Zen Mode */}
      <div className="flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-1.5 text-white/50 text-[11px] font-bold">
          <ClockIcon className="w-3.5 h-3.5 text-primary" />
          <span className="tracking-wider text-[11px] font-black text-white">
            {isBreak ? 'استراحت کوتاه' : 'تمرکز عمیق'}
          </span>
        </div>
        <button
          onClick={() => setIsZenMode(true)}
          className="bg-lime text-black hover:bg-[var(--color-primary-hover)] text-[11px] font-extrabold px-3 py-1 rounded-full active:scale-95 transition-transform"
        >
          ورود
        </button>
      </div>

      {/* Middle Row: Digital Clock & Main Action Buttons */}
      <div className="flex items-center justify-between z-10 my-2">
        <span className="text-white text-3xl font-black font-mono tracking-widest tabular-nums leading-none">
          {formatTime(timeLeft)}
        </span>

        <div className="flex items-center gap-2">
          {/* Reset Button */}
          <button
            onClick={() => {
              setIsRunning(false);
              setTimeLeft(isBreak ? BREAK_SECONDS : FOCUS_SECONDS);
            }}
            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 flex items-center justify-center transition active:scale-95"
            title="ریست تایمر"
          >
            <RotateCcwIcon className="w-4 h-4" />
          </button>
          
          {/* Play/Pause Button */}
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="w-8 h-8 rounded-full bg-lime text-black flex items-center justify-center transition hover:scale-105 active:scale-95 shadow-[0_0_15px_rgb(var(--color-primary-rgb)/0.3)]"
          >
            {isRunning ? (
              <PauseIcon className="w-3.5 h-3.5 fill-current text-black" />
            ) : (
              <PlayIcon className="w-3.5 h-3.5 fill-current text-black ml-0.5" />
            )}
          </button>
        </div>
      </div>

      {/* Bottom Row: Custom Task Selection Dropdown */}
      <div className="relative z-20 shrink-0" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full h-[32px] rounded-full bg-white/5 border border-white/10 hover:bg-white/10 px-3.5 flex items-center justify-between text-[11px] font-bold text-white/90 transition active:scale-[0.99]"
        >
          <span className="truncate max-w-[90%]">{selectedTask || 'انتخاب تسک'}</span>
          {isDropdownOpen ? (
            <ChevronUpIcon className="w-3.5 h-3.5 text-white/50" />
          ) : (
            <ChevronDownIcon className="w-3.5 h-3.5 text-white/50" />
          )}
        </button>

        {isDropdownOpen && (
          <div className="absolute bottom-full mb-1 right-0 left-0 bg-[#1e1e24] border border-white/10 rounded-[14px] shadow-2xl p-1 z-30 flex flex-col gap-0.5 max-h-[150px] overflow-y-auto soft-scroll">
            {activeTasks.length > 0 ? (
              activeTasks.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setSelectedTask(t.title);
                    setIsDropdownOpen(false);
                  }}
                  className="text-right w-full px-3 py-2 text-[11px] font-bold rounded-[10px] hover:bg-white/5 text-white/90 transition-colors truncate"
                >
                  {t.title}
                </button>
              ))
            ) : (
              <>
                <button
                  onClick={() => {
                    setSelectedTask('تمرکز آزاد');
                    setIsDropdownOpen(false);
                  }}
                  className="text-right w-full px-3 py-2 text-[11px] font-bold rounded-[10px] hover:bg-white/5 text-white/90 transition-colors"
                >
                  تمرکز آزاد
                </button>
                <button
                  onClick={() => {
                    setSelectedTask('مطالعه و یادگیری');
                    setIsDropdownOpen(false);
                  }}
                  className="text-right w-full px-3 py-2 text-[11px] font-bold rounded-[10px] hover:bg-white/5 text-white/90 transition-colors"
                >
                  مطالعه و یادگیری
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Immersive Zen Mode Overlay */}
      <AnimatePresence>
        {isZenMode && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-between p-8 text-white select-none"
          >
            {/* Top Bar */}
            <div className="w-full max-w-md flex items-center justify-between mt-4">
              <div className="flex items-center gap-2 text-white/60">
                <SparklesIcon className="w-5 h-5 text-primary animate-pulse" />
                <span className="font-bold tracking-wide text-sm">
                  {isBreak ? 'حالت استراحت کوتاه' : 'حالت تمرکز عمیق'}
                </span>
              </div>
              <button
                onClick={() => setIsZenMode(false)}
                className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/25 border border-white/10 text-xs font-bold transition active:scale-95"
              >
                خروج از تمرکز
              </button>
            </div>

            {/* Center Content: Breathing Indicator & Giant Timer */}
            <div className="flex flex-col items-center justify-center gap-8 my-auto">
              <div className="relative w-64 h-64 flex items-center justify-center">
                {/* Outer pulsing glow */}
                <div
                  className={`absolute inset-0 rounded-full bg-primary/10 blur-xl transition-all duration-[4000ms] ease-in-out ${
                    isRunning ? 'scale-125 opacity-100' : 'scale-100 opacity-50'
                  }`}
                ></div>

                {/* Central core circle */}
                <div
                  className={`w-56 h-56 rounded-full border border-primary/30 flex flex-col items-center justify-center bg-white/40 dark:bg-black/40 backdrop-blur-md transition-transform duration-[4000ms] ease-in-out ${
                    isRunning ? 'scale-110' : 'scale-95'
                  }`}
                >
                  <span className="text-white text-5xl font-black font-mono tracking-widest tabular-nums leading-none">
                    {formatTime(timeLeft)}
                  </span>
                  {selectedTask && (
                    <span className="text-xs text-white/60 font-bold mt-4 px-4 text-center truncate max-w-[200px]">
                      {selectedTask}
                    </span>
                  )}
                </div>
              </div>

              {/* Breathing cycle text */}
              {isRunning && (
                <span className="text-primary/80 text-xs font-medium tracking-wide animate-pulse">
                  {isBreak ? 'دم و بازدم آرام...' : 'به درون خود نگاه کن و متمرکز بمان...'}
                </span>
              )}
            </div>

            {/* Bottom Controls */}
            <div className="w-full max-w-sm flex items-center justify-center gap-6 pb-12">
              <button
                onClick={() => {
                  setIsRunning(false);
                  setTimeLeft(isBreak ? BREAK_SECONDS : FOCUS_SECONDS);
                }}
                className="w-12 h-12 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 flex items-center justify-center transition active:scale-95"
                title="ریست تایمر"
              >
                <RotateCcwIcon className="w-5 h-5 text-white/80" />
              </button>

              <button
                onClick={() => setIsRunning(!isRunning)}
                className="w-16 h-16 rounded-full bg-lime text-black flex items-center justify-center transition hover:scale-105 active:scale-95 shadow-[0_0_25px_rgb(var(--color-primary-rgb)/0.4)]"
              >
                {isRunning ? (
                  <PauseIcon className="w-7 h-7 fill-current text-black" />
                ) : (
                  <PlayIcon className="w-7 h-7 fill-current text-black ml-1" />
                )}
              </button>

              <button
                onClick={handleToggleMode}
                className="px-5 h-12 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 flex items-center justify-center text-xs font-bold transition active:scale-95"
              >
                {isBreak ? 'حالت تمرکز' : 'حالت استراحت'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
