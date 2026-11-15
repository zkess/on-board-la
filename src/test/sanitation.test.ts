import { describe, expect, it } from "vitest";
import { hasTrashSchedule } from "@/lib/sanitation";

describe("Trash schedule availability", () => {
  it("treats a dash or missing day as unavailable", () => {
    expect(hasTrashSchedule("—")).toBe(false);
    expect(hasTrashSchedule(null)).toBe(false);
    expect(hasTrashSchedule(undefined)).toBe(false);
    expect(hasTrashSchedule(" ")).toBe(false);
  });
  it("keeps a returned collection day available", () => {
    expect(hasTrashSchedule("Monday")).toBe(true);
    expect(hasTrashSchedule("Friday")).toBe(true);
  });
});