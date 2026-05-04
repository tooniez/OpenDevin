import { describe, it, expect } from "vitest";
import {
  getStatusCode,
  getIndicatorColor,
  IndicatorColor,
} from "#/utils/status";
import { AgentState } from "#/types/agent-state";
import { I18nKey } from "#/i18n/declaration";
import { V1ExecutionStatus } from "#/types/v1/core";

describe("getStatusCode", () => {
  it("returns RUNNING_TASK when execution status is running", () => {
    const result = getStatusCode("OPEN", V1ExecutionStatus.RUNNING);
    expect(result).toBe(I18nKey.AGENT_STATUS$RUNNING_TASK);
  });

  it("returns WAITING_FOR_TASK when execution status is idle", () => {
    const result = getStatusCode("OPEN", V1ExecutionStatus.IDLE);
    expect(result).toBe(I18nKey.AGENT_STATUS$WAITING_FOR_TASK);
  });

  it("returns STOPPED when execution status is paused", () => {
    const result = getStatusCode("OPEN", V1ExecutionStatus.PAUSED);
    expect(result).toBe(I18nKey.CHAT_INTERFACE$STOPPED);
  });

  it("returns starting i18n key when task is running setup", () => {
    const result = getStatusCode(
      "OPEN",
      null,
      "STARTING_CONVERSATION",
    );
    expect(result).toBe(I18nKey.CONVERSATION$STARTING_CONVERSATION);
  });

  it("prioritises task ERROR over websocket CONNECTING", () => {
    const result = getStatusCode("CONNECTING", null, "ERROR");
    expect(result).toBe(I18nKey.AGENT_STATUS$ERROR_OCCURRED);
  });

  it("returns DISCONNECTED when websocket is closed and no task", () => {
    const result = getStatusCode("CLOSED", V1ExecutionStatus.IDLE);
    expect(result).toBe(I18nKey.CHAT_INTERFACE$DISCONNECTED);
  });
});

describe("getIndicatorColor", () => {
  it("prioritises agent readiness over stale runtime status for AWAITING_USER_INPUT", () => {
    const result = getIndicatorColor(
      "OPEN",
      "RUNNING",
      "STATUS$STARTING_RUNTIME",
      AgentState.AWAITING_USER_INPUT,
    );
    expect(result).toBe(IndicatorColor.BLUE);
  });

  it("returns red when websocket is closed", () => {
    const result = getIndicatorColor(
      "CLOSED",
      "STOPPED",
      "STATUS$STOPPED",
      AgentState.RUNNING,
    );
    expect(result).toBe(IndicatorColor.RED);
  });

  it("returns yellow when agent is loading", () => {
    const result = getIndicatorColor(
      "OPEN",
      "STARTING",
      "STATUS$STARTING_RUNTIME",
      AgentState.LOADING,
    );
    expect(result).toBe(IndicatorColor.YELLOW);
  });

  it("returns orange for AWAITING_USER_CONFIRMATION", () => {
    const result = getIndicatorColor(
      "OPEN",
      "RUNNING",
      "STATUS$STARTING_RUNTIME",
      AgentState.AWAITING_USER_CONFIRMATION,
    );
    expect(result).toBe(IndicatorColor.ORANGE);
  });

  it("returns green for FINISHED state", () => {
    const result = getIndicatorColor(
      "OPEN",
      "RUNNING",
      "STATUS$SETTING_UP_WORKSPACE",
      AgentState.FINISHED,
    );
    expect(result).toBe(IndicatorColor.GREEN);
  });
});
