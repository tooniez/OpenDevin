import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import AgentServerSettingsScreen from "#/routes/agent-server-settings";
import { AGENT_SERVER_CONFIG_STORAGE_KEY } from "#/api/agent-server-config";

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
  it("prefills values from environment defaults", async () => {
    vi.stubEnv("VITE_BACKEND_BASE_URL", "https://env-agent.example.com/");
    vi.stubEnv("VITE_SESSION_API_KEY", "env-session-key");

    render(<AgentServerSettingsScreen />);

    expect(await screen.findByTestId("agent-server-url-input")).toHaveValue(
      "https://env-agent.example.com",
    );
    expect(screen.getByTestId("agent-server-api-key-input")).toHaveValue(
      "env-session-key",
    );
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
});
