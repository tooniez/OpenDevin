import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { I18nKey } from "#/i18n/declaration";
import V1ConversationService from "#/api/conversation-service/v1-conversation-service.api";
import {
  displayErrorToast,
  displaySuccessToast,
  TOAST_OPTIONS,
} from "#/utils/custom-toast-handlers";
import { useNavigation } from "#/context/navigation-context";
import { useActiveConversation } from "#/hooks/query/use-active-conversation";

export const useNewConversationCommand = () => {
  const queryClient = useQueryClient();
  const { navigate } = useNavigation();
  const { t } = useTranslation("openhands");
  const { data: conversation } = useActiveConversation();

  const mutation = useMutation({
    mutationFn: async () => {
      if (!conversation?.id) {
        throw new Error("No active conversation");
      }

      const startTask = await V1ConversationService.createConversation();

      if (!startTask.app_conversation_id) {
        throw new Error(
          startTask.detail || "Failed to create new conversation",
        );
      }

      return {
        newConversationId: startTask.app_conversation_id,
        oldConversationId: conversation.id,
      };
    },
    onMutate: () => {
      toast.loading(t(I18nKey.CONVERSATION$CLEARING), {
        ...TOAST_OPTIONS,
        id: "clear-conversation",
      });
    },
    onSuccess: (data) => {
      toast.dismiss("clear-conversation");
      displaySuccessToast(t(I18nKey.CONVERSATION$CLEAR_SUCCESS));
      navigate(`/conversations/${data.newConversationId}`);

      queryClient.invalidateQueries({
        queryKey: ["user", "conversations"],
      });
      queryClient.invalidateQueries({
        queryKey: ["v1-batch-get-app-conversations"],
      });
    },
    onError: (error) => {
      toast.dismiss("clear-conversation");
      let clearError = t(I18nKey.CONVERSATION$CLEAR_UNKNOWN_ERROR);
      if (error instanceof Error) {
        clearError = error.message;
      } else if (typeof error === "string") {
        clearError = error;
      }
      displayErrorToast(
        t(I18nKey.CONVERSATION$CLEAR_FAILED, { error: clearError }),
      );
    },
  });

  return mutation;
};
