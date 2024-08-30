'use server';
import { prisma } from "./prismaClient"

export async function fetchUserSubscription(id: string) {
    try {
        const response = await prisma.subscriptions.findFirst({
            where: {
                user: id
            },
        });
        return response?.subscriptionId;
    } catch (error) {
        console.error('Error fetching user subscription:', error);
        throw error;
    }
}