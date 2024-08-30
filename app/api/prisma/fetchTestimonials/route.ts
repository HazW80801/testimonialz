import { NextResponse } from 'next/server';
import { prisma } from "@/prismaClient";
import { Testimonial } from '@/types';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const formId = searchParams.get('formId');

    // Add when creating the widget
    // we need to get the approved/published testimonails only to be added in the widget
    const publicT = searchParams.get("publicT") == "true" ? true : false

    if (!formId) {
        return NextResponse.json({ error: 'Form ID is required' }, { status: 400 });
    }

    try {
        let testimonials
        if (publicT) {
            testimonials = await prisma.testimonials.findMany({
                where: { form: formId, published: publicT },
                orderBy: { createdAt: "desc" }
            });
        } else {
            testimonials = await prisma.testimonials.findMany({
                where: { form: formId },
                orderBy: { createdAt: "desc" }
            });
        }
        if (!testimonials) {
            return NextResponse.json({ error: 'Form not found' }, { status: 404 });
        }

        return NextResponse.json(testimonials);
    } catch (error) {
        console.error('Error fetching form:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}