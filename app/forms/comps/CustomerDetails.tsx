/* eslint-disable @next/next/no-img-element */
"use client"
import { useRecoilState, useRecoilValue } from "recoil";
import { FormCustomerDetailsState, FormDesignState, stepState, submittedTestimonialState } from "@/app/atoms";
import { prisma } from "@/prismaClient";
import axios from "axios";
import { useParams } from "next/navigation";
import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";

export default function CustomerDetails() {
    const FormDesign = useRecoilValue(FormDesignState);
    const [FormCustomerDetails, setFormCustomerDetails] = useRecoilState(FormCustomerDetailsState);
    const submittedTestimonial = useRecoilValue(submittedTestimonialState)
    const { publicForm } = useParams()
    const [loading, setLoading] = useState(false)
    const [, setStep] = useRecoilState(stepState);

    // Define a type for the fields
    type FormFields = 'name' | 'email' | 'userPhoto' | 'jobTitle' | 'websiteUrl' | 'companyName';

    // Define a type for the keys of FormCustomerDetails
    type FormCustomerDetailsKeys = keyof typeof FormCustomerDetails;

    // Update the handleInputChange function
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: FormFields) => {
        const { value } = e.target;
        setFormCustomerDetails(prevState => ({
            ...prevState,
            [field]: {
                ...prevState[field],
                content: value
            }
        }));
    }

    const checkIfRequired = async () => {
        let requiredFieldNames = Object.keys(FormCustomerDetails).filter(key => {
            const field = FormCustomerDetails[key as FormCustomerDetailsKeys];
            return field && field.required && field.enabled
        });
        return requiredFieldNames // ["name", "websiteUrl", "companyName"]
    }

    const submitTestimonial = async () => {
        if (!publicForm || loading) return;
        const requiredFields = await checkIfRequired(); // Await the Promise
        // Check if any required field's content is empty
        if (requiredFields.some(field => !FormCustomerDetails[field as FormCustomerDetailsKeys].content)) {
            alert("Please fill in all required fields."); // Alert the user
            return; // Prevent submission
        }
        setLoading(true)
        const response = await axios.post("/api/prisma/submitTestimonial", {
            id: publicForm,
            submittedTestimonial,
            cutomer: {
                name: FormCustomerDetails.name.content,
                email: FormCustomerDetails.email.content,
                photo: FormCustomerDetails.userPhoto.content,
                company: FormCustomerDetails.companyName.content,
                job: FormCustomerDetails.jobTitle.content,
                websiteUrl: FormCustomerDetails.websiteUrl.content
            }
        })
        if (response.data.success) {
            setLoading(false)
            setStep(4)
            setFormCustomerDetails({
                name: {
                    content: "",
                    enabled: true,
                    required: true,
                },
                email: {
                    content: "",
                    enabled: true,
                    required: false
                },
                userPhoto: {
                    content: "",
                    enabled: true,
                    required: false
                },
                jobTitle: {
                    content: "",
                    enabled: true,
                    required: true
                },
                websiteUrl: {
                    content: "",
                    enabled: true,
                    required: false
                },
                companyName: {
                    content: "",
                    enabled: true,
                    required: false
                },
            })
        }
    }

    return (
        <div className="w-full relative pt-12 pb-6 space-y-10 items-center
        justify-center flex flex-col bg-white smooth">
            <img src={FormDesign.logo ? FormDesign.logo : "https://via.placeholder.com/60"} alt="logo"
                className="form_logo" />
            <div className="w-full space-y-3">
                <h1 className="text-gray-700 text-lg font-medium">
                    Almost Done!
                </h1>

            </div>
            <div className="w-full space-y-4">
                <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name
                    </label>
                    <input type="text" id="name" name="name" className="input"
                        onChange={(e) => handleInputChange(e, 'name')} />
                </div>
                {FormCustomerDetails.email.enabled && (
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email {FormCustomerDetails.email.required && <span className="text-red-500">*</span>}
                        </label>
                        <input type="email" id="email" name="email" className="input"
                            required={FormCustomerDetails.email.required}
                            onChange={(e) => handleInputChange(e, 'email')} />
                    </div>
                )}
                {FormCustomerDetails.jobTitle.enabled && (
                    <div className="space-y-2">
                        <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">
                            Job Title {FormCustomerDetails.jobTitle.required && <span className="text-red-500">*</span>}
                        </label>
                        <input type="text" id="jobTitle" name="jobTitle" className="input"
                            required={FormCustomerDetails.jobTitle.required}
                            onChange={(e) => handleInputChange(e, 'jobTitle')}
                        />
                    </div>
                )}
                {FormCustomerDetails.websiteUrl.enabled && (
                    <div className="space-y-2">
                        <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                            Website {FormCustomerDetails.websiteUrl.required && <span className="text-red-500">*</span>}
                        </label>
                        <input type="url" id="website" name="website"
                            className="input"
                            required={FormCustomerDetails.websiteUrl.required}
                            onChange={(e) => handleInputChange(e, 'websiteUrl')}

                        />
                    </div>
                )}
                {FormCustomerDetails.userPhoto.enabled && (
                    <div className="space-y-2">
                        <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
                            Photo {FormCustomerDetails.userPhoto.required && <span className="text-red-500">*</span>}
                        </label>
                        <div className=" justify-between items-center flex w-full">
                            <CldUploadWidget
                                uploadPreset="preset"
                                onSuccess={(result: any) => {
                                    setFormCustomerDetails(prevState => ({
                                        ...prevState,
                                        userPhoto: {
                                            ...FormCustomerDetails.userPhoto,
                                            content: result.info.secure_url // Set the content to the uploaded image URL
                                        }
                                    }));
                                }
                                }
                            >
                                {({ open }) => (
                                    <button onClick={() => open()}
                                        className="button w-[30%] py-2 px-1">
                                        {FormCustomerDetails.userPhoto.content ?
                                            "replace image" : "upload image"}
                                    </button>
                                )}
                            </CldUploadWidget>
                            <img src={FormCustomerDetails.userPhoto.content} className="h-28 w-28" />

                        </div>
                    </div>
                )}
                {FormCustomerDetails.companyName.enabled && (
                    <div className="space-y-2">
                        <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                            Company {FormCustomerDetails.companyName.required && <span className="text-red-500">*</span>}
                        </label>
                        <input type="text" id="company" name="company"
                            className="input"
                            required={FormCustomerDetails.companyName.required}
                            onChange={(e) => handleInputChange(e, 'companyName')}

                        />
                    </div>
                )}
                <button onClick={submitTestimonial}
                    className="button"> {loading ? "submitting..." : "Submit"}</button>
            </div>

        </div >
    )
}