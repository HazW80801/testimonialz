'use client'

import { supabase } from "@/supabaseClient"

export default function SignInButton() {
    const signinF = async () => {
        await supabase.auth.signInWithOAuth({ provider: "google" })
    }

    return (
        <button className="button w-auto" onClick={signinF}>
            signIn using google
        </button>
    )
}