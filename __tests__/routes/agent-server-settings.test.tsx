import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import AgentServerSettingsScreen from "#/routes/agent-server-settings";
import { AGENT_SERVER_CONFIG_STORAGE_KEY } from "#/api/agent-server-config";

const TRANSLATIONS: Record<string, string> = {
  "SETTINGS$AGENT_SERVER_ONBOARDING_EYEBROW": "Get started",
  "SETTINGS$AGENT_SERVER_SETTINGS_TITLE": "Agent server connection",
  "SETTINGS$AGENT_SERVER_DESCRIPTION":
    "Set the agent server URL and optional session API key that Agent Canvas should use. Start or choose a compatible server, then save here to reconnect. Deployment defaults appear automatically until you override them.",
  "SETTINGS$AGENT_SERVER_CONNECTION_DETAILS_TITLE": "Connection details",
  "SETTINGS$AGENT_SERVER_CONNECTION_DETAILS_DESCRIPTION":
    "Paste the agent server URL and optional session API key that Agent Canvas should use.",
  "SETTINGS$AGENT_SERVER_URL": "Agent server URL",
  "SETTINGS$AGENT_SERVER_URL_PLACEHOLDER": "https://agent.example.com",
  "SETTINGS$AGENT_SERVER_API_KEY": "Session API key",
  "SETTINGS$AGENT_SERVER_API_KEY_PLACEHOLDER":
    "Enter the X-Session-API-Key value",
  "SETTINGS$AGENT_SERVER_BROWSER_ONLY_NOTE":
    "Saved only in this browser. Deployment defaults stay available until you override them here.",
  "SETTINGS$AGENT_SERVER_RETRY_CONNECTION": "Retry connection",
  "SETTINGS$SAVE_AND_RECONNECT": "Save and reconnect",
  "SETTINGS$AGENT_SERVER_STEP_LABEL": "Step {{step}}",
  "SETTINGS$AGENT_SERVER_STEP_START_TITLE": "Start a compatible server",
  "SETTINGS$AGENT_SERVER_STEP_START_DESCRIPTION":
    "Run an agent server version {{minimumVersion}} or newer locally, or use a remote deployment you already manage.",
  "SETTINGS$AGENT_SERVER_STEP_URL_TITLE": "Enter its URL",
  "SETTINGS$AGENT_SERVER_STEP_URL_DESCRIPTION":
    "Use the address where this browser can reach the server, such as https://agent.example.com.",
  "SETTINGS$AGENT_SERVER_STEP_SAVE_TITLE": "Save and reconnect",
  "SETTINGS$AGENT_SERVER_STEP_SAVE_DESCRIPTION":
    "We'll store your choice in this browser and reconnect right away.",
  "COMMON$OPTIONAL": "Optional",
};

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, string | number>) => {
      let value = TRANSLATIONS[key] ?? key;
      for (const [optionKey, optionValue] of Object.entries(options ?? {})) {
        value = value.replaceAll(`{{${optionKey}}}`, String(optionValue));
      }
      return value;
    },
  }),
}));

const ORIGINAL_LOCATION = window.location;

function mockWindowLocation(url: string, assign = vi.fn()) {
  const location = new URL(url) as unknown as Location;
  Object.assign(location, { assign });

  Object.defineProperty(window, "location", {
    configurable: true,
    value: location,
  });

  return assign;
}

afterEach(() => {
  window.localStorage.clear();
  vi.unstubAllEnvs();
  Object.defineProperty(window, "location", {
    configurable: true,
    value: ORIGINAL_LOCATION,
  });
});

describe("AgentServerSettingsScreen", () => {
  it("renders the simplified settings-style form and prefills environment defaults", async () => {
    vi.stubEnv("VITE_BACKEND_BASE_URL", "https://env-agent.example.com/");
    vi.stubEnv("VITE_SESSION_API_KEY", "env-session-key");

    render(<AgentServerSettingsScreen />);

    expect(
      screen.getByRole("heading", { name: /agent server connection/i }),
    ).toBeInTheDocument();
    expect(await screen.findByTestId("agent-server-url-input")).toHaveValue(
      "https://env-agent.example.com",
    );
    expect(screen.getByTestId("agent-server-api-key-input")).toHaveValue(
      "env-session-key",
    );
    expect(
      screen.getByRole("button", { name: /retry connection/i }),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("agent-server-checklist")).not.toBeInTheDocument();
    expect(
      screen.queryByText(/connection details/i),
    ).not.toBeInTheDocument();
  });

  it("saves agent server settings locally and reconnects", async () => {
    const assignMock = mockWindowLocation(
      "https://gui.example.com/settings/agent-server",
    );

    render(<AgentServerSettingsScreen />);

    const user = userEvent.setup();
    const urlInput = await screen.findByTestId("agent-server-url-input");
    const apiKeyInput = screen.getByTestId("agent-server-api-key-input");

    await user.type(urlInput, "agent.example.com");
    await user.type(apiKeyInput, "secret-key");
    await user.click(screen.getByTestId("submit-button"));

    expect(window.localStorage.getItem(AGENT_SERVER_CONFIG_STORAGE_KEY)).toBe(
      JSON.stringify({
        baseUrl: "https://agent.example.com",
        sessionApiKey: "secret-key",
      }),
    );
    expect(assignMock).toHaveBeenCalledWith("/");
  });

  it("lets users retry the connection without editing settings", async () => {
    const assignMock = mockWindowLocation(
      "https://gui.example.com/settings/agent-server",
    );

    render(<AgentServerSettingsScreen />);

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /retry connection/i }));

    expect(assignMock).toHaveBeenCalledWith("/");
    expect(screen.getByTestId("submit-button")).toBeDisabled();
  });
});
