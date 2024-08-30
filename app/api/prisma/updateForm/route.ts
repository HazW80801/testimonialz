import { NextResponse } from 'next/server';
import { prisma } from "@/prismaClient";

export async function POST(request: Request) {
    try {
        const { formId, formDesign, welcomeDetails, responseDetails, customerDetails, thanksDetails,
        } = await request.json();

        if (!formId) {
            return NextResponse.json({ error: 'Form ID is required' }, { status: 400 });
        }

        const updatedForm = await prisma.forms.update({
            where: { id: formId },
            data: {
                formDesign,
                formWelcomeDetails: welcomeDetails,
                formResponseDetails: responseDetails,
                formCustomerDetails: customerDetails,
                formThanksDetails: thanksDetails
            },
        });

        return NextResponse.json(updatedForm);
    } catch (error) {
        console.error('Error updating form:', error);
        return NextResponse.json({ error: 'Failed to update form' }, { status: 500 });
    }
}
