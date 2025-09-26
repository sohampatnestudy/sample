
import React, { useContext } from 'react';
import { Sun, Moon, Type, Minimize2, Expand, Bell, HardDrive, LogOut } from 'lucide-react';
import Card from './ui/Card';
import { AppContext } from '../contexts/AppContext';
import Button from './ui/Button';
import Toggle from './ui/Toggle';

const SettingsPanel: React.FC = () => {
  const { settings, setSetting, user, authService } = useContext(AppContext);

  const handleExport = () => {
      const data = JSON.stringify(localStorage);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `jee-companion-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
  };
  
  const handleDisconnect = () => {
      if(window.confirm("Are you sure you want to disconnect your account and delete all local data? This cannot be undone.")) {
          authService.signOut();
          localStorage.clear();
          window.location.reload(); // To reset all state
      }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="p-6">
        <h3 className="text-xl font-bold text-secondary-800 dark:text-white mb-4">Appearance</h3>
        
        <div className="flex items-center justify-between py-4 border-b dark:border-secondary-700">
          <label className="font-medium">Theme</label>
          <div className="flex items-center gap-2 p-1 rounded-full bg-secondary-200 dark:bg-secondary-700">
            <button onClick={() => setSetting('theme', 'light')} className={`p-2 rounded-full transition-colors ${settings.theme === 'light' ? 'bg-white shadow' : ''}`}>
              <Sun className="w-5 h-5 text-yellow-500" />
            </button>
            <button onClick={() => setSetting('theme', 'dark')} className={`p-2 rounded-full transition-colors ${settings.theme === 'dark' ? 'bg-secondary-800 shadow' : ''}`}>
              <Moon className="w-5 h-5 text-blue-400" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between py-4 border-b dark:border-secondary-700">
          <label className="font-medium">Font Size</label>
          <div className="flex items-center gap-2 p-1 rounded-full bg-secondary-200 dark:bg-secondary-700">
            <button onClick={() => setSetting('fontSize', 'sm')} className={`px-3 py-1 rounded-full transition-colors text-sm ${settings.fontSize === 'sm' ? 'bg-white dark:bg-secondary-800 shadow' : ''}`}>Small</button>
            <button onClick={() => setSetting('fontSize', 'base')} className={`px-3 py-1 rounded-full transition-colors text-base ${settings.fontSize === 'base' ? 'bg-white dark:bg-secondary-800 shadow' : ''}`}>Normal</button>
            <button onClick={() => setSetting('fontSize', 'lg')} className={`px-3 py-1 rounded-full transition-colors text-lg ${settings.fontSize === 'lg' ? 'bg-white dark:bg-secondary-800 shadow' : ''}`}>Large</button>
          </div>
        </div>

        <div className="flex items-center justify-between py-4">
          <label className="font-medium">UI Density</label>
          <div className="flex items-center gap-2 p-1 rounded-full bg-secondary-200 dark:bg-secondary-700">
            <button onClick={() => setSetting('isCompact', true)} className={`p-2 rounded-full transition-colors ${settings.isCompact ? 'bg-white dark:bg-secondary-800 shadow' : ''}`} title="Compact">
              <Minimize2 className="w-5 h-5 text-secondary-600 dark:text-secondary-300" />
            </button>
            <button onClick={() => setSetting('isCompact', false)} className={`p-2 rounded-full transition-colors ${!settings.isCompact ? 'bg-white dark:bg-secondary-800 shadow' : ''}`} title="Comfortable">
              <Expand className="w-5 h-5 text-secondary-600 dark:text-secondary-300" />
            </button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-bold text-secondary-800 dark:text-white mb-4">Integrations & Data</h3>
        {user ? (
            <div className="flex items-center justify-between py-4 border-b dark:border-secondary-700">
                <div>
                    <label className="font-medium">Sync to Google Calendar</label>
                    <p className="text-sm text-secondary-500">Automatically sync planner tasks.</p>
                </div>
                <Toggle isChecked={settings.syncToCalendar} onToggle={() => setSetting('syncToCalendar', !settings.syncToCalendar)} />
            </div>
        ) : (
            <div className="text-center p-4 bg-secondary-100 dark:bg-secondary-800 rounded-lg">
                <p>Sign in with your Google account to sync your planner and settings.</p>
            </div>
        )}
        <div className="flex items-center justify-between py-4">
          <div>
            <label className="font-medium">Backup & Export</label>
            <p className="text-sm text-secondary-500">Export all your local data to a JSON file.</p>
          </div>
          <Button variant="secondary" onClick={handleExport}><HardDrive size={16} className="mr-2"/> Export Data</Button>
        </div>
        {user && (
             <div className="flex items-center justify-between py-4 border-t dark:border-secondary-700 mt-4">
                <div>
                    <label className="font-medium text-red-600 dark:text-red-400">Disconnect & Delete</label>
                    <p className="text-sm text-secondary-500">Sign out and clear all local app data.</p>
                </div>
                <Button variant="secondary" onClick={handleDisconnect} className="!text-red-600 dark:!text-red-400 hover:!bg-red-100 dark:hover:!bg-red-900/50"><LogOut size={16} className="mr-2"/> Disconnect</Button>
            </div>
        )}
      </Card>
    </div>
  );
};

export default SettingsPanel;
