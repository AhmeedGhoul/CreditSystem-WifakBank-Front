"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { RegisterUser } from "@/api/auth";
import Button from "@/components/ui/button/Button";
import { CivilStatus } from "@/interface/User";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [adress, setAdress] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [civilStatus, setCivilStatus] = useState<CivilStatus>("Single");
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  const validateInputs = () => {
    const errors: { [key: string]: string } = {};

    if (!firstName.trim()) errors.firstName = "First name is required.";
    if (!lastName.trim()) errors.lastName = "Last name is required.";
    if (!adress.trim()) errors.adress = "Address is required.";

    if (!email.trim()) {
      errors.email = "Email is required.";
    } else if (!emailRegex.test(email)) {
      errors.email = "Email is invalid.";
    } else if (email.length > 255) {
      errors.email = "Email must be less than 256 characters.";
    }

    if (!phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required.";
    } else if (!/^\d+$/.test(phoneNumber)) {
      errors.phoneNumber = "Phone number must contain digits only.";
    } else if (phoneNumber.length < 8 || phoneNumber.length > 15) {
      errors.phoneNumber = "Phone number length must be between 8 and 15 digits.";
    }

    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    } else if (password.length > 255) {
      errors.password = "Password must be less than 256 characters.";
    }

    if (!dateOfBirth) {
      errors.dateOfBirth = "Birth date is required.";
    } else {
      const dob = new Date(dateOfBirth);
      const age = calculateAge(dob);
      if (age < 18) {
        errors.dateOfBirth = "You must be at least 18 years old.";
      }
    }

    if (!civilStatus) {
      errors.civilStatus = "Civil status is required.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    if (!validateInputs()) return;

    setLoading(true);
    try {
      await RegisterUser({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
        age: calculateAge(new Date(dateOfBirth)),
        adress: adress.trim(),
        phoneNumber: Number(phoneNumber),
        dateOfBirth: new Date(dateOfBirth),
        civilStatus,
      });
      router.push("/signin");
    } catch (err: any) {
      setServerError(err.message || "Sign-up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
        <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
          <Link
              href="/signin"
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
                Enter your details to sign up!
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
                        aria-invalid={!!formErrors.firstName}
                        aria-describedby="fname-error"
                    />
                    {formErrors.firstName && (
                        <p id="fname-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {formErrors.firstName}
                        </p>
                    )}
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
                        aria-invalid={!!formErrors.lastName}
                        aria-describedby="lname-error"
                    />
                    {formErrors.lastName && (
                        <p id="lname-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {formErrors.lastName}
                        </p>
                    )}
                  </div>
                </div>

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
                        aria-invalid={!!formErrors.dateOfBirth}
                        aria-describedby="birthdate-error"
                    />
                    {formErrors.dateOfBirth && (
                        <p id="birthdate-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {formErrors.dateOfBirth}
                        </p>
                    )}
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
                        placeholder="Enter your phone number"
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                        aria-invalid={!!formErrors.phoneNumber}
                        aria-describedby="phoneNumber-error"
                    />
                    {formErrors.phoneNumber && (
                        <p id="phoneNumber-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {formErrors.phoneNumber}
                        </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <Label>
                      Address<span className="text-error-500">*</span>
                    </Label>
                    <Input
                        type="text"
                        id="adress"
                        name="adress"
                        value={adress}
                        placeholder="Enter your address"
                        onChange={(e) => setAdress(e.target.value)}
                        required
                        aria-invalid={!!formErrors.adress}
                        aria-describedby="adress-error"
                    />
                    {formErrors.adress && (
                        <p id="adress-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {formErrors.adress}
                        </p>
                    )}
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
                        aria-invalid={!!formErrors.civilStatus}
                        aria-describedby="civilstatus-error"
                    >
                      <option value="" disabled>
                        Select your civil status
                      </option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widow">Widowed</option>
                    </select>
                    {formErrors.civilStatus && (
                        <p
                            id="civilstatus-error"
                            className="mt-1 text-sm text-red-600 dark:text-red-400"
                        >
                          {formErrors.civilStatus}
                        </p>
                    )}
                  </div>
                </div>

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
                      aria-invalid={!!formErrors.email}
                      aria-describedby="email-error"
                  />
                  {formErrors.email && (
                      <p id="email-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {formErrors.email}
                      </p>
                  )}
                </div>

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
                        aria-invalid={!!formErrors.password}
                        aria-describedby="password-error"
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
                  {formErrors.password && (
                      <p id="password-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {formErrors.password}
                      </p>
                  )}
                </div>

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
                {serverError && (
                    <div className="text-sm text-red-600 dark:text-red-400">{serverError}</div>
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
                Already have an account?{" "}
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
  );
}
