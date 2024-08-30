import { prisma } from '@/prismaClient';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from "uuid"

export async function POST(req: Request) {
    const { action, tId } = await req.json();
    if (action !== "delete") {
        await prisma.testimonials.update({
            where: {
                id: tId
            },
            data: {
                published: action == "unapprove" ? false : true
            }
        })
    }
    else {
        await prisma.testimonials.delete({
            where: {
                id: tId
            }
        })
    }
    try {
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error Creating new Form", error);
        return NextResponse.json({ success: false, error: "Failed to create form" }, { status: 500 });
    }

}