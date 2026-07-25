import { useState, useEffect } from "react";
import { AppState, Task, FocusSession } from "./types";

const STORAGE_KEY = "thrive_study_assistant_data";

const defaultState: AppState = {
  tasks: [],
  focusSessions: [],
  theme: "dark",
};

export function useAppStore() {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultState;
      }
    }
    return defaultState;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    // Handle theme toggle
    if (state.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [state]);

  const addTask = (task: Task) => setState(s => ({ ...s, tasks: [...s.tasks, task] }));
  const updateTask = (updated: Task) => setState(s => ({ ...s, tasks: s.tasks.map(t => t.id === updated.id ? updated : t) }));
  const deleteTask = (id: string) => setState(s => ({ ...s, tasks: s.tasks.filter(t => t.id !== id) }));
  
  const addFocusSession = (session: FocusSession) => setState(s => ({ ...s, focusSessions: [...s.focusSessions, session] }));
  
  const toggleTheme = () => setState(s => ({ ...s, theme: s.theme === "dark" ? "light" : "dark" }));

  return {
    state,
    addTask,
    updateTask,
    deleteTask,
    addFocusSession,
    toggleTheme
  };
}
