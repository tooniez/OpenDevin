import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { V1ExecutionStatus } from "#/types/v1/core/base/common";
import { cn } from "#/utils/utils";
import { StyledTooltip } from "#/components/shared/buttons/styled-tooltip";

interface ConversationStatusDotProps {
  executionStatus: V1ExecutionStatus | null | undefined;
}

const labelKeyFor = (status: V1ExecutionStatus | null | undefined): string => {
  switch (status) {
    case V1ExecutionStatus.RUNNING:
    case V1ExecutionStatus.IDLE:
    case V1ExecutionStatus.WAITING_FOR_CONFIRMATION:
    case V1ExecutionStatus.FINISHED:
      return "COMMON$RUNNING";
    case V1ExecutionStatus.PAUSED:
      return "COMMON$PAUSED";
    case V1ExecutionStatus.ERROR:
    case V1ExecutionStatus.STUCK:
      return "COMMON$STOPPED";
    default:
      return "COMMON$STOPPED";
  }
};

export function ConversationStatusDot({
  executionStatus,
}: ConversationStatusDotProps) {
  const { t } = useTranslation("openhands");

  const backgroundColor = useMemo(() => {
    switch (executionStatus) {
      case V1ExecutionStatus.RUNNING:
      case V1ExecutionStatus.IDLE:
      case V1ExecutionStatus.WAITING_FOR_CONFIRMATION:
      case V1ExecutionStatus.FINISHED:
        return "bg-[#1FBD53]";
      case V1ExecutionStatus.PAUSED:
        return "bg-[#A3A3A3]";
      case V1ExecutionStatus.ERROR:
      case V1ExecutionStatus.STUCK:
        return "bg-[#A3A3A3]";
      default:
        return "bg-[#3C3C49]";
    }
  }, [executionStatus]);

  const label = t(labelKeyFor(executionStatus));

  return (
    <StyledTooltip
      content={label}
      placement="right"
      showArrow
      tooltipClassName="bg-[#1a1a1a] text-white text-xs shadow-lg"
    >
      <div className={cn("w-1.5 h-1.5 rounded-full", backgroundColor)} />
    </StyledTooltip>
  );
}
