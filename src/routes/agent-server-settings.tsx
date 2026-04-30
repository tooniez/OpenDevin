import React from "react";
import { useTranslation } from "react-i18next";
import { AgentServerConnectionForm } from "#/components/features/settings/agent-server-onboarding";
import { Typography } from "#/ui/typography";

export const clientLoader = async () => null;
export const handle = { hideTitle: true };

export function AgentServerSettingsScreen() {
  const { t } = useTranslation();

  return (
    <div
      data-testid="agent-server-settings-screen"
      className="flex h-full flex-col gap-6 pb-8"
    >
      <div>
        <Typography.H2 className="mb-2">
          {t("SETTINGS$AGENT_SERVER_SETTINGS_TITLE")}
        </Typography.H2>
        <Typography.Paragraph className="max-w-3xl text-sm text-[#A3A3A3]">
          {t("SETTINGS$AGENT_SERVER_DESCRIPTION")}
        </Typography.Paragraph>
      </div>

      <div className="max-w-2xl">
        <AgentServerConnectionForm variant="settings" showSectionHeader={false} />
      </div>
    </div>
  );
}

export default AgentServerSettingsScreen;
