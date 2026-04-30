import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nextProvider } from "react-i18next";
import { type i18n as I18nInstance } from "i18next";
import {
  getDefaultQueryClient,
  getQueryClient,
  setQueryClient,
} from "#/query-client-config";
import { getDefaultI18n, getI18n, setI18n } from "#/i18n";
import { PostHogWrapper } from "./posthog-wrapper";

export type AgentServerUIAnalyticsConfig =
  | {
      provider: "posthog";
    }
  | false
  | null;

export const DEFAULT_AGENT_SERVER_ANALYTICS: AgentServerUIAnalyticsConfig = {
  provider: "posthog",
};

export interface AgentServerUIProvidersProps {
  children: React.ReactNode;
  queryClient?: QueryClient;
  analytics?: AgentServerUIAnalyticsConfig;
  i18n?: I18nInstance;
}

export function AgentServerUIProviders({
  children,
  queryClient,
  analytics,
  i18n,
}: AgentServerUIProvidersProps) {
  const resolvedQueryClient = React.useMemo(
    () => queryClient ?? getDefaultQueryClient(),
    [queryClient],
  );
  const resolvedI18n = React.useMemo(() => i18n ?? getDefaultI18n(), [i18n]);
  const previousProvidersRef = React.useRef<{
    queryClient: QueryClient;
    i18n: I18nInstance;
  } | null>(null);

  if (!previousProvidersRef.current) {
    previousProvidersRef.current = {
      queryClient: getQueryClient(),
      i18n: getI18n(),
    };
  }

  setQueryClient(resolvedQueryClient);
  setI18n(resolvedI18n);

  React.useEffect(
    () => () => {
      if (previousProvidersRef.current) {
        setQueryClient(previousProvidersRef.current.queryClient);
        setI18n(previousProvidersRef.current.i18n);
      }
    },
    [],
  );

  const content =
    analytics && analytics.provider === "posthog" ? (
      <PostHogWrapper>{children}</PostHogWrapper>
    ) : (
      children
    );

  return (
    <I18nextProvider i18n={resolvedI18n} defaultNS="translation">
      <QueryClientProvider client={resolvedQueryClient}>
        {content}
      </QueryClientProvider>
    </I18nextProvider>
  );
}
