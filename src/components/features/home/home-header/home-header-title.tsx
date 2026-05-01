import { useTranslation } from "react-i18next";
import { Typography } from "#/ui/typography";

export function HomeHeaderTitle() {
  const { t } = useTranslation("openhands");

  return (
    <div className="h-[80px] flex items-center">
      <Typography.H1>{t("HOME$LETS_START_BUILDING")}</Typography.H1>
    </div>
  );
}
