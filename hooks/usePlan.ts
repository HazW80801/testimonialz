"use client"
import { supabase } from "@/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from '@supabase/supabase-js';
import axios from "axios";
import { fetchUserSubscription } from "@/actions";
import useUser from "./useUser";

export default function usePlan() {
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(true);
    const [user] = useUser()
    const retrievePlan = async () => {
        if (!user) return;
        let subId = await fetchUserSubscription(user.id)
        const response = await axios.post("/api/billing/retrieve", {
            subId,
        })
        const result = response.data
        setStatus(result.status)
        setLoading(false)
    }

    useEffect(() => {
        if (!supabase) return;
        retrievePlan()
    }, [supabase, user])

    return [status, loading]
}