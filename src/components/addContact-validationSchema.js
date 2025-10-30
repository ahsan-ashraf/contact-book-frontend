import * as Yup from "yup";

export const contactValidationSchema = Yup.object({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .required("Name is required"),

  phone: Yup.string()
    .matches(/^\d+$/, "Phone must contain only numbers")
    .min(10, "Phone must be at least 10 digits")
    .max(15, "Phone must be at most 15 digits")
    .required("Phone is required"),

  address: Yup.string()
    .min(5, "Address must be at least 5 characters")
    .required("Address is required"),

  about: Yup.string()
    .min(3, "About info must be at least 10 characters")
    .required("About info is required"),

  relation: Yup.string().required("Relation is required"),
});
