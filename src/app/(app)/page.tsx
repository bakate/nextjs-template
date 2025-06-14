import { ClientGreeting } from "@/components/client-greeting-to-delete";
import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";

export default async function Home() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.hello.queryOptions({
      text: "ad welcome to the tRPC world",
    })
  );

  return (
    <HydrateClient>
      <ClientGreeting />
    </HydrateClient>
  );
}
