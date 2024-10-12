"use client"

import usePlan from "@/hooks/usePlan";
import useUser from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import React from 'react';
import { CheckCircle } from 'lucide-react';
import axios from "axios";

const plans = [
    {
        name: 'Free',
        price: "Free",
        features: ['1 collection form', 'up to 10 testimonials',],
        isPopular: false,
    },
    {
        name: 'Premium',
        price: 9.99,
        features: ['unlimited collection form', 'unlimited testimonials',],
        isPopular: true,
    },
];
export default function PricingPage() {

    return (
        <div className="bg-white min-h-screen py-12">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold text-center mb-8">Choose Your Plan</h1>
                <p className="text-xl text-center text-gray-600 mb-12">
                    Start collecting and showcasing testimonials today
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {plans.map((plan, index) => (
                        <PricingTier key={index} {...plan} />
                    ))}
                </div>
            </div>
        </div>
    );
}

const PricingTier = ({ name, price, features, isPopular }: any) => {
    const router = useRouter()
    const [user] = useUser()
    const [status, loading] = usePlan()
    async function handlePayment(action: string) {
        if (!user) router.push("/signin")
        try {
            const { data } = await axios.post('/api/billing/create', { userId: user!.id });
            router.replace(data.subscription.data.attributes.url);
        } catch (error: any) {
            console.error('Error creating checkout:', error.message);
        }
    }
    return (
        <div className={`py-20 px-6 bg-white rounded-lg shadow-md relative 
            items-start justify-center flex flex-col ${isPopular ?
                'border-2 border-gray-900' : 'border border-black/5'}`}>
            <div className="flex flex-col items-start justify-between">
                {isPopular && (
                    <span className="bg-gray-800 text-white px-2 py-1 rounded-full text-xs
                 font-semibold mb-2 inline-block">
                        Most Popular
                    </span>
                )}
                <h3 className="text-xl font-bold mb-2">{name}</h3>
                <p className="text-3xl font-bold mb-4">${price}
                    <span className="text-sm font-normal">/month</span></p>
                <ul className="mb-6">
                    {features.map((feature: any, index: any) => (
                        <li key={index} className="flex items-center mb-2">
                            <CheckCircle className="text-green-500 mr-2" size={16} />
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="w-full items-center justify-center flex">

                <div className={`text-center absolute bottom-5 w-[95%]
                 ${isPopular ? "button_active" : "button"} `}
                >
                    {status == "no_plan" ? name == "Free" ? "Current" :
                        <button onClick={() => handlePayment("upgrade")}>Upgrade</button> : name == "Free" ?
                        <button onClick={() => handlePayment("downgrade")}>Downgrade</button> : "current"}
                </div>
            </div>
        </div>
    );
}