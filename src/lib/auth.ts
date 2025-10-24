import {checkout, polar, portal} from "@polar-sh/better-auth"
import {betterAuth} from "better-auth";
import {prismaAdapter} from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path
import {PrismaClient} from "@/generated/prisma";
import prisma from "./db";
import {polarClient} from "@/lib/polar";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
    },
    plugins: [
        polar({
            client: polarClient,
            createCustomerOnSignUp: true,
            use: [
                checkout({
                    products: [
                        {
                            productId: "26251340-478d-4191-8510-7c34ad1c49b6",
                            slug: "nodebase pro"
                        }
                    ],
                    successUrl: process.env.POLAR_SUCCESS_URL,
                    authenticatedUsersOnly: true
                }),
                portal()
            ]
        })
    ]
});
