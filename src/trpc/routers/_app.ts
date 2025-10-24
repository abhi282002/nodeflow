import {baseProcedure, createTRPCRouter, protectedProcedure} from "../init";
import prisma from "@/lib/db";
import {inngest} from "@/inngest/client";

export const appRouter = createTRPCRouter({
    testAi: protectedProcedure.mutation(async () => {
        await inngest.send({
            name: "execute/ai"
        })
        return {success: true, message: "Job queued successfully."};
    }),

    getWorkflows: baseProcedure.query(({ctx}) => {
        return prisma.workflow.findMany()

    }),

    createWorkflows: baseProcedure.mutation(() => {
        return prisma.workflow.create({
            data: {
                name: "test-workflow"

            }
        })
    })

});

export type AppRouter = typeof appRouter;
