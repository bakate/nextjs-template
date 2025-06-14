import { text, timestamp, pgTable } from "drizzle-orm/pg-core";

export const users = pgTable("user", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  fullName: text("full_name"),
  email: text("email").unique().notNull(),
  image: text("image"),
  phone: text("phone").unique(),

  lastLoginAt: timestamp("lastLoginAt", { mode: "date" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
