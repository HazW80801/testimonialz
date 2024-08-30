"use client"
import Header from "@/comps/Header"
import useUser from "@/hooks/useUser"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Form } from "@/types"
import Link from "next/link"
import { useRecoilValue } from "recoil"
import { FormCustomerDetailsState, FormDesignState, FormResponseDetailsState, FormThanksState, FormWelcomeDetailsState } from '@/app/atoms';
import axios from 'axios';
import { HeartHandshakeIcon, PencilIcon, ShareIcon } from "lucide-react"
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton } from "react-share";
import { Facebook, Twitter, Linkedin, Copy, Check } from "lucide-react";

export default function DashboardPage() {
    const [user] = useUser()
    const [formName, setFormName] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const [userForms, setUserForms] = useState([])
    const formDesign = useRecoilValue(FormDesignState);
    const formWelcomeDetails = useRecoilValue(FormWelcomeDetailsState);
    const formResponseDetails = useRecoilValue(FormResponseDetailsState);
    const formCustomerDetails = useRecoilValue(FormCustomerDetailsState);
    const formThanksDetails = useRecoilValue(FormThanksState);

    const [openModal, setOpenModal] = useState(false)
    const [copied, setCopied] = useState(false);

    const createNewForm = async () => {
        if (formName.trim() === "" || loading) return;
        setLoading(true);
        try {
            const response = await axios.post('/api/prisma/createNewForm', {
                name: formName,
                user: user!.email!,
                formDesign,
                formWelcomeDetails,
                formResponseDetails,
                formCustomerDetails,
                formThanksDetails,
            });
            const data = response.data;
            if (data.success) {
                console.log("Form created successfully");
                router.replace(`/forms/${data.form.id}`)
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error("Error Creating new Form", error);
        } finally {
            setFormName("");
            setLoading(false);
        }
    }

    const fetchUserForms = async () => {
        try {
            const response = await axios.post('/api/prisma/fetchUserForms', {
                email: user?.email,
            });
            const data = response.data;
            setUserForms(data.forms)
        } catch (error) {
            console.error("Error fetching user forms", error);
        }
    }
    useEffect(() => {
        if (!user) return;
        fetchUserForms()
    }, [user])

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="w-full min-h-screen">
            <Header />
            <div className="w-full items-center justify-end flex px-6 py-2 mt-6">
                <Dialog>
                    <DialogTrigger className="button_active w-auto py-1 px-4">
                        new form
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>create new form</DialogTitle>
                            <DialogDescription>
                                <label htmlFor="formName"
                                    className="block text-sm font-medium text-gray-700">Form Name</label>
                                <input
                                    value={formName}
                                    onChange={(e) => setFormName(e.target.value)}
                                    type="text"
                                    id="formName"
                                    name="formName"
                                    className="input"
                                    placeholder="Enter form name"
                                />
                                <button
                                    onClick={createNewForm}
                                    className="button"
                                >
                                    {loading ? "Loading..." : "Create Form"}
                                </button>
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>

            </div>
            <div className="px-6 pb-12">
                <h1 className="text-lg font-medium">Your collection forms ({userForms?.length}) </h1>
                {userForms?.length > 0 &&
                    <div className="grid grid-cols-1 md:grid-cols-3
             lg:grid-cols-4 w-full mt-8 gap-10">
                        {userForms?.map((form: Form) => (
                            <div key={form.id} className="form-item">
                                <p>
                                    {form.name}
                                </p>
                                <div className="border-t border-black/10 my-4 pt-4 flex space-x-2 items-center justify-between">
                                    <Link href={`/forms/${form.id}`} prefetch
                                        className="formItem-option group" >
                                        <PencilIcon className="w-[.3cm] text-gray-700 group-hover:text-black" />
                                        <p>edit</p>
                                    </Link>
                                    <Dialog>
                                        <DialogTrigger>
                                            <div className="formItem-option group">
                                                <ShareIcon className="w-[.3cm] text-gray-700 group-hover:text-black" />
                                                <p>collect</p>
                                            </div>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>share form link</DialogTitle>
                                                <DialogDescription className="pt-4">
                                                    <div className="border border-black/10 rounded-lg py-2 px-2 mb-4">
                                                        <p className="text-gray-700 italic text-xs pb-1">Click to copy and paste your form link.</p>
                                                        <div className="flex items-center">
                                                            <button
                                                                onClick={() => copyToClipboard(`http://localhost:3000/f/${form.id}`)}
                                                                className="w-full text-left flex justify-between p-2 bg-gray-100
                                                                 rounded-md hover:bg-gray-200 smooth"
                                                            >
                                                                {`http://localhost:3000/f/${form.id.substring(1, 15)}...`}
                                                                {copied ? <Check className="w-4 h-4" /> :
                                                                    <Copy className="w-4 h-4" />}
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="border border-black/10 rounded-lg py-2 px-2">
                                                        <p className="text-gray-700 italic text-xs pb-2">Share on social media:</p>
                                                        <div className="flex space-x-4">
                                                            <FacebookShareButton url={`http://localhost:3000/f/${form.id}`}>
                                                                <Facebook className="w-6 h-6 text-blue-600 hover:text-blue-700" />
                                                            </FacebookShareButton>
                                                            <TwitterShareButton url={`http://localhost:3000/f/${form.id}`}>
                                                                <Twitter className="w-6 h-6 text-blue-400 hover:text-blue-500" />
                                                            </TwitterShareButton>
                                                            <LinkedinShareButton url={`http://localhost:3000/f/${form.id}`}>
                                                                <Linkedin className="w-6 h-6 text-blue-700 hover:text-blue-800" />
                                                            </LinkedinShareButton>
                                                        </div>
                                                    </div>
                                                </DialogDescription>
                                            </DialogHeader>
                                        </DialogContent>
                                    </Dialog>

                                    <Link href={`/forms/${form.id}/testimonials`}
                                        className="formItem-option group">
                                        <HeartHandshakeIcon className="w-[.3cm] text-gray-700 group-hover:text-black" />
                                        <p>testimonials</p>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                }
            </div>

        </div>
    )
}