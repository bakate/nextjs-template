import { initTRPC, TRPCError } from "@trpc/server";
import SuperJSON from "superjson";
import { ZodError } from "zod";

export interface Context {
  userId: string | undefined;
  user?: Record<string, unknown>;
}

/**
 * Creates the tRPC context for procedures with offline mode handling
 */

export const createTRPCContext = async (): Promise<Context> => {
  try {
    // const supabase = await createClient();
    // const {
    //   data: { user },
    // } = await supabase.auth.getUser();

    // retrieve session from auth or supabase or something else

    return {
      userId: undefined,
      // userId: user?.id,
    };
  } catch (error) {
    console.error("Error creating tRPC context:", error);
    return {
      userId: undefined,
    };
  }
};

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<Context>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: SuperJSON,
  errorFormatter: ({ shape, error }) => {
    return {
      ...shape,
      data: {
        ...shape.data,
        message:
          error.code === "BAD_REQUEST" && error.cause instanceof ZodError
            ? error.cause.errors[0]?.message || "Erreur de validation"
            : error.message,
      },
    };
  },
});

/**
 * Procedure that requires authentication and internet connection
 */
export const authedProcedure = t.procedure.use(async function isAuthed({ ctx, next }) {
  const { userId } = ctx;

  // Verify authentication
  if (!userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  try {
    const user = {};
    // const [user] = await db
    //   .select({
    //     id: users.id,
    //     fullName: users.fullName,
    //     email: users.email,
    //     phone: users.phone,
    //   })
    //   .from(users)
    //   .where(eq(users.authId, userId))
    //   .limit(1);

    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    return next({
      ctx: {
        ...ctx,
        user,
      },
    });
  } catch (error) {
    console.error("Error retrieving user:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Could not retrieve user from database",
    });
  }
});

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
