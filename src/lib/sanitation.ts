/** A missing civic-layer schedule does not establish who collects this property's bins. */
export function hasTrashSchedule(day: string | null | undefined): boolean {
  const value = day?.trim();
  return Boolean(value && value !== "—");
}