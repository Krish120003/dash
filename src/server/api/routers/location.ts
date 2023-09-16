import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "../trpc"
import { db } from "~/server/db"
import { LocationType } from "@prisma/client"



export const locationRouter = createTRPCRouter({
    saveLocation: protectedProcedure.input(
        z.object(
            {
                type: z.nativeEnum(LocationType),
                coordinates: z.object(
                    {
                        latitude: z.number(),
                        longitude: z.number()
                    }
                ),
                radius: z.number()
            }
        )

    ).mutation(async ({ input, ctx }) => {
        await db.location.create({
            data: {
                type: input.type,
                latitude: input.coordinates.latitude,
                longitude: input.coordinates.longitude,
                radius: input.radius,
                user: {
                    connect: {
                        id: ctx.session.user.id
                    }
                }
            }
        })
    })
})