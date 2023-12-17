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

async function generateIcon(prompt: string, numberOfIcons = 1) {
  if (env.MOCK_DALLE === "true") {
    return new Array<string>(numberOfIcons).fill(base64Image);
  } else {
    const response = await openai.images.generate({
      model: "dall-e-2",
      prompt,
      n: numberOfIcons,
      size: "1024x1024",
      response_format: "b64_json",
    });

    return response.data.map((result) => result.b64_json || "");
  }
}

export const generateRouter = createTRPCRouter({
  generateIcon: protectedProcedure
    .input(
      z.object({
        prompt: z.string(),
        color: z.string(),
        shape: z.string(),
        style: z.string(),
        numberOfIcons: z.number().min(1).max(10),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log("we are here", input.prompt);
      // TODO: verify the user has enough credit
      const { count } = await ctx.prisma.user.updateMany({
        where: {
          id: ctx.session.user.id, //replace with real id
          credits: {
            gte: input.numberOfIcons,
          },
        },
        data: {
          credits: {
            decrement: input.numberOfIcons,
          },
        },
      });

      if (count <= 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You do not have enough credits",
        });
      }

      const finalPrompt = `a modern ${input.shape} icon in ${input.color} of ${input.prompt}, ${input.style}, minimialistic, high quality, trending on art station, unreal engine graphics quality`;

      const base64EncodedImages = await generateIcon(
        finalPrompt, // Cast finalPrompt to string to resolve the type error
        input.numberOfIcons
      );
      console.log("base64EncodedImages", base64EncodedImages?.length);
      const createdIcons = await Promise.all(
        (Array.isArray(base64EncodedImages)
          ? base64EncodedImages
          : [base64EncodedImages]
        ).map(async (image: string | undefined) => {
          const icon = await ctx.prisma.icon.create({
            data: {
              prompt: input.prompt,
              userId: ctx.session.user.id,
            },
          });
          await s3
            .putObject({
              Bucket: BUCKET_NAME,
              Body: Buffer.from(image as string, "base64"),
              Key: icon.id,
              ContentEncoding: "base64",
              ContentType: "image/png",
            })
            .promise();
          return icon;
        })
      );

      return createdIcons.map((icon) => {
        return {
          imageUrl: `https://${BUCKET_NAME}.s3.amazonaws.com/${icon.id}`,
        };
      });
    }),
});
