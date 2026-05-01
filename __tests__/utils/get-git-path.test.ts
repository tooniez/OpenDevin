import { describe, it, expect } from "vitest";
import { DEFAULT_WORKING_DIR } from "#/api/agent-server-config";
import { getGitPath } from "#/utils/get-git-path";

describe("getGitPath", () => {
  const conversationId = "abc123";

  describe("without sandbox grouping (NO_GROUPING)", () => {
    it("should return the default working dir when no repository is selected", () => {
      expect(getGitPath(conversationId, null, false)).toBe(DEFAULT_WORKING_DIR);
      expect(getGitPath(conversationId, undefined, false)).toBe(
        DEFAULT_WORKING_DIR,
      );
    });

    it("should handle standard owner/repo format (GitHub)", () => {
      expect(getGitPath(conversationId, "OpenHands/OpenHands", false)).toBe(
        `${DEFAULT_WORKING_DIR}/OpenHands`,
      );
      expect(getGitPath(conversationId, "facebook/react", false)).toBe(
        `${DEFAULT_WORKING_DIR}/react`,
      );
    });

    it("should handle nested group paths (GitLab)", () => {
      expect(
        getGitPath(conversationId, "modernhealth/frontend-guild/pan", false),
      ).toBe(`${DEFAULT_WORKING_DIR}/pan`);
      expect(getGitPath(conversationId, "group/subgroup/repo", false)).toBe(
        `${DEFAULT_WORKING_DIR}/repo`,
      );
      expect(getGitPath(conversationId, "a/b/c/d/repo", false)).toBe(
        `${DEFAULT_WORKING_DIR}/repo`,
      );
    });

    it("should handle single segment paths", () => {
      expect(getGitPath(conversationId, "repo", false)).toBe(
        `${DEFAULT_WORKING_DIR}/repo`,
      );
    });

    it("should handle empty string", () => {
      expect(getGitPath(conversationId, "", false)).toBe(DEFAULT_WORKING_DIR);
    });
  });

  describe("with sandbox grouping enabled", () => {
    it("should return the grouped default working dir when no repository is selected", () => {
      expect(getGitPath(conversationId, null, true)).toBe(
        `${DEFAULT_WORKING_DIR}/${conversationId}`,
      );
      expect(getGitPath(conversationId, undefined, true)).toBe(
        `${DEFAULT_WORKING_DIR}/${conversationId}`,
      );
    });

    it("should handle standard owner/repo format (GitHub)", () => {
      expect(getGitPath(conversationId, "OpenHands/OpenHands", true)).toBe(
        `${DEFAULT_WORKING_DIR}/${conversationId}/OpenHands`,
      );
      expect(getGitPath(conversationId, "facebook/react", true)).toBe(
        `${DEFAULT_WORKING_DIR}/${conversationId}/react`,
      );
    });

    it("should handle nested group paths (GitLab)", () => {
      expect(
        getGitPath(conversationId, "modernhealth/frontend-guild/pan", true),
      ).toBe(`${DEFAULT_WORKING_DIR}/${conversationId}/pan`);
      expect(getGitPath(conversationId, "group/subgroup/repo", true)).toBe(
        `${DEFAULT_WORKING_DIR}/${conversationId}/repo`,
      );
      expect(getGitPath(conversationId, "a/b/c/d/repo", true)).toBe(
        `${DEFAULT_WORKING_DIR}/${conversationId}/repo`,
      );
    });

    it("should handle single segment paths", () => {
      expect(getGitPath(conversationId, "repo", true)).toBe(
        `${DEFAULT_WORKING_DIR}/${conversationId}/repo`,
      );
    });

    it("should handle empty string", () => {
      expect(getGitPath(conversationId, "", true)).toBe(
        `${DEFAULT_WORKING_DIR}/${conversationId}`,
      );
    });
  });

  describe("default behavior (useSandboxGrouping defaults to false)", () => {
    it("should default to no sandbox grouping", () => {
      expect(getGitPath(conversationId, null)).toBe(DEFAULT_WORKING_DIR);
      expect(getGitPath(conversationId, "owner/repo")).toBe(
        `${DEFAULT_WORKING_DIR}/repo`,
      );
    });
  });

  describe("with a backend-provided workspace path", () => {
    it("prefers the explicit workspace path over derived git paths", () => {
      expect(
        getGitPath(
          conversationId,
          "OpenHands/software-agent-sdk",
          true,
          "/workspace/project/agent-server-gui",
        ),
      ).toBe("/workspace/project/agent-server-gui");
    });

    it("ignores blank workspace paths and falls back to heuristics", () => {
      expect(getGitPath(conversationId, "OpenHands/software-agent-sdk", true, "  ")).toBe(
        `${DEFAULT_WORKING_DIR}/${conversationId}/software-agent-sdk`,
      );
    });
  });
});
