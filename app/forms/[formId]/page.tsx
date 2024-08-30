/* eslint-disable @next/next/no-img-element */
"use client"
import WelcomeComp from "../comps/Welcome"
import { FormCustomerDetailsState, FormDesignState, FormResponseDetailsState, FormThanksState, FormWelcomeDetailsState, stepState } from "@/app/atoms";
import { useRecoilState } from "recoil";
import WriteT from "../comps/WriteT";
import RecordT from "../comps/RecordT";
import {
    Accordion, AccordionContent,
    AccordionItem, AccordionTrigger
} from "@/components/ui/accordion";
import { BrushIcon, HandIcon, MessageCircleIcon, UserCircle2Icon, WandIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { CldUploadWidget } from 'next-cloudinary';
import { ChromePicker } from 'react-color';
import { Checkbox } from "@/components/ui/checkbox";
import CustomerDetails from "../comps/CustomerDetails";
import ThankUPage from "../comps/ThankUPage";
import { useParams } from "next/navigation";
import axios from 'axios';

export default function FormPage() {
    const [step, setStep] = useRecoilState(stepState);
    const [FormDesign, setFormDesign] = useRecoilState(FormDesignState);
    const [logo, setLogo] = useState("");
    const [FormWelcomeDetails, setFormWelcomeDetails] = useRecoilState(FormWelcomeDetailsState);
    const [FormResponseDetails, setFormResponseDetails] = useRecoilState(FormResponseDetailsState);
    const [FormCustomerDetails, setFormCustomerDetails] = useRecoilState(FormCustomerDetailsState);
    const [FormThanksDetails, setFormThanksDetails] = useRecoilState(FormThanksState);
    const { formId } = useParams()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!formId) return;
        fetchFormData();
    }, [formId]);

    const fetchFormData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/prisma/getForm`, {
                params: { formId }
            });
            const formData = response.data;
            // Update states with fetched data
            setFormDesign(formData.formDesign);
            setFormWelcomeDetails(formData.formWelcomeDetails);
            setFormResponseDetails(formData.formResponseDetails);
            setFormCustomerDetails(formData.formCustomerDetails);
            setFormThanksDetails(formData.formThanksDetails);

            // Update logo if present
            if (formData.formDesign && formData.formDesign.logo) {
                setLogo(formData.formDesign.logo);
            }
        } catch (error) {
            console.error('Error fetching form data:', error);
        } finally {
            setLoading(false);
        }
    };

    const submitFormChanges = async () => {
        setLoading(true)
        try {
            const response = await axios.post('/api/prisma/updateForm', {
                formId,
                formDesign: FormDesign,
                welcomeDetails: FormWelcomeDetails,
                responseDetails: FormResponseDetails,
                customerDetails: FormCustomerDetails,
                thanksDetails: FormThanksDetails,
            });
            console.log('Form updated successfully:', response.data);
        } catch (error) {
            console.error('Error updating form:', error);
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className="bg-white min-h-screen w-full grid grid-cols-5">
            <div className="col-span-2 bg-white w-full h-full  pt-12
             px-6 border-r border-black/10 relative h-full max-h-screen overflow-y-scroll">
                <Accordion type="single" collapsible
                    className="space-y-10">
                    {/* design */}
                    <AccordionItem className="w-full" value="design">
                        <AccordionTrigger onClick={() => setStep(0)} className="accordion_trigger">
                            <BrushIcon className="h-6 w-6 text-red-600" />
                            <p className="text-left w-full">
                                Design
                            </p>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-4 py-5 rounded-lg mt-2 px-5 border border-black/10">
                                <div className="flex space-x-4">
                                    <CldUploadWidget
                                        uploadPreset="preset"
                                        onSuccess={(result: any) => {
                                            setLogo(result.info.secure_url)
                                            setFormDesign(curr => ({ ...curr, logo }))
                                        }
                                        }
                                    >
                                        {({ open }) => (
                                            <button onClick={() => open()}
                                                className="button w-[30%] py-2 px-1">
                                                Upload Logo
                                            </button>
                                        )}
                                    </CldUploadWidget>
                                    {logo && <img src={logo} alt="Uploaded logo"
                                        className="w-32 h-32 object-contain" />}
                                </div>

                                <div>
                                    <p className="mb-2 font-bold pt-5">Choose primary color:</p>
                                    <ChromePicker
                                        color={FormDesign.primaryColor}
                                        onChange={(color) => setFormDesign(curr => ({ ...curr, primaryColor: color.hex }))}

                                    />
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    {/* welcome page */}
                    <AccordionItem className="w-full" value="welcome-page">
                        <AccordionTrigger onClick={() => setStep(0)}
                            className="accordion_trigger">
                            <HandIcon className="h-6 w-6 text-red-600" />
                            <p className="text-left w-full">
                                Welcome Page
                            </p>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-4 py-5 rounded-lg mt-2 px-5 border border-black/10">
                                <div>
                                    <label htmlFor="welcomeTitle" className="block mb-2 font-bold">Title:</label>
                                    <input
                                        type="text"
                                        id="welcomeTitle"
                                        value={FormWelcomeDetails.title}
                                        onChange={(e) => setFormWelcomeDetails(curr => ({ ...curr, title: e.target.value }))}
                                        className="input"
                                        placeholder="Enter welcome title"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="welcomeContent"
                                        className="block mb-2 font-bold">Content:</label>
                                    <textarea
                                        id="welcomeContent"
                                        value={FormWelcomeDetails.content}
                                        onChange={(e) =>
                                            setFormWelcomeDetails(curr => ({ ...curr, content: e.target.value }))}
                                        className="input"
                                        rows={6}
                                        placeholder="Enter welcome content"
                                    ></textarea>
                                </div>
                                <div className="flex space-x-2">
                                    <Checkbox id="option-1"
                                        disabled={!FormWelcomeDetails.collectText}
                                        checked={FormWelcomeDetails.collectVideo}
                                        onCheckedChange={(checked) =>
                                            setFormWelcomeDetails(curr =>
                                                ({ ...curr, collectVideo: checked as boolean }))} />
                                    <label
                                        htmlFor="option-1"
                                        className="text-md font-medium"
                                    >
                                        Collect Video Testimonials
                                    </label>

                                </div>
                                <div className="flex space-x-2">
                                    <Checkbox id="option-2"
                                        disabled={!FormWelcomeDetails.collectVideo}
                                        checked={FormWelcomeDetails.collectText}
                                        onCheckedChange={(checked) =>
                                            setFormWelcomeDetails(curr =>
                                                ({ ...curr, collectText: checked as boolean }))}
                                    />
                                    <label
                                        htmlFor="option-2"
                                        className="text-md font-medium"
                                    >
                                        Collect Text Testimonials
                                    </label>

                                </div>


                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    {/* response page */}
                    <AccordionItem className="w-full" value="response-page">
                        <AccordionTrigger onClick={() => setStep(2)}
                            className="accordion_trigger">
                            <MessageCircleIcon className="h-6 w-6 text-red-600" />
                            <p className="text-left w-full">
                                Response Page
                            </p>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-4 py-5 rounded-lg mt-2 px-5 border border-black/10">
                                <div>
                                    <label htmlFor="VideoPrompt"
                                        className="block mb-2 font-bold">Video Prompt:</label>
                                    <textarea
                                        onFocus={() => setStep(2)}
                                        id="VideoPrompt"
                                        value={FormResponseDetails.videoPrompt}
                                        onChange={(e) =>
                                            setFormResponseDetails(curr => ({ ...curr, videoPrompt: e.target.value }))}
                                        className="input"
                                        rows={6}
                                        placeholder="Enter welcome content"
                                    ></textarea>
                                </div>
                                <div>
                                    <label htmlFor="TextPrompt"
                                        className="block mb-2 font-bold">Text Prompt:</label>
                                    <textarea
                                        onFocus={() => setStep(1)}

                                        id="TextPrompt"
                                        value={FormResponseDetails.textPrompt}
                                        onChange={(e) =>
                                            setFormResponseDetails(curr => ({ ...curr, textPrompt: e.target.value }))}
                                        className="input"
                                        rows={6}
                                        placeholder="Enter welcome content"
                                    ></textarea>
                                </div>

                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    {/* customer details page */}
                    <AccordionItem className="w-full" value="customer_details-page">
                        <AccordionTrigger onClick={() => setStep(3)}
                            className="accordion_trigger">
                            <UserCircle2Icon className="h-6 w-6 text-red-600" />
                            <p className="text-left w-full">
                                Customer details Page
                            </p>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-4 py-6 rounded-lg mt-2 px-5 border border-black/10">
                                {/* collect Email option */}
                                <div className="border-b border-black/30 w-full 
                                flex items-center justify-center pb-6 space-x-2 ">

                                    <span className="">
                                        <h3 className="font-bold pb-2">
                                            Collect Email Address
                                        </h3>
                                        <p className="text-gray-600 text-xs">
                                            Collect email addresses so you can stay in touch and send a thank you note
                                        </p>
                                    </span>
                                    <div className="flex space-x-2">
                                        <div className="flex space-x-2">
                                            <Checkbox id="email-enabled"
                                                checked={FormCustomerDetails.email.enabled}
                                                onCheckedChange={(checked) =>
                                                    setFormCustomerDetails(curr =>
                                                        ({ ...curr, email: { ...FormCustomerDetails.email, enabled: checked as boolean } }))} />
                                            <label
                                                htmlFor="email-enabled"
                                                className="text-md font-medium"
                                            >
                                                Enabled
                                            </label>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Checkbox id="email-required"
                                                disabled={!FormCustomerDetails.email.enabled}
                                                checked={FormCustomerDetails.email.required}
                                                onCheckedChange={(checked) =>
                                                    setFormCustomerDetails(curr =>
                                                        ({ ...curr, email: { ...FormCustomerDetails.email, required: checked as boolean } }))} />
                                            <label
                                                htmlFor="email-required"
                                                className="text-md font-medium"
                                            >
                                                Required
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                {/* collect job title option */}
                                <div className="border-b border-black/30 w-full 
                                flex items-center justify-center pb-6 space-x-2 ">

                                    <span className="">
                                        <h3 className="font-bold pb-2">
                                            Collect job title
                                        </h3>
                                        <p className="text-gray-600 text-xs">
                                            Collect job titles so you search by title, and group testimonials in some widgets.
                                        </p>
                                    </span>
                                    <div className="flex space-x-2">
                                        <div className="flex space-x-2">
                                            <Checkbox id="jobTitle-enabled"
                                                checked={FormCustomerDetails.jobTitle.enabled}
                                                onCheckedChange={(checked) =>
                                                    setFormCustomerDetails(curr =>
                                                        ({ ...curr, jobTitle: { ...FormCustomerDetails.jobTitle, enabled: checked as boolean } }))} />
                                            <label
                                                htmlFor="jobTitle-enabled"
                                                className="text-md font-medium"
                                            >
                                                Enabled
                                            </label>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Checkbox id="jobTitle-required"
                                                disabled={!FormCustomerDetails.jobTitle.enabled}
                                                checked={FormCustomerDetails.jobTitle.required}
                                                onCheckedChange={(checked) =>
                                                    setFormCustomerDetails(curr =>
                                                        ({ ...curr, jobTitle: { ...FormCustomerDetails.jobTitle, required: checked as boolean } }))} />
                                            <label
                                                htmlFor="jobTitle-required"
                                                className="text-md font-medium"
                                            >
                                                Required
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                {/* collect user Photo option */}
                                <div className="border-b border-black/30 w-full 
                                flex items-center justify-center pb-6 space-x-2 ">

                                    <span className="">
                                        <h3 className="font-bold pb-2">
                                            Collect user Photo
                                        </h3>
                                        <p className="text-gray-600 text-xs">
                                            Collect user Photos so you search by title, and group testimonials in some widgets.
                                        </p>
                                    </span>
                                    <div className="flex space-x-2">
                                        <div className="flex space-x-2">
                                            <Checkbox id="userPhoto-enabled"
                                                checked={FormCustomerDetails.userPhoto.enabled}
                                                onCheckedChange={(checked) =>
                                                    setFormCustomerDetails(curr =>
                                                        ({ ...curr, userPhoto: { ...FormCustomerDetails.userPhoto, enabled: checked as boolean } }))} />
                                            <label
                                                htmlFor="userPhoto-enabled"
                                                className="text-md font-medium"
                                            >
                                                Enabled
                                            </label>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Checkbox id="userPhoto-required"
                                                disabled={!FormCustomerDetails.userPhoto.enabled}
                                                checked={FormCustomerDetails.userPhoto.required}
                                                onCheckedChange={(checked) =>
                                                    setFormCustomerDetails(curr =>
                                                        ({ ...curr, userPhoto: { ...FormCustomerDetails.userPhoto, required: checked as boolean } }))} />
                                            <label
                                                htmlFor="userPhoto-required"
                                                className="text-md font-medium"
                                            >
                                                Required
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                {/* collect websiteUrl option */}
                                <div className="border-b border-black/30 w-full 
                                flex items-center justify-center pb-6 space-x-2 ">
                                    <span className="">
                                        <h3 className="font-bold pb-2">
                                            Collect website Url
                                        </h3>
                                        <p className="text-gray-600 text-xs">
                                            Collect website Urls to display it in testimonials.
                                        </p>
                                    </span>
                                    <div className="flex space-x-2">
                                        <div className="flex space-x-2">
                                            <Checkbox id="websiteUrl-enabled"
                                                checked={FormCustomerDetails.websiteUrl.enabled}
                                                onCheckedChange={(checked) =>
                                                    setFormCustomerDetails(curr =>
                                                        ({ ...curr, websiteUrl: { ...FormCustomerDetails.websiteUrl, enabled: checked as boolean } }))} />
                                            <label
                                                htmlFor="websiteUrl-enabled"
                                                className="text-md font-medium"
                                            >
                                                Enabled
                                            </label>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Checkbox id="websiteUrl-required"
                                                disabled={!FormCustomerDetails.websiteUrl.enabled}
                                                checked={FormCustomerDetails.websiteUrl.required}
                                                onCheckedChange={(checked) =>
                                                    setFormCustomerDetails(curr =>
                                                        ({ ...curr, websiteUrl: { ...FormCustomerDetails.websiteUrl, required: checked as boolean } }))} />
                                            <label
                                                htmlFor="websiteUrl-required"
                                                className="text-md font-medium"
                                            >
                                                Required
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                {/* collect company option */}
                                <div className="border-b border-black/30 w-full 
                                flex items-center justify-center pb-6 space-x-2 ">

                                    <span className="">
                                        <h3 className="font-bold pb-2">
                                            Collect company
                                        </h3>
                                        <p className="text-gray-600 text-xs">
                                            Collect company name so you can display it in some widgets.
                                        </p>
                                    </span>
                                    <div className="flex space-x-2">
                                        <div className="flex space-x-2">
                                            <Checkbox id="company-enabled"
                                                checked={FormCustomerDetails.companyName.enabled}
                                                onCheckedChange={(checked) =>
                                                    setFormCustomerDetails(curr =>
                                                        ({ ...curr, companyName: { ...FormCustomerDetails.companyName, enabled: checked as boolean } }))} />
                                            <label
                                                htmlFor="company-enabled"
                                                className="text-md font-medium"
                                            >
                                                Enabled
                                            </label>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Checkbox id="company-required"
                                                disabled={!FormCustomerDetails.companyName.enabled}
                                                checked={FormCustomerDetails.companyName.required}
                                                onCheckedChange={(checked) =>
                                                    setFormCustomerDetails(curr =>
                                                        ({ ...curr, companyName: { ...FormCustomerDetails.companyName, required: checked as boolean } }))} />
                                            <label
                                                htmlFor="company-required"
                                                className="text-md font-medium"
                                            >
                                                Required
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    {/* thank you page */}
                    <AccordionItem className="w-full" value="thank_you-page">
                        <AccordionTrigger onClick={() => setStep(4)}
                            className="accordion_trigger">
                            <WandIcon className="h-6 w-6 text-red-600" />
                            <p className="text-left w-full">
                                thank you Page
                            </p>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-4 py-6 rounded-lg mt-2 px-5 border border-black/10">
                                <div>
                                    <label htmlFor="thankYouTitle" className="block mb-2 font-bold">Title:</label>
                                    <input
                                        value={FormThanksDetails.title}
                                        onChange={(e) => setFormThanksDetails
                                            (curr => ({ ...curr, title: e.target.value }))}
                                        type="text"
                                        id="thankYouTitle"
                                        className="input w-full"
                                        placeholder="Enter thank you title"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="thankYouContent" className="block mb-2 font-bold">Message:</label>
                                    <textarea
                                        value={FormThanksDetails.content}
                                        onChange={(e) => setFormThanksDetails
                                            (curr => ({ ...curr, content: e.target.value }))}
                                        id="thankYouContent"
                                        className="input w-full"
                                        rows={4}
                                        placeholder="Enter thank you content"
                                    ></textarea>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <button
                    onClick={submitFormChanges}
                    className="w-full button_active 
                    sticky bottom-2 my-5">{loading ? "loading..." : "save changes"} </button>
            </div>
            <div className="col-span-3 items-center justify-center flex">
                <div className="w-[60%] bg-[#ffffff] border border-black/10 shadow-lg 
            shadow-[#05050510] my-3 py-6 px-6 items-center justify-center flex rounded-xl relative smooth">
                    {step !== 0 && <div className="text-black text-2xl cursor-pointer hover:-translate-x-2
                smooth absolute top-2 right-2 w-auto z-50" onClick={() => setStep(0)}>←</div>}
                    {step == 0 && <WelcomeComp />}
                    {step == 1 && <WriteT />}
                    {step == 2 && <RecordT />}
                    {step == 3 && <CustomerDetails />}
                    {step == 4 && <ThankUPage />}
                </div>
            </div>
        </div >
    )

}