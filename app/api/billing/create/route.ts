import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.api+json',
                'Authorization': `Bearer ${process.env.LMNSQ_API_KEY}`,
                'Content-Type': 'application/vnd.api+json'
            },
            body: JSON.stringify({
                data: {
                    type: "checkouts",
                    relationships: {
                        "store": {
                            "data": {
                                "type": "stores",
                                "id": "31619"
                            }
                        },
                        "variant": {
                            "data": {
                                "type": "variants",
                                "id": "504035"
                            }
                        },
                    },
                }
            }),
        });

        const data = await response.json();
        console.log(data)
        if (!response.ok) {
            return NextResponse.json({ success: false, error: data }, { status: response.status });
        }
        return NextResponse.json({ success: true, subscription: data });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}