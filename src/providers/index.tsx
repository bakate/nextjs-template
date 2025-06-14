"use client";

import { Toaster } from "sonner";
import { AbstractIntlMessages, Locale, NextIntlClientProvider } from "next-intl";

import { TRPCReactProvider } from "@/trpc/client";
import { defaultTimeZone } from "@/i18n/config";

type Props = {
  children: React.ReactNode;
  // session: Session | null;
  messages: AbstractIntlMessages;
  locale: Locale;
};

export function Providers({ children, messages, locale }: Props) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone={defaultTimeZone}>
      <Toaster position="bottom-right" closeButton richColors />
      <TRPCReactProvider>{children}</TRPCReactProvider>
    </NextIntlClientProvider>
  );
}
