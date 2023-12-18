import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { generateRouter } from "./routers/generate";
import { checkoutRouter } from "~/server/api/routers/checkout";
import { iconsRouter } from "./routers/icons";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  // a generate router for user to actually gen icons
  generate: generateRouter,
  checkout: checkoutRouter,
  icons: iconsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
