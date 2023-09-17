import { z } from "zod";
import { env } from "~/env.mjs";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { JsonArray } from "@prisma/client/runtime/library";

const layoutDataSchema = z.array(
  z.object({
    widget_type: z.string(),
    data: z.unknown(), // fix this
    layout: z.object({
      i: z.string(),
      x: z.number().int(),
      y: z.number().int(),
      w: z.number().int(),
      h: z.number().int(),
    }),
  }),
);

export const layoutRouter = createTRPCRouter({
  getLayouts: protectedProcedure.query(async ({ ctx }) => {
    // get the current user from the session
    const user = ctx.session.user;

    // get the layouts for the current user
    const layouts = await ctx.db.layout.findMany({
      where: {
        userId: user.id,
      },
    });

    // return the layouts
    if (!layouts || layouts.length === 0) {
      // if there are no layouts, create a default layout
      const defaultLayout = layoutDataSchema.parse([
        {
          widget_type: "weather",
          data: {},
          layout: { i: "0", x: 0, y: 0, w: 4, h: 2, minW: 2 },
        },
      ]);

      const data = {
        userId: ctx.session.user.id,
        name: "Default Layout",
        layoutData: JSON.stringify(defaultLayout),
      };
      await ctx.db.layout.create({ data });

      return [
        {
          ...data,
          layoutData: layoutDataSchema.parse(data.layoutData),
          id: ctx.session.user.id,
          locationId: null,
        },
      ];
    }

    const parsed = layouts.map((data) => {
      return {
        ...data,
        layoutData: layoutDataSchema.parse(
          JSON.parse(data.layoutData as string),
        ),
      };
    });
    return parsed;
  }),

  updateLayout: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          name: z.string().optional(),
          layoutData: layoutDataSchema.optional(),
          locationId: z.string().optional(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.layout.update({
        where: {
          id: input.id,
        },
        data: {
          ...input.data,
          layoutData: JSON.stringify(input.data.layoutData),
          //   layoutData: input.data.layoutData as JsonArray,
        },
      });
    }),
  createLayout: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        layoutData: layoutDataSchema,
        locationId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.layout.create({
        data: {
          userId: ctx.session.user.id,
          name: input.name,
          layoutData: input.layoutData as JsonArray,
        },
      });
    }),
});
//
