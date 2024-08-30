"use client"

import { useRouter } from "next/navigation";

export default function PricingPage() {
    const router = useRouter()
    async function createCheckout() {
        try {
            const response = await fetch('/api/billing/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error);
            }
            router.replace(data.subscription.data.attributes.url)
        } catch (error: any) {
            console.error('Error creating checkout:', error.message);
        }
    }
    return (
        <div className="min-h-screen items-center justify-center flex">
            <button onClick={createCheckout}>pay</button>
        </div>
    )
}