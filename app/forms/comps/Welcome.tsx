/* eslint-disable @next/next/no-img-element */
"use client"
import { FormDesignState, FormWelcomeDetailsState, stepState } from "@/app/atoms";
import { useRecoilState, useRecoilValue } from "recoil";
import ReactMarkdown from 'react-markdown';


export default function WelcomeComp() {
    const [step, setStep] = useRecoilState(stepState);
    const FormDesign = useRecoilValue(FormDesignState);
    const FormWelcomeDetails = useRecoilValue(FormWelcomeDetailsState);


    return (
        <div className="relative pt-12 pb-6 space-y-10 items-center smooth
        justify-center flex flex-col bg-white">
            <img src={FormDesign.logo ? FormDesign.logo : "https://via.placeholder.com/60"} alt="logo"
                className="form_logo" />
            <div className="w-full space-y-3">
                <h1 className="text-2xl font-medium">{FormWelcomeDetails.title}</h1>
                <ReactMarkdown>
                    {FormWelcomeDetails.content}
                </ReactMarkdown>
            </div>
            <div className="w-full space-y-4 items-center justify-center flex flex-col">
                {FormWelcomeDetails.collectVideo && <button className="button_active"
                    style={{ backgroundColor: FormDesign.primaryColor }}
                    onClick={() => setStep(2)}>Record a video</button>}
                {FormWelcomeDetails.collectText && <button className="button" onClick={() => setStep(1)}>
                    Write a testimonial
                </button>}
            </div>

        </div>
    )
}