import React, { useState } from 'react';
import { useData } from '../../../contexts/DataContext';
import { Page } from '../../../types';
import { BotIcon, MicrophoneIcon, PaperclipIcon } from '../../../components/icons';
import { setPendingDraft } from '../../chat/composerBridge';

export const AiComposerPanel: React.FC = () => {
  const { setCurrentPage } = useData();
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setPendingDraft({ text: input.trim() });
      setCurrentPage(Page.Chat);
    }
  };

  const handleMicOrAttachClick = () => {
    setCurrentPage(Page.Chat);
  };

  return (
    <div className="glass-panel p-5 h-[145px] rounded-[var(--radius-lg)] flex flex-col justify-between shrink-0" dir="rtl">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <BotIcon className="w-5 h-5 text-main" />
          <h1 className="text-[22px] font-black leading-tight text-main">دستیار هوش مصنوعی</h1>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute inset-0 bg-primary opacity-0 dark:group-hover:opacity-10 blur-xl rounded-full transition duration-500 pointer-events-none"></div>
        <div className="relative flex items-center bg-[var(--bg-card)] border border-subtle rounded-[var(--radius-pill)] p-1 shadow-[var(--shadow-card)] focus-within:border-[var(--input-focus-ring)] transition-all">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="بگو هرچه دل تنگت میخواهد(حرف بزن، تایپ کن یا حتی اسکرین بده)" 
            className="flex-1 bg-transparent border-none outline-none pr-4 pl-3.5 text-[14px] font-medium text-main placeholder-muted focus:ring-0 text-right"
            dir="rtl"
          />
          <div className="flex items-center gap-2 px-2 shrink-0">
            {/* attachment icon */}
            <button 
              type="button"
              onClick={handleMicOrAttachClick}
              className="text-muted hover:text-main cursor-pointer transition active:scale-90"
              title="ضمیمه کردن فایل"
            >
              <PaperclipIcon className="w-4 h-4" />
            </button>
            {/* microphone icon */}
            <button 
              type="button"
              onClick={handleMicOrAttachClick}
              className="text-muted hover:text-main cursor-pointer transition active:scale-90"
              title="ضبط صدا"
            >
              <MicrophoneIcon className="w-4 h-4" />
            </button>
          </div>
          <button 
            type="submit" 
            className="px-5 py-2.5 bg-lime rounded-full text-xs font-bold text-on-primary transition-transform hover:scale-105 active:scale-95 shrink-0 shadow-[var(--shadow-btn)]"
          >
            ارسال
          </button>
        </div>
      </form>
    </div>
  );
};

export default AiComposerPanel;
