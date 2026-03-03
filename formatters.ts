/**
 * Converts a 24-hour time string (HH:mm) to 12-hour format with AM/PM.
 * Example: "16:00" -> "4:00 PM", "08:30" -> "8:30 AM"
 */
export const formatTime12h = (time24: string): string => {
  if (!time24) return '';
  const [hoursStr, minutesStr] = time24.split(':');
  const hours = parseInt(hoursStr, 10);
  const minutes = minutesStr;
  
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  
  return `${displayHours}:${minutes} ${period}`;
};