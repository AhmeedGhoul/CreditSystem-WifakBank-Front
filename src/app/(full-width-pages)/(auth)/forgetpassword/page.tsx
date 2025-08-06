import {Metadata} from "next";
import SignInForm from "@/components/auth/SignInForm";
import ForgetPassword from "@/components/forgetPassword/ForgetPassword";

export const metadata: Metadata = {
    title: "Wifak Bank",
};

export default function SignIn() {
    return <ForgetPassword />;
}
