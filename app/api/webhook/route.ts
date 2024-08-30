
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/prismaClient';

const webhookSecret = `testimonialz`;

const verifySignature = (rawBody: any, signature: any) => {
    if (!webhookSecret) {
        throw new Error('Webhook secret is not defined');
    }
    const hmac = crypto.createHmac('sha256', webhookSecret);
    const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
    const checksum = Buffer.from(signature, 'utf8');

    if (digest.length !== checksum.length) {
        return false;
    }

    return crypto.timingSafeEqual(digest, checksum);
};

const processSuccessfulPayment = async (
    subscriptionId: string,
    customerId: number,
    plan: string,
    status: string,
    userId: any
) => {
    await prisma.subscriptions.create({
        data: {
            customerId,
            status,
            subscriptionId,
            user: userId.toString(),
            plan,
        }
    })
};

export async function POST(request: Request) {
    try {
        const rawBody = await request.text();
        const signature = request.headers.get('x-signature');

        if (!verifySignature(rawBody, signature)) {
            return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
        }

        const data = JSON.parse(rawBody);

        if (data.meta.event_name === 'subscription_created'
        ) {
            const {
                id: subscriptionId,
                attributes: {
                    customer_id: customerId,
                    status,
                    variant_name: plan
                },
            } = data.data;
            console.log(data)
            const { userId } = data.meta.custom_data
            await processSuccessfulPayment(subscriptionId, customerId, plan, status, userId);
            return NextResponse.json({ message: 'Webhook processed successfully' }, { status: 200 });
        } else {
            return NextResponse.json({ message: 'Unexpected event type' }, { status: 400 });
        }
    } catch (error) {
        console.error('Error processing webhook:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
