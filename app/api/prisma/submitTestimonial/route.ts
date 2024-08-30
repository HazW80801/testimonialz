import { prisma } from '@/prismaClient';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from "uuid"

export async function POST(req: Request) {
    const { id, submittedTestimonial, cutomer } = await req.json();

    try {
        // Save the testimonial and customer details to the database
        const testimonial = await prisma.testimonials.create({
            data: {
                id: uuidv4(),
                author: cutomer,
                form: id,
                content: submittedTestimonial.content,
                type: submittedTestimonial.type,
                published: false,
            }
        });
        await prisma.$disconnect()
        return NextResponse.json({ success: true, testimonial });
    } catch (error) {
        console.error("Error Creating new Form", error);
        return NextResponse.json({ success: false, error: "Failed to create form" }, { status: 500 });
    }

}