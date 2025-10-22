import { z } from "zod";

import {baseProcedure, createTRPCRouter, protectedProcedure} from "../init";
import prisma from "@/lib/db";

export const appRouter = createTRPCRouter({
  getUsers: protectedProcedure
    .query(({ctx})=>{
        return prisma.user.findUnique({
            where:{
                id:ctx.auth.user.id
            }
        })
    })
});

export type AppRouter = typeof appRouter;
