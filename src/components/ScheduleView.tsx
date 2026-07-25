import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { Plus, CheckCircle2, Circle, Trash2, AlertCircle } from 'lucide-react';

export default function ScheduleView({ store }: { store: any }) {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSubject, setNewTaskSubject] = useState('');
  
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    store.addTask({
      id: uuidv4(),
      title: newTaskTitle,
      subject: newTaskSubject || 'عام',
      difficulty: 'Medium',
      dueDate: new Date().toISOString(),
      completed: false,
      priority: false
    });
    setNewTaskTitle('');
    setNewTaskSubject('');
  };

  const pendingTasks = store.state.tasks.filter((t: any) => !t.completed);
  const completedTasks = store.state.tasks.filter((t: any) => t.completed);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">الجدول الدراسي</h2>
      
      <form onSubmit={handleAddTask} className="flex gap-4 mb-8 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <input 
          type="text"
          placeholder="أضف مهمة دراسية جديدة..."
          className="flex-1 bg-transparent border-none outline-none text-lg p-2"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <input 
          type="text"
          placeholder="المادة (اختياري)"
          className="w-48 bg-slate-100 dark:bg-slate-800 rounded-lg px-4 border-none outline-none"
          value={newTaskSubject}
          onChange={(e) => setNewTaskSubject(e.target.value)}
        />
        <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2">
          <Plus size={20} />
          إضافة
        </button>
      </form>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">المهام الحالية ({pendingTasks.length})</h3>
        {pendingTasks.length === 0 ? (
          <div className="text-center py-10 text-slate-500">
            <AlertCircle className="mx-auto mb-4" size={48} opacity={0.5} />
            <p>لا توجد مهام حالية. أنت مستعد للاستراحة!</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {pendingTasks.map((task: any) => (
              <li key={task.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <button onClick={() => store.updateTask({...task, completed: true})} className="text-slate-400 hover:text-emerald-500 transition-colors">
                    <Circle size={24} />
                  </button>
                  <div>
                    <h4 className="font-medium text-lg">{task.title}</h4>
                    <span className="text-sm text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">{task.subject}</span>
                  </div>
                </div>
                <button onClick={() => store.deleteTask(task.id)} className="text-slate-400 hover:text-red-500 transition-colors p-2">
                  <Trash2 size={20} />
                </button>
              </li>
            ))}
          </ul>
        )}

        {completedTasks.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-4">مكتملة ({completedTasks.length})</h3>
            <ul className="space-y-3 opacity-60">
              {completedTasks.map((task: any) => (
                <li key={task.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-4">
                    <button onClick={() => store.updateTask({...task, completed: false})} className="text-emerald-500">
                      <CheckCircle2 size={24} />
                    </button>
                    <div>
                      <h4 className="font-medium text-lg line-through">{task.title}</h4>
                      <span className="text-sm text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">{task.subject}</span>
                    </div>
                  </div>
                  <button onClick={() => store.deleteTask(task.id)} className="text-slate-400 hover:text-red-500 transition-colors p-2">
                    <Trash2 size={20} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
