import { renderHook, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useRememberedAddress } from "@/hooks/use-remembered-address";

const { navigate } = vi.hoisted(() => ({ navigate: vi.fn() }));
vi.mock("@tanstack/react-router", () => ({ useNavigate: () => navigate, useLocation: () => "/explore/checklist" }));

describe("Address context on direct page switches", () => {
  beforeEach(() => { sessionStorage.clear(); navigate.mockClear(); });
  afterEach(cleanup);

  it("restores Rod Place after switching directly to a page with an empty address", () => {
    const dashboard = renderHook(() => useRememberedAddress("24642 rod place"));
    dashboard.unmount();
    renderHook(() => useRememberedAddress(""));
    expect(navigate).toHaveBeenCalledTimes(1);
    const options = navigate.mock.calls[0]?.[0];
    expect(options.search({ q: "" })).toEqual({ q: "24642 rod place" });
    expect(options.replace).toBe(true);
    expect(options.to).toBe("/explore/checklist");
  });

  it("lets an explicit new address replace the remembered address", () => {
    const dashboard = renderHook(() => useRememberedAddress("24642 rod place"));
    dashboard.unmount();
    const next = renderHook(() => useRememberedAddress("638 S Beacon St, San Pedro"));
    expect(navigate).not.toHaveBeenCalled();
    next.unmount();
    renderHook(() => useRememberedAddress(""));
    expect(navigate.mock.calls[0]?.[0].search({ q: "" })).toEqual({ q: "638 S Beacon St, San Pedro" });
  });

  it("does not restore an address for a fresh tab", () => {
    renderHook(() => useRememberedAddress(""));
    expect(navigate).not.toHaveBeenCalled();
  });
});