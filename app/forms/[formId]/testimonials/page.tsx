/* eslint-disable @next/next/no-img-element */
"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/comps/Header";
import { Form, Testimonial } from "@/types";
import axios from "axios";
import { CheckCircle2, MoreVerticalIcon, Trash2Icon, XCircleIcon, ClipboardIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"


export default function TestimonialsPage() {
    const { formId } = useParams()
    const [testimonials, setTestimonials] = useState<Testimonial[]>([])
    const [form, setForm] = useState<Form>()
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const getForm = async () => {
        const response = await axios.get("/api/prisma/getForm", {
            params: { formId }
        })
        setForm(response.data);
    }

    const fetchTestimonials = async () => {
        const response = await axios.get("/api/prisma/fetchTestimonials", {
            params: { formId }
        })
        setTestimonials(response.data);
    }

    useEffect(() => {
        if (!formId) return;
        fetchTestimonials()
        getForm()
    }, [formId])

    const handleT = async (action: string, tId: string) => {
        setLoading(true)
        const response = await axios.post("/api/prisma/t", {
            action,
            tId,
        })
        if (response.data.success) {
            toast({
                title: `${action} action is done successfully!`,
                variant: action == "delete" ? "destructive" : "default"
            })
        }
        fetchTestimonials()
        setLoading(false)
    }

    return (
        <div className="min-h-screen w-full">
            <Header />
            <div className="w-full min-h-screen py-12 px-6
            rounded-xl items-start justify-start flex flex-col" >
                <div className="w-full justify-between items-center flex pb-4">
                    <h1 className="text-left text-lg font-medium self-center">
                        form: {form?.name} ({testimonials?.length})
                    </h1>
                    <Dialog>
                        <DialogTrigger className="button w-auto py-1 self-center">widget</DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="text-sm pt-5 pb-6">copy this snippet and then, add it in
                                    any page you want inside your application.</DialogTitle>
                                <DialogDescription>
                                    <div className="bg-black text-white py-10 px-6 text-sm rounded-lg">
                                        {`<script
                                        src="http://localhost:3000/widget.js"
                                        data-form-id=${formId}
                                        async
                                    ></script>`}
                                    </div>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(`<script src="http://localhost:3000/widget.js" data-form-id=${formId} async></script>`);
                                            toast({ title: "Snippet copied to clipboard!", variant: "default" });
                                        }}
                                        className="flex items-center mt-2 text-black"
                                    >
                                        <ClipboardIcon className="h-4 w-4 mr-1" />
                                        Copy to Clipboard
                                    </button>
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>


                </div>

                {loading ?
                    <div className=" min-h-[50vh] w-full items-center justify-center flex">
                        loading...
                    </div>
                    : <div className="grid grid-cols-1 gap-6 w-full ">
                        {testimonials?.map((t: Testimonial) => (
                            <div key={t.id}
                                className="border border-black/10 rounded-xl mt-6 bg-white
                                shadow-lg shadow-gray-50 w-full relative
                                ">
                                <div className="absolute top-2 right-5 flex space-x-2">
                                    <p className={`text-xs rounded-xl px-2 py-0.5 self-center
                                     ${t.published ? "bg-green-200" : "bg-red-300"} `} >

                                        {t.published ? "approved" : "unapproved"}</p>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <MoreVerticalIcon className="h-6 w-6 stroke-gray-800" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem className="flex space-x-2 cursor-pointer">
                                                {t.published ?
                                                    <div onClick={() => handleT("unapprove", t.id)} >
                                                        <XCircleIcon className="stroke-yellow-500 h-4 w-4" />
                                                        <p className="text-yellow-500">
                                                            unapprove
                                                        </p>
                                                    </div>
                                                    :
                                                    <div onClick={() => handleT("approve", t.id)}>
                                                        <CheckCircle2 className="stroke-green-500 h-4 w-4" />
                                                        <p className="text-green-500">
                                                            approve
                                                        </p>
                                                    </div>
                                                }
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleT("delete", t.id)} className="cursor-pointer text-red-600 smooth flex space-x-2">
                                                <Trash2Icon className="stroke-red-500 h-4 w-4" />
                                                <p>
                                                    Delete
                                                </p>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                </div>
                                <div className="w-full flex">
                                    {/* author */}
                                    <div className="w-[20%] flex flex-col items-center py-5 border-r 
                                border-black/10">
                                        <span className="items-center justify-center flex flex-col">
                                            <img src={t.author.photo} alt={t.author.name}
                                                className="rounded-full p-3 h-28 w-28 object-cover object-center" />
                                            <span className="mt-2 items-center justify-center flex flex-col">
                                                <p className="italic text-sm">
                                                    {t.author.name}
                                                </p>
                                                <p className="text-xs italic text-gray-500">
                                                    {t.author.email}
                                                </p>
                                            </span>
                                        </span>
                                        <div className="w-full bg-black/5 h-0.5 my-4" />
                                        <span className="items-start justify-start flex flex-col">
                                            {t.author.job &&
                                                <>
                                                    <p className="text-xs font-bold text-gray-700">
                                                        job:
                                                    </p>
                                                    <p className="text-sm pb-2">
                                                        {t.author.job}
                                                    </p>
                                                </>}
                                            {
                                                t.author.websiteUrl &&
                                                <>
                                                    <p className="text-xs font-bold text-gray-700">
                                                        website:
                                                    </p>
                                                    <p className="text-sm pb-2">
                                                        {t.author.websiteUrl}
                                                    </p>
                                                </>
                                            }
                                            {
                                                t.author.company &&
                                                <>
                                                    <p className="text-xs font-bold text-gray-700">
                                                        company:
                                                    </p>
                                                    <p className="text-sm pb-2">
                                                        {t.author.company}
                                                    </p>
                                                </>}
                                        </span>
                                    </div>
                                    {/* content */}
                                    <div className=" w-[80%] py-5 items-center justify-center flex">
                                        {t.type == "video" ?
                                            <video src={t.content} controls muted loop className="w-[50%]" />
                                            : <h3 className="py-4 px-6 text-2xl italic text-gray-800">`&quot;`{t.content}`&ldquo;`</h3>}
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>}
            </div >

        </div >
    )
}
