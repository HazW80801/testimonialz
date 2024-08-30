import { NextResponse } from 'next/server';
import { prisma } from "@/prismaClient";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const userForms = await prisma.forms.findMany({
      where: {
        user: email,
      },
      select: {
        id: true,
        name: true,
        created_at: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return NextResponse.json({ success: true, forms: userForms });
  } catch (error) {
    console.error('Error fetching user forms:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}