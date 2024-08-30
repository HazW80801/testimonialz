export type Form = {
    id: string;
    name: string;
    user: string;
    formDesign: any;
    formWelcomeDetails: any;
    formResponseDetails: any;
    formCustomerDetails: any;
    formThanksDetails: any;
}

export type Testimonial = {
    id: string;
    createdAt: string;
    updatedAt: string;
    content: string;
    form: string;
    published: boolean;
    author: { name: "", job: "", company: "", photo: "", email: "", websiteUrl: "" };
    type: "video" | "text";
}