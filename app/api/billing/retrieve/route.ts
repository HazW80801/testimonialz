import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { subId } = await req.json();
        if (!subId) {
            return NextResponse.json({ success: false, error: "Subscription ID is required" }, { status: 400 });
        }

        const response = await fetch(`https://api.lemonsqueezy.com/v1/subscriptions/${subId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/vnd.api+json',
                'Authorization': `Bearer ${process.env.LMNSQ_API_KEY}`,
                'Content-Type': 'application/vnd.api+json'
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ success: false, error: errorData }, { status: response.status });
        }

        const data = await response.json();
        console.log(data)
        // const status = data.attributes.status;

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
