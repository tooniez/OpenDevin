/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface Window {
  __GITHUB_CLIENT_ID__?: string | null;
  posthog?: {
    capture: (event: string, properties?: Record<string, unknown>) => void;
  };
}
