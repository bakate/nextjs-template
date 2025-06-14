import { Locale } from "@/i18n/request";
import { defaultFormats } from "@/i18n/config";
import fr from "./messages/fr.json";

declare module "next-intl" {
  interface AppConfig {
    Messages: typeof fr;
    Locale: Locale;
    Formats: typeof defaultFormats;
  }
}
