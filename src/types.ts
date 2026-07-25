export interface Task {
  id: string;
  title: string;
  subject: string;
  difficulty: "Easy" | "Medium" | "Hard";
  dueDate: string; // ISO string
  completed: boolean;
  priority: boolean;
}

export interface FocusSession {
  id: string;
  duration: number; // minutes
  date: string; // ISO string
  completed: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
  imageUrl?: string; // Optional attached image
}

export interface AppState {
  tasks: Task[];
  focusSessions: FocusSession[];
  theme: "light" | "dark";
}
