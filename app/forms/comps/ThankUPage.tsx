/* eslint-disable @next/next/no-img-element */
"use client"
import { FormDesignState, FormResponseDetailsState, FormThanksState } from "@/app/atoms";
import { useRecoilValue } from "recoil";
import ReactMarkdown from 'react-markdown';

export default function ThankUPage() {
    const FormDesign = useRecoilValue(FormDesignState);
    const FormThanksDetails = useRecoilValue(FormThanksState);
    return (
        <div className="w-full relative pt-12 pb-6 space-y-10 items-center
        justify-center flex flex-col bg-white smooth">
            <img src={FormDesign.logo ? FormDesign.logo : "https://via.placeholder.com/60"} alt="logo"
                className="form_logo" />
            <div className="w-full space-y-3">
                <h1 className="text-gray-700 text-lg font-medium">
                    {FormThanksDetails.title}
                </h1>
                <ReactMarkdown>
                    {FormThanksDetails.content}
                </ReactMarkdown>
            </div>
        </div>
    )
}