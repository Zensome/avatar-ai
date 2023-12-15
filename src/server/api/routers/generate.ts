import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import OpenAI from "openai";
import { env } from "~/env.mjs";

const openai = new OpenAI({
  apiKey: env.DALLE_API_KEY,
});

async function generateIcon(prompt: string) {
  if (env.MOCK_DALLE === "true") {
    return "https://oaidalleapiprodscus.blob.core.windows.net/private/org-WAw2HFJxhsABQ8NwQcqd6Dx7/user-zMjH3x6RqABWKLUhxYU8GfYv/img-BpAMlz5vKmv1jisqDqgLOekO.png?st=2023-12-15T06%3A35%3A57Z&se=2023-12-15T08%3A35%3A57Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-12-14T18%3A41%3A27Z&ske=2023-12-15T18%3A41%3A27Z&sks=b&skv=2021-08-06&sig=gsgF1sDgxSSp7%2Bp5myCGX5Dbp7eeFssJkDnLQz0P4aE%3D";
  } else {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
    });
    return response.data[0]?.url;
  }
}

export const generateRouter = createTRPCRouter({
  generateIcon: protectedProcedure
    .input(
      z.object({
        prompt: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log("we are here", input.prompt);
      // TODO: verify the user has enough credit
      const { count } = await ctx.prisma.user.updateMany({
        where: {
          id: ctx.session.user.id, //replace with real id
          credits: {
            gte: 1,
          },
        },
        data: {
          credits: {
            decrement: 1,
          },
        },
      });

      if (count <= 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You do not have enough credits",
        });
      }

      const url = await generateIcon(input.prompt);

      return {
        imageUrl: url,
      };
    }),
});
