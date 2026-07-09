import React, { useState, useEffect } from 'react';
import { useData } from '../../../contexts/DataContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ClockIcon, 
  PlayIcon, 
  PauseIcon, 
  RotateCcwIcon, 
  SparklesIcon 
} from '../../../components/icons';
import { linkTaskNote } from '../../../services/linkService';
import { newId } from '../../../utils/uuid';
import type { ChecklistItem } from '../../../types';
import { FocusPicker } from './FocusPicker';
import { Settings } from 'lucide-react';

export const FocusTimer: React.FC = () => {
  const { tasks, addTask, addNote, addNotification } = useData();

  // Load preferences from localStorage or use defaults
  const [focusDuration, setFocusDuration] = useState(() => {
    const saved = localStorage.getItem('focus_timer_focus_duration');
    return saved ? parseInt(saved, 10) : 25; // in minutes
  });
  const [breakDuration, setBreakDuration] = useState(() => {
    const saved = localStorage.getItem('focus_timer_break_duration');
    return saved ? parseInt(saved, 10) : 5; // in minutes
  });

  const [timeLeft, setTimeLeft] = useState(() => {
    const savedFocus = localStorage.getItem('focus_timer_focus_duration');
    const mins = savedFocus ? parseInt(savedFocus, 10) : 25;
    return mins * 60;
  });
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isZenMode, setIsZenModeState] = useState(false);
  const setIsZenMode = (val: boolean) => {
    setIsZenModeState(val);
    window.dispatchEvent(new CustomEvent('hexer:zen-mode', { detail: val }));
  };
  const [selectedTask, setSelectedTask] = useState<{ id: string | null; title: string } | null>(null);

  // States for Zen Session Inputs
  const [distractions, setDistractions] = useState<string[]>([]);
  const [distractionInput, setDistractionInput] = useState('');
  const [sessionNote, setSessionNote] = useState('');

  // Persist preferences
  useEffect(() => {
    localStorage.setItem('focus_timer_focus_duration', focusDuration.toString());
  }, [focusDuration]);

  useEffect(() => {
    localStorage.setItem('focus_timer_break_duration', breakDuration.toString());
  }, [breakDuration]);

  // Sync timeLeft when duration config changes and timer is not running
  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(isBreak ? breakDuration * 60 : focusDuration * 60);
    }
  }, [focusDuration, breakDuration, isBreak, isRunning]);

  // Timer interval countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  // Handle completion when timeLeft reaches 0
  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      if (!isBreak) {
        setIsBreak(true);
        setTimeLeft(breakDuration * 60);
        addNotification('زمان تمرکز به پایان رسید! وقت استراحت است.', 'success');
      } else {
        setIsBreak(false);
        setTimeLeft(focusDuration * 60);
        addNotification('زمان استراحت به پایان رسید! آماده تمرکز شوید.', 'success');
      }
    }
  }, [timeLeft, isRunning, isBreak, focusDuration, breakDuration, addNotification]);

  // Toggle mode manually
  const handleToggleMode = () => {
    setIsRunning(false);
    if (isBreak) {
      setIsBreak(false);
      setTimeLeft(focusDuration * 60);
    } else {
      setIsBreak(true);
      setTimeLeft(breakDuration * 60);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleExitFocus = async () => {
    setIsRunning(false);
    
    const distractionCount = distractions.length;
    const hasNote = sessionNote.trim() !== '';

    if (distractionCount === 0 && !hasNote) {
      setIsZenMode(false);
      return;
    }

    try {
      if (distractionCount > 0) {
        await addTask({
          title: 'چیزایی که نیاز به بررسی دارن',
          priority: 'medium',
          tags: [],
          checklist: distractions.map(text => ({
            id: newId(),
            text,
            isCompleted: false
          } as ChecklistItem))
        });
      }

      if (hasNote) {
        const noteTitle = selectedTask?.title 
          ? `یادداشت تمرکز: ${selectedTask.title}` 
          : 'یادداشت جلسه‌ی تمرکز';
        
        const createdNote = await addNote({
          title: noteTitle,
          content: sessionNote.trim(),
          tags: []
        });

        const taskIdToLink = selectedTask?.id;
        if (taskIdToLink && createdNote?.id) {
          await linkTaskNote(taskIdToLink, createdNote.id);
        }
      }

      // Success Notification
      if (distractionCount > 0 && hasNote) {
        addNotification('جلسه تمرکز ذخیره شد (کارهای جدید و یادداشت ثبت شدند)', 'success');
      } else if (distractionCount > 0) {
        addNotification('جلسه تمرکز ذخیره شد (کارهای نیاز به بررسی ثبت شدند)', 'success');
      } else if (hasNote) {
        addNotification('یادداشت جلسه تمرکز با موفقیت ذخیره شد', 'success');
      }

      // Reset States
      setDistractions([]);
      setDistractionInput('');
      setSessionNote('');
      setIsZenMode(false);
    } catch (error) {
      console.error('Error saving focus session:', error);
      addNotification('خطا در ذخیره‌ی جلسه‌ی تمرکز', 'error');
    }
  };

  return (
    <div 
      className="bg-[var(--ink-bg)] border border-white/10 text-white rounded-[var(--radius-lg)] p-4 relative overflow-hidden min-h-[160px] flex flex-col justify-between dark:border-[var(--border-neon)] dark:shadow-[0_0_20px_rgb(var(--color-primary-rgb)/0.15)] lg:mt-auto animate-fade-in"
      id="focus-timer-widget"
    >
      {/* Abstract background halo */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[var(--ink-bg)] via-black/20 to-white/5 opacity-40 pointer-events-none"></div>
      
      {/* Blur Glow Effect */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/5 dark:bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Row: Title & Enter Zen Mode */}
      <div className="flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-1.5 text-white/50 text-[11px] font-bold">
          <ClockIcon className="w-3.5 h-3.5 text-primary-text" />
          <span className="tracking-wider text-[11px] font-black text-white">
            {isBreak ? 'استراحت کوتاه' : 'تمرکز عمیق'}
          </span>
        </div>
        <button
          onClick={() => setIsZenMode(true)}
          className="bg-brand text-black hover:bg-[var(--color-primary-hover)] text-[11px] font-extrabold px-3 py-1 rounded-full active:scale-95 transition-transform"
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
          {/* Settings Button */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`w-8 h-8 rounded-full border flex items-center justify-center transition active:scale-95 cursor-pointer ${
              showSettings 
                ? 'bg-brand/20 border-brand text-brand' 
                : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/70'
            }`}
            title="تنظیمات زمان"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Reset Button */}
          <button
            onClick={() => {
              setIsRunning(false);
              setTimeLeft(isBreak ? breakDuration * 60 : focusDuration * 60);
            }}
            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 flex items-center justify-center transition active:scale-95"
            title="ریست تایمر"
          >
            <RotateCcwIcon className="w-4 h-4" />
          </button>
          
          {/* Play/Pause Button */}
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="w-8 h-8 rounded-full bg-brand text-black flex items-center justify-center transition hover:scale-105 active:scale-95 shadow-[0_0_15px_rgb(var(--color-primary-rgb)/0.3)]"
          >
            {isRunning ? (
              <PauseIcon className="w-3.5 h-3.5 fill-current text-black" />
            ) : (
              <PlayIcon className="w-3.5 h-3.5 fill-current text-black ml-0.5" />
            )}
          </button>
        </div>
      </div>

      {/* Settings Config Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden z-20"
          >
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col gap-3 text-right text-xs mt-1 mb-2" dir="rtl">
              {/* Focus Duration Selection */}
              <div className="flex flex-col gap-1.5">
                <span className="font-bold text-white/60">مدت زمان تمرکز (دقیقه):</span>
                <div className="flex flex-wrap gap-1">
                  {[10, 15, 25, 45, 60].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => {
                        setFocusDuration(mins);
                        if (!isRunning && !isBreak) {
                          setTimeLeft(mins * 60);
                        }
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition border cursor-pointer ${
                        focusDuration === mins
                          ? 'bg-brand text-black border-brand'
                          : 'bg-white/5 border-white/5 hover:bg-white/10 text-white/70'
                      }`}
                    >
                      {mins}
                    </button>
                  ))}
                </div>
              </div>

              {/* Break Duration Selection */}
              <div className="flex flex-col gap-1.5">
                <span className="font-bold text-white/60">مدت زمان استراحت (دقیقه):</span>
                <div className="flex flex-wrap gap-1">
                  {[3, 5, 10, 15].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => {
                        setBreakDuration(mins);
                        if (!isRunning && isBreak) {
                          setTimeLeft(mins * 60);
                        }
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition border cursor-pointer ${
                        breakDuration === mins
                          ? 'bg-brand text-black border-brand'
                          : 'bg-white/5 border-white/5 hover:bg-white/10 text-white/70'
                      }`}
                    >
                      {mins}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Row: Custom Task Selection Button */}
      <div className="relative z-20 shrink-0">
        <FocusPicker
          tasks={tasks}
          selectedTask={selectedTask}
          onSelect={setSelectedTask}
        />
      </div>

      {/* Immersive Zen Mode Overlay */}
      <AnimatePresence>
        {isZenMode && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-between p-6 text-white overflow-y-auto no-scrollbar"
            dir="rtl"
          >
            {/* Top Bar */}
            <div className="w-full max-w-md flex items-center justify-between mt-4">
              <div className="flex items-center gap-2 text-white/60">
                <SparklesIcon className="w-5 h-5 text-primary-text animate-pulse" />
                <span className="font-bold tracking-wide text-sm">
                  {isBreak ? 'حالت استراحت کوتاه' : 'حالت تمرکز عمیق'}
                </span>
              </div>
              <button
                onClick={handleExitFocus}
                className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/25 border border-white/10 text-xs font-bold transition active:scale-95 cursor-pointer"
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
                      {selectedTask.title}
                    </span>
                  )}
                </div>
              </div>

              {/* Breathing cycle text */}
              {isRunning && (
                <span className="text-primary-text/80 text-xs font-medium tracking-wide animate-pulse">
                  {isBreak ? 'دم و بازدم آرام...' : 'به درون خود نگاه کن و متمرکز بمان...'}
                </span>
              )}
            </div>

            {/* Zen Interactive Session Inputs */}
            <div className="w-full max-w-md flex flex-col gap-4 my-6 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md text-right">
              {/* Box 1: Distractions */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-primary-text flex items-center gap-1.5 justify-start">
                  <span>حواس‌پرتی‌ها</span>
                  <span className="text-[10px] text-white/40 font-normal">(به کار عمیق اضافه می‌شوند)</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={distractionInput}
                    onChange={(e) => setDistractionInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (distractionInput.trim()) {
                          setDistractions(prev => [...prev, distractionInput.trim()]);
                          setDistractionInput('');
                        }
                      }
                    }}
                    placeholder="چیزی ذهنت رو مشغول کرده؟"
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-primary transition"
                  />
                  <button
                    onClick={() => {
                      if (distractionInput.trim()) {
                        setDistractions(prev => [...prev, distractionInput.trim()]);
                        setDistractionInput('');
                      }
                    }}
                    className="px-3 py-1.5 bg-primary text-black rounded-xl text-xs font-black hover:bg-[var(--color-primary-hover)] active:scale-95 transition cursor-pointer"
                  >
                    +
                  </button>
                </div>
                {distractions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1.5 max-h-[80px] overflow-y-auto soft-scroll p-1 bg-black/20 rounded-lg">
                    {distractions.map((item, index) => (
                      <div 
                        key={index} 
                        className="flex items-center gap-1 bg-white/10 border border-white/10 text-white/90 text-[10px] font-bold px-2 py-0.5 rounded-full"
                      >
                        <span className="truncate max-w-[120px]">{item}</span>
                        <button
                          onClick={() => setDistractions(prev => prev.filter((_, i) => i !== index))}
                          className="text-white/40 hover:text-error transition font-black ml-0.5 text-[9px] cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <span className="text-[9px] text-white/40 text-right mt-0.5 leading-tight block">
                  این‌ها بعداً به ساب‌تسک تبدیل می‌شوند.
                </span>
              </div>

              {/* Box 2: Session Notes */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-primary-text text-right">یادداشت‌های این تسک</label>
                <textarea
                  value={sessionNote}
                  onChange={(e) => setSessionNote(e.target.value)}
                  placeholder="ایده‌ها، نکات یا دستاوردهای این جلسه..."
                  rows={2}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-primary resize-none transition"
                />
              </div>

              {/* Fixed Bottom Message */}
              <div className="text-center text-[10px] text-primary-text/70 font-black mt-1 animate-pulse">
                هر وقت کارت اینجا تموم بشه من برات ذخیرش می‌کنم
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="w-full max-w-sm flex items-center justify-center gap-6 pb-6">
              <button
                onClick={() => {
                  setIsRunning(false);
                  setTimeLeft(isBreak ? breakDuration * 60 : focusDuration * 60);
                }}
                className="w-12 h-12 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 flex items-center justify-center transition active:scale-95 cursor-pointer"
                title="ریست تایمر"
              >
                <RotateCcwIcon className="w-5 h-5 text-white/80" />
              </button>

              <button
                onClick={() => setIsRunning(!isRunning)}
                className="w-16 h-16 rounded-full bg-brand text-black flex items-center justify-center transition hover:scale-105 active:scale-95 shadow-[0_0_25px_rgb(var(--color-primary-rgb)/0.4)] cursor-pointer"
              >
                {isRunning ? (
                  <PauseIcon className="w-7 h-7 fill-current text-black" />
                ) : (
                  <PlayIcon className="w-7 h-7 fill-current text-black ml-1" />
                )}
              </button>

              <button
                onClick={handleToggleMode}
                className="px-5 h-12 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 flex items-center justify-center text-xs font-bold transition active:scale-95 cursor-pointer"
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
