import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useIsOnIntermediatePage } from "#/hooks/use-is-on-intermediate-page";

const useLocationMock = vi.fn();

vi.mock("react-router", async () => ({
  ...(await vi.importActual("react-router")),
  useLocation: () => useLocationMock(),
}));

beforeEach(() => {
  useLocationMock.mockReset();
});

describe("useIsOnIntermediatePage", () => {
  it("returns false for OSS app routes", () => {
    useLocationMock.mockReturnValue({ pathname: "/settings" });

    const { result } = renderHook(() => useIsOnIntermediatePage());

    expect(result.current).toBe(false);
  });

});
