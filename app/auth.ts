import NextAuth from 'next-auth';
import Github from 'next-auth/providers/github';
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from '@/app/lib/prisma';

export const { auth, handlers, signIn, signOut } = NextAuth({
    providers: [Github],
    adapter: PrismaAdapter(prisma),
    callbacks: {
        async session({ session, user }) {
            if (session.user) {
                session.user.id = user.id;
                const dbUser = await prisma.user.findUnique({
                    where: { id: user.id },
                    select: { role: true },
                });
                session.user.role = dbUser?.role || "USER";
            }
            return session;
        },
    },
});