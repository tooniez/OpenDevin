import { useQuery } from "@tanstack/react-query";
import V1ConversationService from "#/api/conversation-service/v1-conversation-service.api";
import { useSettings } from "#/hooks/query/use-settings";

export const useStartTasks = (limit = 10) => {
  const { data: settings } = useSettings();
  const isV1Enabled = settings?.v1_enabled;

  return useQuery({
    queryKey: ["start-tasks", "search", limit],
    queryFn: () => V1ConversationService.searchStartTasks(limit),
    enabled: isV1Enabled,
    select: (tasks) =>
      tasks.filter(
        (task) => task.status !== "READY" && task.status !== "ERROR",
      ),
  });
};
