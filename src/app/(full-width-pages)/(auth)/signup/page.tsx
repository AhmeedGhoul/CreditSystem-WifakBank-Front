import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wifak Bank",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}
