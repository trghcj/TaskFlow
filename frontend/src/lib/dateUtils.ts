import { formatInTimeZone } from 'date-fns-tz';
import { useSettingsStore } from '@/store/useSettingsStore';

// Map the readable timezone strings to IANA timezone identifiers
const TIMEZONE_MAP: Record<string, string> = {
  "Pacific Time (PT)": "America/Los_Angeles",
  "Eastern Time (ET)": "America/New_York",
  "Coordinated Universal Time (UTC)": "UTC",
  "Central European Time (CET)": "Europe/Paris"
};

export const formatUserDate = (date: Date | string | number, formatStr: string = 'PP') => {
  if (!date) return '';
  
  const state = useSettingsStore.getState();
  const ianaTz = TIMEZONE_MAP[state.timezone] || "UTC";
  
  try {
    return formatInTimeZone(new Date(date), ianaTz, formatStr);
  } catch (e) {
    console.error("Invalid date or timezone", e);
    return String(date);
  }
};
