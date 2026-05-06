import {
  AgentServerUIProviders,
  BrowserPanel,
  ConversationView,
  SettingsPanel,
  TerminalPanel,
} from "@openhands/agent-canvas";
import { LLMSettings } from "@openhands/agent-canvas/settings";
import { Sidebar } from "@openhands/agent-canvas/sidebar";

export function SmokeImportConsumer() {
  return (
    <AgentServerUIProviders>
      <ConversationView />
      <BrowserPanel />
      <TerminalPanel />
      <SettingsPanel navigationItems={[]}>
        <LLMSettings />
      </SettingsPanel>
      <Sidebar />
    </AgentServerUIProviders>
  );
}
