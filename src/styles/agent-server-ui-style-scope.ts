export const AGENT_SERVER_UI_SCOPE_ATTRIBUTE = "data-agent-server-ui";
export const AGENT_SERVER_UI_SCOPE_SELECTOR = `[${AGENT_SERVER_UI_SCOPE_ATTRIBUTE}]`;
export const AGENT_SERVER_UI_DEFAULT_THEME = "dark" as const;

export type AgentServerUITheme = "dark" | "light" | "default";

export const AGENT_SERVER_UI_DEFAULT_CSS_VARIABLES = {
  "--oh-color-primary": "#c9b974",
  "--oh-color-logo": "#cfb755",
  "--oh-color-base": "#0d0f11",
  "--oh-color-base-secondary": "#24272e",
  "--oh-color-danger": "#e76a5e",
  "--oh-color-success": "#a5e75e",
  "--oh-color-basic": "#9099ac",
  "--oh-color-tertiary": "#454545",
  "--oh-color-tertiary-light": "#b7bdc2",
  "--oh-color-content": "#ecedee",
  "--oh-color-content-2": "#f9fbfe",
  "--oh-background": "#0d0f11",
  "--oh-foreground": "#ecedee",
  "--oh-surface": "#24272e",
  "--oh-surface-foreground": "#ecedee",
  "--oh-overlay": "#24272e",
  "--oh-overlay-foreground": "#ecedee",
  "--oh-muted": "#9099ac",
  "--oh-scrollbar": "rgba(208, 217, 250, 0.3)",
  "--oh-default": "#454545",
  "--oh-default-foreground": "#ecedee",
  "--oh-accent": "#c9b974",
  "--oh-accent-foreground": "#0d0f11",
  "--oh-success": "#a5e75e",
  "--oh-success-foreground": "#0d0f11",
  "--oh-warning": "#c9b974",
  "--oh-warning-foreground": "#0d0f11",
  "--oh-danger": "#e76a5e",
  "--oh-danger-foreground": "#f9fbfe",
  "--oh-segment": "#24272e",
  "--oh-segment-foreground": "#ecedee",
  "--oh-border-width": "1px",
  "--oh-field-border-width": "1px",
  "--oh-border": "#717888",
  "--oh-separator": "rgba(113, 120, 136, 0.5)",
  "--oh-focus": "#c9b974",
  "--oh-link": "#ecedee",
  "--oh-radius": "5px",
  "--oh-field-radius": "5px",
  "--oh-surface-shadow": "none",
  "--oh-overlay-shadow": "none",
  "--oh-field-shadow": "none",
  "--oh-bg-dark": "#0c0e10",
  "--oh-bg-light": "#292929",
  "--oh-bg-input": "#393939",
  "--oh-bg-workspace": "#1f2228",
  "--oh-text-editor-base": "#9099ac",
  "--oh-text-editor-active": "#c4cbda",
  "--oh-bg-editor-sidebar": "#24272e",
  "--oh-bg-editor-active": "#31343d",
  "--oh-border-editor-sidebar": "#3c3c4a",
  "--oh-bg-neutral-muted": "#afb8c133",
} as const;

export type AgentServerUICssVariableName =
  keyof typeof AGENT_SERVER_UI_DEFAULT_CSS_VARIABLES;

export type AgentServerUIStyleOverrides = Partial<
  Record<AgentServerUICssVariableName, string>
>;

const GLOBAL_SCOPE_SELECTORS = new Set([":root", "body", "html"]);

export function transformAgentServerUISelector(
  prefix: string,
  selector: string,
  prefixedSelector: string,
): string {
  if (selector.includes(prefix)) {
    return selector;
  }

  if (selector.includes(":host")) {
    return selector.replaceAll(":host", prefix);
  }

  if (GLOBAL_SCOPE_SELECTORS.has(selector.trim())) {
    return prefix;
  }

  return prefixedSelector;
}
