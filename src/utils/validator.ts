import * as Yup from 'yup';
const registerUserSchema = Yup.object().shape({
    firstName: Yup.string().required("firstName must be provided").min(3, "firstName must be atleast three characters long").trim().lowercase(),
    lastName: Yup.string().required("lastName must be provided").min(3, "lastName must be atleast three characters long").trim().lowercase(),
    email: Yup.string().email("Email must be provided").required("Email must be provided").max(255, "Email must be atleast 255 characters long").trim().lowercase(),
    password: Yup.string().required("Password must be provided").min(3, "Password must be atleast three characters long").trim(),
    isAdmin: Yup.boolean().optional().default(false),
});
const loginUserSchema = Yup.object().shape({
    email: Yup.string().email("Email must be provided").required("Email must be provided").max(255, "Email must be atleast 255 characters long").trim().lowercase(),
    password: Yup.string().required("Password must be provided").min(3, "Password must be atleast three characters long").trim(),
});

export {
    registerUserSchema,
    loginUserSchema
}