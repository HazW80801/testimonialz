"use client"

import usePlan from "@/hooks/usePlan";
import useUser from "@/hooks/useUser";
import { supabase } from "@/supabaseClient";
import { useRouter } from "next/navigation";

export default function PricingPage() {
    const router = useRouter()
    const [user] = useUser()
    const [status, loading] = usePlan()
    async function createCheckout() {
        if (!user) router.push("/signin")
        try {
            const response = await fetch('/api/billing/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: user!.id })
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
            {status !== "active" && <button onClick={createCheckout}>pay</button>}
            your plans is {loading ? "loading..." : status}
        </div>
    )
}