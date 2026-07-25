import React, { useState } from "react";
import { LayoutDashboard, Calendar, Timer, Bot, Settings, BookOpen, PenTool, Library } from "lucide-react";
import { useAppStore } from "./store";
import DashboardView from "./components/DashboardView";
import ScheduleView from "./components/ScheduleView";
import FocusView from "./components/FocusView";
import AiTutorView from "./components/AiTutorView";
import AiGeneratorView from "./components/AiGeneratorView";
import SettingsView from "./components/SettingsView";
import LibraryView from "./components/LibraryView";

type Tab = "dashboard" | "schedule" | "focus" | "tutor" | "generator" | "library" | "settings";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const store = useAppStore();

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard": return <DashboardView store={store} />;
      case "schedule": return <ScheduleView store={store} />;
      case "focus": return <FocusView store={store} />;
      case "tutor": return <AiTutorView />;
      case "generator": return <AiGeneratorView />;
      case "library": return <LibraryView />;
      case "settings": return <SettingsView store={store} />;
      default: return <DashboardView store={store} />;
    }
  };

  const navItems = [
    { id: "dashboard", label: "الرئيسية", icon: LayoutDashboard },
    { id: "schedule", label: "الجدول", icon: Calendar },
    { id: "focus", label: "التركيز", icon: Timer },
    { id: "tutor", label: "المعلم الذكي", icon: Bot },
    { id: "generator", label: "توليد الصور", icon: PenTool },
    { id: "library", label: "المكتبة", icon: Library },
    { id: "settings", label: "الإعدادات", icon: Settings },
  ] as const;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      {/* Sidebar Navigation */}
      <nav className="w-20 md:w-64 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col items-center md:items-start p-4 shrink-0 transition-all duration-300">
        <div className="flex items-center gap-3 mb-10 text-emerald-600 dark:text-emerald-400 w-full px-2">
          <BookOpen size={32} strokeWidth={2.5} />
          <h1 className="text-2xl font-bold hidden md:block">Thrive</h1>
        </div>
        
        <ul className="flex flex-col gap-2 w-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <li key={item.id} className="w-full">
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-center md:justify-start gap-3 p-3 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 font-semibold" 
                      : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                  }`}
                >
                  <Icon size={24} />
                  <span className="hidden md:block">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto h-full">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
