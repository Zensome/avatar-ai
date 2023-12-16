import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import OpenAI from "openai";
import { env } from "~/env.mjs";
import { base64Image } from "~/data/base64Image";
import AWS from "aws-sdk";

const openai = new OpenAI({
  apiKey: env.DALLE_API_KEY,
});

const s3 = new AWS.S3({
  accessKeyId: env.SECRET_ACCESS_KEY_ID,
  secretAccessKey: env.SECRET_ACCESS_KEY,
});

const BUCKET_NAME = "avatar-ai-s3";

async function generateIcon(prompt: string) {
  if (env.MOCK_DALLE === "true") {
    return base64Image;
  } else {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });

    return response.data[0]?.b64_json;
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

      const base64EncodedImage = await generateIcon(input.prompt);

      const icon = await ctx.prisma.icon.create({
        data: {
          prompt: input.prompt,
          userId: ctx.session.user.id,
        },
      });

      if (base64EncodedImage) {
        await s3
          .putObject({
            Bucket: BUCKET_NAME,
            Key: icon.id,
            Body: Buffer.from(base64EncodedImage, "base64"),
            ContentEncoding: "base64",
            ContentType: "image/png",
          })
          .promise();
      }

      return {
        imageUrl: `https://${BUCKET_NAME}.s3.amazonaws.com/${icon.id}`,
      };
    }),
});
