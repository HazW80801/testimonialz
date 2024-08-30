/* eslint-disable @next/next/no-img-element */
"use client"

import { FormDesignState, FormResponseDetailsState, stepState, submittedTestimonialState } from "@/app/atoms";
import { useRecoilState, useRecoilValue } from "recoil";
import ReactMarkdown from 'react-markdown';
import { useState } from "react";

export default function WriteT() {
    const FormDesign = useRecoilValue(FormDesignState);
    const FormResponseDetails = useRecoilValue(FormResponseDetailsState);
    const [step, setStep] = useRecoilState(stepState);
    const [testimonial, setTestimonial] = useState("")
    const [, setSubmittedTestimonial] = useRecoilState(submittedTestimonialState)

    const handleSubmit = () => {
        if (testimonial.trim() == "") return;
        setSubmittedTestimonial({
            content: testimonial,
            type: "text"
        })
        setStep(3)
    }


    return (
        <div className="w-full relative pt-12 pb-6 space-y-10 items-center
        justify-center flex flex-col bg-white smooth">
            <img src={FormDesign.logo ? FormDesign.logo : "https://via.placeholder.com/60"} alt="logo"
                className="form_logo" />
            <div className="w-full space-y-3">
                <h1 className="text-gray-700 text-lg font-medium">
                    Write a text testimonial
                </h1>
                <ReactMarkdown>
                    {FormResponseDetails.textPrompt}
                </ReactMarkdown>
            </div>
            <div className="w-full space-y-2">
                <textarea value={testimonial}
                    onChange={(e) => setTestimonial(e.target.value)}
                    placeholder="write something nice..."
                    className="min-h-[30vh] py-6 px-6 bg-white border
                 border-black/10 rounded-xl text-black smooth w-full outline-none " />
                <button onClick={handleSubmit} className="button">Submit</button>
            </div>

        </div>
    )
}