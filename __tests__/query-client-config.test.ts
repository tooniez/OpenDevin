import { AxiosError } from "axios";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createAgentServerQueryClient } from "#/query-client-config";
import * as ToastHandlers from "#/utils/custom-toast-handlers";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("createAgentServerQueryClient", () => {
  it("does not show a toast when query meta disables toasts", async () => {
    const toastSpy = vi.spyOn(ToastHandlers, "displayErrorToast");
    const client = createAgentServerQueryClient();

    await expect(
      client.fetchQuery({
        queryKey: ["config", "suppressed"],
        queryFn: async () => {
          throw new AxiosError("suppressed query error");
        },
        meta: { disableToast: true },
        retry: false,
      }),
    ).rejects.toThrow("suppressed query error");

    expect(toastSpy).not.toHaveBeenCalled();
  });

  it("shows a toast when query meta does not disable toasts", async () => {
    const toastSpy = vi.spyOn(ToastHandlers, "displayErrorToast");
    const client = createAgentServerQueryClient();

    await expect(
      client.fetchQuery({
        queryKey: ["config", "toast"],
        queryFn: async () => {
          throw new AxiosError("query error with toast");
        },
        retry: false,
      }),
    ).rejects.toThrow("query error with toast");

    expect(toastSpy).toHaveBeenCalledWith("query error with toast");
  });
});
