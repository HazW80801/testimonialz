"use client"
import { supabase } from "@/supabaseClient";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from '@supabase/supabase-js';

export default function useUser() {
    const [session, setSession] = useState<User | null>(null);
    const fetchUser = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user){ redirect("/signin")}
        setSession(user)
    }

    useEffect(() => {
        if (!supabase) return;
        fetchUser()
    }, [supabase])

    return [session]
}