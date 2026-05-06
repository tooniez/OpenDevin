import React from "react";
import { screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { renderWithProviders } from "test-utils";

vi.mock("#/components/features/controls/agent-status", () => ({
  AgentStatus: () => <div data-testid="agent-status-stub" />,
}));

vi.mock("#/components/features/controls/tools", () => ({
  Tools: () => <div data-testid="tools-stub" />,
}));

// Sentinel: this stub only renders if a future change re-imports
// ChangeAgentButton in ChatInputActions, which would fail the assertion below.
vi.mock("#/components/features/chat/change-agent-button", () => ({
  ChangeAgentButton: () => <div data-testid="change-agent-button-stub" />,
}));

// Mock the underlying mutation service module that the pause/resume hooks call.
vi.mock("#/hooks/mutation/conversation-mutation-utils", () => ({
  pauseV1Conversation: vi.fn(),
  resumeV1Conversation: vi.fn(),
  askV1Agent: vi.fn(),
  updateConversationExecutionStatusInCache: vi.fn(),
  invalidateConversationQueries: vi.fn(),
}));

// eslint-disable-next-line import/first
import { ChatInputActions } from "#/components/features/chat/components/chat-input-actions";

describe("ChatInputActions", () => {
  it("does not render the Change Agent button while the planning agent feature is disabled", () => {
    // Arrange + Act
    renderWithProviders(<ChatInputActions disabled={false} />);

    // Assert
    expect(
      screen.queryByTestId("change-agent-button-stub"),
    ).not.toBeInTheDocument();
  });
});
