export const defaultTimeZone = "Europe/Paris";

export const defaultFormats = {
  dateTime: {
    short: {
      day: "numeric" as const,
      month: "short" as const,
      year: "numeric" as const,
    },
    medium: {
      day: "numeric" as const,
      month: "long" as const,
      year: "numeric" as const,
    },
  },
};
