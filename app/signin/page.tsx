import { supabase } from "@/supabaseClient"
import { redirect } from "next/navigation"
import SignInButton from './SignInButton'

export default async function SigninPage() {
    const { data: { user } } = await supabase.auth.getUser()
    user && redirect("/dashboard")

    return (
        <div className="items-center justify-center flex min-h-screen w-full bg-black">
            <SignInButton />
        </div>
    )
}