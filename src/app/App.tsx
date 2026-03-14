import { AppShell } from '../features/app-shell/AppShell';
import { AgentsPage } from '../features/agents/AgentsPage';
import { ChatPage } from '../features/chat/ChatPage';
import { CliPage } from '../features/cli/CliPage';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { HistoryPage } from '../features/history/HistoryPage';
import { RunWizardPage } from '../features/run-wizard/RunWizardPage';
import { SettingsPage } from '../features/settings/SettingsPage';
import { useApp } from './AppProvider';

export function App() {
  const { bootstrapped, selectedTab } = useApp();

  if (!bootstrapped) {
    return <div className="app-loading">Loading application…</div>;
  }

  return (
    <AppShell>
      {selectedTab === 'dashboard' ? <DashboardPage /> : null}
      {selectedTab === 'create-run' ? <RunWizardPage /> : null}
      {selectedTab === 'history' ? <HistoryPage /> : null}
      {selectedTab === 'agents' ? <AgentsPage /> : null}
      {selectedTab === 'cli' ? <CliPage /> : null}
      {selectedTab === 'chat' ? <ChatPage /> : null}
      {selectedTab === 'settings' ? <SettingsPage /> : null}
    </AppShell>
  );
}
