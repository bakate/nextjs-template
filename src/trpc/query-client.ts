import { QueryClient, defaultShouldDehydrateQuery } from "@tanstack/react-query";
import superjson from "superjson";
import { env } from "@/config/env";

const isProd = env.NEXT_PUBLIC_NODE_ENV === "production";

export function makeQueryClient(options = {}) {
  return new QueryClient({
    ...options,
    defaultOptions: {
      queries: {
        staleTime: isProd ? 1000 * 60 * 30 : 1000 * 60 * 1,
        // Keep data for 10 days
        gcTime: 1000 * 60 * 60 * 24 * 1,
      },
      dehydrate: {
        serializeData: superjson.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === "pending",
      },
      hydrate: {
        deserializeData: superjson.deserialize,
      },
    },
  });
}
