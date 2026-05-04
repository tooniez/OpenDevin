import React from "react";
import { useNavigation } from "#/context/navigation-context";
import useMetricsStore from "#/stores/metrics-store";
import { useDeleteConversation } from "./mutation/use-delete-conversation";
import { useUnifiedPauseConversationSandbox } from "./mutation/use-unified-stop-conversation";
import { useEventStore } from "#/stores/use-event-store";

import { useDownloadConversation } from "./use-download-conversation";
import {
  adaptSystemMessage,
  SystemMessageForModal,
} from "#/utils/system-message-adapter";
import { V1SandboxStatus } from "#/api/sandbox-service/sandbox-service.types";

interface UseConversationNameContextMenuProps {
  conversationId?: string;
  sandboxStatus?: V1SandboxStatus;
  showOptions?: boolean;
  onContextMenuToggle?: (isOpen: boolean) => void;
}

export function useConversationNameContextMenu({
  conversationId,
  sandboxStatus = "MISSING",
  showOptions = false,
  onContextMenuToggle,
}: UseConversationNameContextMenuProps) {
  const { conversationId: currentConversationId, navigate } = useNavigation();
  const events = useEventStore((state) => state.events);
  const { mutate: deleteConversation } = useDeleteConversation();
  const { mutate: stopConversation } = useUnifiedPauseConversationSandbox();
  const metrics = useMetricsStore();

  const [metricsModalVisible, setMetricsModalVisible] = React.useState(false);
  const [systemModalVisible, setSystemModalVisible] = React.useState(false);
  const [skillsModalVisible, setSkillsModalVisible] = React.useState(false);
  const [hooksModalVisible, setHooksModalVisible] = React.useState(false);
  const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] =
    React.useState(false);
  const [confirmStopModalVisible, setConfirmStopModalVisible] =
    React.useState(false);
  const { mutateAsync: downloadConversation } = useDownloadConversation();

  const systemMessage: SystemMessageForModal | null =
    adaptSystemMessage(events);

  const handleDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setConfirmDeleteModalVisible(true);
    onContextMenuToggle?.(false);
  };

  const handleStop = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setConfirmStopModalVisible(true);
    onContextMenuToggle?.(false);
  };

  const handleConfirmDelete = () => {
    if (conversationId) {
      deleteConversation(
        { conversationId },
        {
          onSuccess: () => {
            if (conversationId === currentConversationId) {
              navigate("/");
            }
          },
        },
      );
    }
    setConfirmDeleteModalVisible(false);
  };

  const handleConfirmStop = () => {
    if (conversationId) {
      stopConversation({ conversationId });
    }
    setConfirmStopModalVisible(false);
  };

  const handleEdit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    // This will be handled by the parent component to switch to edit mode
    onContextMenuToggle?.(false);
  };

  const handleDownloadConversation = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    if (conversationId) {
      await downloadConversation(conversationId);
    }
    onContextMenuToggle?.(false);
  };

  const handleDisplayCost = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setMetricsModalVisible(true);
    onContextMenuToggle?.(false);
  };

  const handleShowAgentTools = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setSystemModalVisible(true);
    onContextMenuToggle?.(false);
  };

  const handleShowSkills = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setSkillsModalVisible(true);
    onContextMenuToggle?.(false);
  };

  const handleShowHooks = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setHooksModalVisible(true);
    onContextMenuToggle?.(false);
  };

  return {
    // Handlers
    handleDelete,
    handleStop,
    handleEdit,
    handleDownloadConversation,
    handleDisplayCost,
    handleShowAgentTools,
    handleShowSkills,
    handleShowHooks,
    handleConfirmDelete,
    handleConfirmStop,

    // Modal states
    metricsModalVisible,
    setMetricsModalVisible,
    systemModalVisible,
    setSystemModalVisible,
    skillsModalVisible,
    setSkillsModalVisible,
    hooksModalVisible,
    setHooksModalVisible,
    confirmDeleteModalVisible,
    setConfirmDeleteModalVisible,
    confirmStopModalVisible,
    setConfirmStopModalVisible,

    // Data
    metrics,
    systemMessage,

    // Computed values for conditional rendering
    shouldShowStop: sandboxStatus !== "MISSING",
    shouldShowDownloadConversation: Boolean(conversationId && showOptions),
    shouldShowDisplayCost: showOptions,
    shouldShowAgentTools: Boolean(showOptions && systemMessage),
    shouldShowSkills: Boolean(showOptions && conversationId),
    shouldShowHooks: Boolean(
      showOptions && conversationId && sandboxStatus === "RUNNING",
    ),
  };
}
