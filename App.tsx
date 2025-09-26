
import React, { useState, useEffect, useContext } from 'react';
import { BookOpen, Clock, BarChart2, CheckSquare, Newspaper, Settings, Calendar, BrainCircuit, Menu, X, User, LogOut, BarChart3 } from 'lucide-react';
import { AppContext } from './contexts/AppContext';
import NewsFeed from './components/NewsFeed';
import StudyTools from './components/StudyTools';
import SubjectDashboard from './components/SubjectDashboard';
import QuickChecker from './components/QuickChecker';
import Analytics from './components/Analytics';
import ChapterPlanner from './components/ChapterPlanner';
import SettingsPanel from './components/SettingsPanel';
import SyllabusTracker from './components/SyllabusTracker';
import FloatingTimer from './components/FloatingTimer';
import Button from './components/ui/Button';
import { View, NavItemData } from './types';

// Suggested .eslintrc.js rule to prevent accidental prop spreading issues:
/*
{
  "rules": {
    "react/jsx-props-no-spreading": ["warn", {
      "html": "enforce",
      "custom": "enforce",
      "explicitSpread": "ignore",
      "exceptions": [] // Add component names that are designed for prop spreading
    }]
  }
}
*/

interface NavItemProps extends Omit<NavItemData, 'id'> {
    isMobile?: boolean;
}

const App: React.FC = () => {
  const { settings, setSetting, user, authService } = useContext(AppContext);
  const [activeView, setActiveView] = useState<View>('subjects');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  const fontSizes: { [key: string]: string } = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
  };

  const NavItem = ({ icon: Icon, label, view, isMobile }: NavItemProps) => (
    <button
      onClick={() => {
        setActiveView(view);
        if (isMobile) setIsSidebarOpen(false);
      }}
      className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors duration-200 ${
        activeView === view
          ? 'bg-primary-500 text-white'
          : 'text-secondary-600 dark:text-secondary-300 hover:bg-primary-100 dark:hover:bg-secondary-800'
      }`}
    >
      <Icon className="w-5 h-5 mr-4" />
      <span className="font-medium">{label}</span>
    </button>
  );

  const navItems: NavItemData[] = [
    { id: 'subjects', icon: BookOpen, label: 'Subjects', view: 'subjects' },
    { id: 'news', icon: Newspaper, label: 'News Feed', view: 'news' },
    { id: 'planner', icon: Calendar, label: 'Planner', view: 'planner' },
    { id: 'syllabus', icon: BarChart3, label: 'Syllabus Tracker', view: 'syllabus' },
    { id: 'tools', icon: Clock, label: 'Study Tools', view: 'tools' },
    { id: 'checker', icon: BrainCircuit, label: 'Quick Checker', view: 'checker' },
    { id: 'analytics', icon: BarChart2, label: 'Analytics', view: 'analytics' },
    { id: 'settings', icon: Settings, label: 'Settings', view: 'settings' },
  ];
  
  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
      <div className="flex flex-col h-full bg-secondary-100 dark:bg-secondary-900 p-4">
        <div className="flex items-center mb-8 px-2">
          <CheckSquare className="w-8 h-8 text-primary-500" />
          <h1 className="text-2xl font-bold ml-3 text-secondary-800 dark:text-white">JEE Companion</h1>
        </div>
        <nav className="flex-1 flex flex-col space-y-2">
          {navItems.map(({ id, ...rest }) => <NavItem key={id} {...rest} isMobile={isMobile} />)}
        </nav>
        <div className="mt-auto">
            {user ? (
                <div className="p-2 rounded-lg bg-secondary-200 dark:bg-secondary-800">
                    <div className="flex items-center">
                        <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full" />
                        <div className="ml-3">
                            <p className="font-semibold text-sm text-secondary-800 dark:text-white">{user.name}</p>
                            <p className="text-xs text-secondary-500 dark:text-secondary-400">{user.email}</p>
                        </div>
                    </div>
                    <Button variant="secondary" size="sm" className="w-full mt-3" onClick={authService.signOut}>
                        <LogOut size={16} className="mr-2" /> Sign Out
                    </Button>
                </div>
            ) : (
                <Button className="w-full" onClick={authService.signIn}>
                    <User size={16} className="mr-2" /> Sign In with Google
                </Button>
            )}
        </div>
      </div>
  );

  const renderView = () => {
    switch (activeView) {
      case 'news': return <NewsFeed />;
      case 'subjects': return <SubjectDashboard />;
      case 'planner': return <ChapterPlanner />;
      case 'syllabus': return <SyllabusTracker />;
      case 'tools': return <StudyTools />;
      case 'checker': return <QuickChecker />;
      case 'analytics': return <Analytics />;
      case 'settings': return <SettingsPanel />;
      default: return <SubjectDashboard />;
    }
  };

  return (
    <div className={`flex h-screen bg-secondary-50 dark:bg-secondary-950 ${fontSizes[settings.fontSize]} ${settings.isCompact ? 'compact' : ''}`}>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 flex-shrink-0">
          <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-40 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}>
          <div className="w-64 h-full">
              <SidebarContent isMobile />
          </div>
      </div>
      {isSidebarOpen && <div className="fixed inset-0 bg-black opacity-50 z-30 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>}
      
      <FloatingTimer />

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between md:justify-end p-4 border-b border-secondary-200 dark:border-secondary-800 bg-secondary-100 dark:bg-secondary-900">
          <button className="md:hidden text-secondary-600 dark:text-secondary-300" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="text-lg font-semibold text-secondary-800 dark:text-white capitalize">{activeView}</div>
        </header>
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
