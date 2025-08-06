"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";
import {useRouter} from "next/navigation";
import {loginUser, RegisterUser} from "@/api/auth";
import Button from "@/components/ui/button/Button";
import {CivilStatus} from "@/interface/User";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [adress, setAdress] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState<number>(0);
  const [age, setAge] = useState<number>(0);
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  const [civilStatus, setCivilStatus] = useState<CivilStatus>("Single");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const calculateAge = (dob: Date) => {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const hasBirthdayPassed =
        today.getMonth() > dob.getMonth() ||
        (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());

    if (!hasBirthdayPassed) {
      age--;
    }

    return age;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!dateOfBirth) throw new Error("Birth date is required");

      const birthDateObj = new Date(dateOfBirth);
      const calculatedAge = calculateAge(birthDateObj);

      await RegisterUser({
        firstName,
        lastName,
        email,
        password,
        age: calculatedAge,
        adress,
        phoneNumber,
        dateOfBirth: birthDateObj,
        civilStatus
      });

      router.push("/signin");
    } catch (err: any) {
      setError(err.message || "Sign-up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/space"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          Back to Main Page
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign Up
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign up!
            </p>
          </div>
          <div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* <!-- First Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      First Name<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="fname"
                      name="fname"
                      value={firstName}
                      placeholder="Enter your first name"
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <Label>
                      Last Name<span className="text-error-500">*</span>
                    </Label>
                    <Input
                        type="text"
                        id="lname"
                        name="lname"
                        value={lastName}
                        placeholder="Enter your last name"
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                  </div>

                </div>
                <div className="space-y-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <Label>
                        BirthDate<span className="text-error-500">*</span>
                      </Label>
                      <Input
                          type="date"
                          id="birthdate"
                          name="birthdate"
                          value={dateOfBirth}
                          onChange={(e) => setDateOfBirth(e.target.value)}
                          required
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <Label>
                        Phone Number<span className="text-error-500">*</span>
                      </Label>
                      <Input
                          type="text"
                          id="phoneNumber"
                          name="phoneNumber"
                          value={phoneNumber}
                          placeholder="Enter your adress"
                          onChange={(e) => setPhoneNumber(Number(e.target.value))}
                          required
                      />
                    </div>


                  </div>
                </div>
                <div className="space-y-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <Label>
                        Adress<span className="text-error-500">*</span>
                      </Label>
                      <Input
                          type="text"
                          id="adress"
                          name="adress"
                          value={adress}
                          placeholder="Enter your adress"
                          onChange={(e) => setAdress(e.target.value)}
                          required
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <Label>
                        Civil Status<span className="text-error-500">*</span>
                      </Label>
                      <select
                          id="civilstatus"
                          name="civilstatus"
                          value={civilStatus}
                          onChange={(e) => setCivilStatus(e.target.value as CivilStatus)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white"
                          required
                      >
                        <option value="" disabled>Select your civil status</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widow">Widowed</option>
                      </select>
                    </div>


                  </div>
                </div>


                {/* <!-- Email --> */}
                <div>
                  <Label>
                    Email<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                {/* <!-- Password --> */}
                <div>
                  <Label>
                    Password<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Enter your password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>
                {/* <!-- Checkbox --> */}
                <div className="flex items-center gap-3">
                  <Checkbox
                    className="w-5 h-5"
                    checked={isChecked}
                    onChange={setIsChecked}
                  />
                  <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                    By creating an account means you agree to the{" "}
                    <span className="text-gray-800 dark:text-white/90">
                      Terms and Conditions,
                    </span>{" "}
                    and our{" "}
                    <span className="text-gray-800 dark:text-white">
                      Privacy Policy
                    </span>
                  </p>
                </div>
                {error && (
                    <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
                )}
                <div>
                  <Button className="w-full" size="sm" disabled={loading}>
                    {loading ? "Signing Up..." : "Sign Up"}
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Already have an account?
                <Link
                  href="/signin"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
