import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { createInstance } from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";

vi.mock("react-i18next", async (importOriginal) =>
  importOriginal<typeof import("react-i18next")>(),
);

import OptionService from "#/api/option-service/option-service.api";
import {
  AgentServerUIProviders,
  DEFAULT_AGENT_SERVER_ANALYTICS,
  getDefaultI18n,
  getDefaultQueryClient,
  getI18n,
  getQueryClient,
  queryClient,
  setI18n,
  setQueryClient,
} from "#/index";

vi.mock("posthog-js/react", () => ({
  PostHogProvider: ({ children }: { children: React.ReactNode }) => children,
}));

const BaseProbe = ({ translation }: { translation?: string }) => {
  const currentQueryClient = useQueryClient();

  return (
    <div>
      <div data-testid="query-client-kind">
        {currentQueryClient === getDefaultQueryClient() ? "default" : "custom"}
      </div>
      <div data-testid="query-client-value">
        {String(queryClient.getQueryData(["provider-probe"]))}
      </div>
      {translation && <div data-testid="translation-value">{translation}</div>}
      <div data-testid="imperative-translation-value">
        {getI18n().t("PROVIDER$LABEL")}
      </div>
    </div>
  );
};

const DefaultProbe = () => <BaseProbe />;

const CustomProbe = () => {
  const { t } = useTranslation();

  return <BaseProbe translation={t("PROVIDER$LABEL")} />;
};

const createTestI18n = async (value: string) => {
  const instance = createInstance();

  await instance.use(initReactI18next).init({
    lng: "en",
    fallbackLng: "en",
    ns: ["translation"],
    defaultNS: "translation",
    interpolation: { escapeValue: false },
    resources: {
      en: {
        translation: {
          PROVIDER$LABEL: value,
        },
      },
    },
  });

  return instance;
};

afterEach(() => {
  cleanup();
  getDefaultQueryClient().removeQueries({ queryKey: ["provider-probe"] });
  setQueryClient();
  setI18n();
  vi.restoreAllMocks();
});

describe("AgentServerUIProviders", () => {
  it("exports and uses the default query client and i18n instances when props are omitted", async () => {
    const defaultI18n = getDefaultI18n();

    defaultI18n.addResourceBundle(
      "en",
      "translation",
      { PROVIDER$LABEL: "Default provider" },
      true,
      true,
    );
    await defaultI18n.changeLanguage("en");

    getDefaultQueryClient().setQueryData(["provider-probe"], "default-client");

    render(
      <AgentServerUIProviders>
        <DefaultProbe />
      </AgentServerUIProviders>,
    );

    expect(screen.getByTestId("query-client-kind")).toHaveTextContent(
      "default",
    );
    expect(screen.getByTestId("query-client-value")).toHaveTextContent(
      "default-client",
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("imperative-translation-value"),
      ).toHaveTextContent("Default provider");
    });

    expect(getQueryClient()).toBe(getDefaultQueryClient());
  });

  it("injects a custom query client and i18n instance without conflicting with imperative callers", async () => {
    const customQueryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    const customI18n = await createTestI18n("Custom provider");

    customQueryClient.setQueryData(["provider-probe"], "custom-client");

    const view = render(
      <AgentServerUIProviders queryClient={customQueryClient} i18n={customI18n}>
        <CustomProbe />
      </AgentServerUIProviders>,
    );

    expect(screen.getByTestId("query-client-kind")).toHaveTextContent("custom");
    expect(screen.getByTestId("query-client-value")).toHaveTextContent(
      "custom-client",
    );

    await waitFor(() => {
      expect(screen.getByTestId("translation-value")).toHaveTextContent(
        "Custom provider",
      );
      expect(
        screen.getByTestId("imperative-translation-value"),
      ).toHaveTextContent("Custom provider");
    });

    expect(getQueryClient()).toBe(customQueryClient);
    expect(getI18n()).toBe(customI18n);

    view.unmount();

    expect(getQueryClient()).toBe(getDefaultQueryClient());
    expect(getI18n()).toBe(getDefaultI18n());
  });

  it("only mounts PostHog analytics when the host app opts in", async () => {
    const getConfigSpy = vi
      .spyOn(OptionService, "getConfig")
      .mockResolvedValue({ posthog_client_key: "phc_test_key" } as never);

    const noAnalyticsView = render(
      <AgentServerUIProviders>
        <div data-testid="child">child</div>
      </AgentServerUIProviders>,
    );

    expect(screen.getByTestId("child")).toHaveTextContent("child");
    expect(getConfigSpy).not.toHaveBeenCalled();

    noAnalyticsView.unmount();

    render(
      <AgentServerUIProviders analytics={DEFAULT_AGENT_SERVER_ANALYTICS}>
        <div data-testid="child-with-analytics">child</div>
      </AgentServerUIProviders>,
    );

    await waitFor(() => {
      expect(getConfigSpy).toHaveBeenCalledTimes(1);
    });
  });
});
