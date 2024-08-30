"use client"
import { FormCustomerDetailsState, FormDesignState, FormResponseDetailsState, FormThanksState, FormWelcomeDetailsState, stepState } from "@/app/atoms"
import CustomerDetails from "@/app/forms/comps/CustomerDetails"
import RecordT from "@/app/forms/comps/RecordT"
import ThankUPage from "@/app/forms/comps/ThankUPage"
import WelcomeComp from "@/app/forms/comps/Welcome"
import WriteT from "@/app/forms/comps/WriteT"
import axios from "axios"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useRecoilState } from "recoil"

export default function PublicFormPage() {
    const { publicForm } = useParams()
    const [loading, setLoading] = useState(false)
    const [, setFormDesign] = useRecoilState(FormDesignState);
    const [, setLogo] = useState("");
    const [, setFormWelcomeDetails] = useRecoilState(FormWelcomeDetailsState);
    const [, setFormResponseDetails] = useRecoilState(FormResponseDetailsState);
    const [, setFormCustomerDetails] = useRecoilState(FormCustomerDetailsState);
    const [, setFormThanksDetails] = useRecoilState(FormThanksState);
    const [step, setStep] = useRecoilState(stepState);


    const fetchFormData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/prisma/getForm`, {
                params: { formId: publicForm }
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
    useEffect(() => {
        if (!publicForm) return;
        fetchFormData()
    }, [publicForm])
    return (
        <div className="min-h-screen items-center justify-center flex">
            <div className="form-wrapper">
                {step !== 0 && <div className="text-black text-2xl cursor-pointer hover:-translate-x-2
                smooth absolute top-2 right-2 w-auto z-50" onClick={() => setStep(0)}>←</div>}
                {step == 0 && <WelcomeComp />}
                {step == 1 && <WriteT />}
                {step == 2 && <RecordT />}
                {step == 3 && <CustomerDetails />}
                {step == 4 && <ThankUPage />}
            </div>
        </div>

    )
}