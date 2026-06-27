import React, { useMemo } from 'react';
import { useData } from '../../../contexts/DataContext';
import { Priority } from '../../../types';
import { WidgetContainer } from './WidgetContainer';

export const KeyProjects: React.FC = () => {
  const { projects, tasks } = useData();

  const highPriorityProjects = useMemo(() => {
    return projects
      .filter(p => p.priority === Priority.High || p.priority === 'high')
      .map(p => {
        const projectTasks = tasks.filter(t => t.project_id === p.id);
        const completed = projectTasks.filter(t => t.status === 'done').length;
        const progress = projectTasks.length > 0 ? Math.round((completed / projectTasks.length) * 100) : 0;
        return { ...p, progress, remaining: projectTasks.length - completed };
      })
      .slice(0, 3);
  }, [projects, tasks]);
  
  if (highPriorityProjects.length === 0) return null;

  return (
    <WidgetContainer className="bg-primary text-black border-transparent shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-black">وضعیت پروژه‌ها</h2>
        <button className="text-[10px] font-bold text-black bg-black/10 px-3 py-1 rounded-full hover:bg-black/20 transition">همه ↗</button>
      </div>
      <div className="space-y-4">
        {highPriorityProjects.map(p => (
          <div key={p.id} className="group">
            <div className="flex justify-between items-center mb-1.5">
              <span className="font-semibold text-sm text-black">
                {p.title}
              </span>
              <span className="text-xs font-mono text-black">{p.progress}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-black/10 overflow-hidden">
              <div 
                className="h-full bg-black rounded-full transition-all duration-500" 
                style={{ width: `${p.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </WidgetContainer>
  );
};
