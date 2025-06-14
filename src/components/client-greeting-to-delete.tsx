"use client";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useTranslations } from "next-intl";

export const ClientGreeting = () => {
  const trpc = useTRPC();
  const greeting = useQuery(trpc.hello.queryOptions({ text: "ad welcome to the tRPC world" }));
  const t = useTranslations("HomePage");

  if (!greeting.data) return <div>Loading...</div>;
  return (
    <div className="grid place-content-center min-h-screen gap-3 place-items-center">
      <h1 className="text-3xl font-bold">{greeting.data.greeting}</h1>
      {t("test")}
    </div>
  );
};
