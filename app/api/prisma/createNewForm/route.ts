import { NextResponse } from 'next/server';
import { prisma } from "@/prismaClient";
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  const { name, user,
    formDesign,
    formWelcomeDetails,
    formResponseDetails,
    formCustomerDetails,
    formThanksDetails,
  } = await request.json();
  const formId = uuidv4();


  try {
    const newForm = await prisma.forms.create({
      data: {
        id: formId,
        name,
        user,
        formDesign,
        formWelcomeDetails,
        formResponseDetails,
        formCustomerDetails,
        formThanksDetails,
      }
    });
    await prisma.$disconnect()
    return NextResponse.json({ success: true, form: newForm });
  } catch (error) {
    console.error("Error Creating new Form", error);
    return NextResponse.json({ success: false, error: "Failed to create form" }, { status: 500 });
  }
}