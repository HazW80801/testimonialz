import { NextResponse } from 'next/server';
import { prisma } from "@/prismaClient";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const formId = searchParams.get('formId');

    if (!formId) {
        return NextResponse.json({ error: 'Form ID is required' }, { status: 400 });
    }

    try {
        const form = await prisma.forms.findUnique({
            where: { id: formId },
        });

        if (!form) {
            return NextResponse.json({ error: 'Form not found' }, { status: 404 });
        }

        return NextResponse.json(form);
    } catch (error) {
        console.error('Error fetching form:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}