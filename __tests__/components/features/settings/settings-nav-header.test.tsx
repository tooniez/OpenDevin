import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SettingsNavHeader } from "#/components/features/settings/settings-nav-header";
import { I18nKey } from "#/i18n/declaration";

describe("SettingsNavHeader", () => {
  it("should render the translated header text", () => {
    render(<SettingsNavHeader text={I18nKey.SETTINGS$PERSONAL_SETTINGS_HEADER} />);

    expect(
      screen.getByText("SETTINGS$PERSONAL_SETTINGS_HEADER"),
    ).toBeInTheDocument();
  });

  it("should accept custom className", () => {
    const { container } = render(
      <SettingsNavHeader
        text={I18nKey.SETTINGS$PERSONAL_SETTINGS_HEADER}
        className="px-2 pt-2 pb-1"
      />,
    );

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass("px-2");
    expect(wrapper).toHaveClass("pt-2");
    expect(wrapper).toHaveClass("pb-1");
  });
});
