import React from "react";
import { useTranslation } from "react-i18next";
import {
  getAgentServerFormDefaults,
  saveAgentServerConfig,
} from "#/api/agent-server-config";
import { BrandButton } from "#/components/features/settings/brand-button";
import { SettingsInput } from "#/components/features/settings/settings-input";

export const clientLoader = async () => null;

export function AgentServerSettingsScreen() {
  const { t } = useTranslation();
  const defaults = React.useMemo(() => getAgentServerFormDefaults(), []);
  const [baseUrl, setBaseUrl] = React.useState(defaults.baseUrl);
  const [sessionApiKey, setSessionApiKey] = React.useState(
    defaults.sessionApiKey,
  );

  const formIsClean =
    baseUrl === defaults.baseUrl && sessionApiKey === defaults.sessionApiKey;

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    saveAgentServerConfig({
      baseUrl,
      sessionApiKey,
    });

    window.location.assign("/");
  };

  return (
    <form
      data-testid="agent-server-settings-screen"
      onSubmit={onSubmit}
      className="flex h-full flex-col justify-between"
    >
      <div className="flex flex-col gap-6">
        <p className="max-w-[680px] text-sm text-gray-400">
          {t("SETTINGS$AGENT_SERVER_DESCRIPTION")}
        </p>

        <SettingsInput
          testId="agent-server-url-input"
          name="agent-server-url-input"
          type="text"
          label={t("SETTINGS$AGENT_SERVER_URL")}
          value={baseUrl}
          onChange={setBaseUrl}
          placeholder={t("SETTINGS$AGENT_SERVER_URL_PLACEHOLDER")}
          className="w-full max-w-[680px]"
        />

        <SettingsInput
          testId="agent-server-api-key-input"
          name="agent-server-api-key-input"
          type="password"
          label={t("SETTINGS$AGENT_SERVER_API_KEY")}
          value={sessionApiKey}
          onChange={setSessionApiKey}
          placeholder={t("SETTINGS$AGENT_SERVER_API_KEY_PLACEHOLDER")}
          showOptionalTag
          className="w-full max-w-[680px]"
        />
      </div>

      <div className="flex justify-end gap-6 p-6">
        <BrandButton
          testId="submit-button"
          variant="primary"
          type="submit"
          isDisabled={formIsClean}
        >
          {t("SETTINGS$SAVE_AND_RECONNECT")}
        </BrandButton>
      </div>
    </form>
  );
}

export default AgentServerSettingsScreen;
