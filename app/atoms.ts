import { atom } from "recoil";

export const stepState = atom({
  key: 'step', // unique ID (with respect to other atoms/selectors)
  default: 0, // default value (aka initial value)
});

export const FormDesignState = atom({
  key: 'FormDesign', // unique ID (with respect to other atoms/selectors)
  default: {
    logo: "https://via.placeholder.com/60",
    primaryColor: "#000000"
  },
});
export const FormWelcomeDetailsState = atom({
  key: 'FormWelcomeDetailsState', // unique ID (with respect to other atoms/selectors)
  default: {
    title: "Share a testimonial!",
    content: `
  Do you love using our product ? We'd love to hear about it!
  - Share your experience with a quick video or text testimonial
  - Recording a video ? Don't forget to smile 😊
  `,
    collectVideo: true,
    collectText: true
  },
});

export const FormResponseDetailsState = atom({
  key: 'FormResponseDetails', // unique ID (with respect to other atoms/selectors)
  default: {
    videoPrompt: `
  - What do you like most about us?
  - Would you recommend us to a friend?
  `,
    textPrompt: `
  - What do you like most about us?
  - Would you recommend us to a friend?
  `
  },
});

export const FormCustomerDetailsState = atom({
  key: 'FormCustomerDetails', // unique ID (with respect to other atoms/selectors)
  default: {
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
  }
})

export const FormThanksState = atom({
  key: "FormThanks",
  default: {
    title: "Thanks for leaving me a testimonial 🙏",
    content: "Thank you so much for your support! We appreciate your support and we hope you enjoy using our product."
  }
})

export const submittedTestimonialState = atom({
  key: "submittedTestimonial",
  default: {
    content: "",
    type: "video" || "text",
  }
})