/**
 * Format a date string (YYYY-MM-DD) into a human-readable format
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Formatted date string (e.g., "Saturday, December 13, 2025")
 */
export const formatDateForDisplay = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
