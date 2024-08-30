/* eslint-disable @next/next/no-img-element */
"use client"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import useUser from "@/hooks/useUser";
import Link from "next/link";

export default function Header() {
    const [user] = useUser()
    return (
        <div className="w-full py-4 px-6 items-center flex z-50 bg-opacity-20 backdrop-blur-lg backdrop-filter filter
         justify-between border-b border-black/10 sticky top-0 bg-white">
            <Link href={"/dashboard"} prefetch className="cursor-pointer hover:text-gray-600 text-black smooth">
                Testimonialz</Link>
            <DropdownMenu>
                <DropdownMenuTrigger className="flex space-x-2 items-center justify-center">
                    <img alt={user?.email} src={user?.user_metadata?.picture}
                        className="w-6 rounded-full object-center object-cover" />
                    <p className="text-sm self-center">{user?.user_metadata.name}</p>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>plans</DropdownMenuItem>
                    <DropdownMenuItem>usage</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>signout</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}