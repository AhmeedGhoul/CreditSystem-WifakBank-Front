"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Checkbox from "@/components/form/input/Checkbox";
import Select from "@/components/form/Select";
import { useDropzone } from "react-dropzone";
import { createRequest } from "@/api/request";
import { Employment } from "@/interface/request";

export default function SubmitRequestForm() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        purpose: "",
        monthlyIncome: "",
        employmentStatus: "",
        yearsOfEmployment: "",
        existingLoans: false,
        hasCriminalRecord: false,
        numberOfCars: "",
        numberOfHouses: "",
        ownsBusiness: false,
        additionalInfo: "",
        otherIncomeSources: "",
        totalLoanAmount: "",
        monthlyLoanPayments: "",
        estimatedHouseValue: "",
        estimatedCarValue: "",
        bankSavings: "",
    });

    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const employmentOptions = [
        { value: "Employed", label: "Employed" },
        { value: "Self_Employed", label: "Self-Employed" },
        { value: "Unemployed", label: "Unemployed" },
        { value: "Student", label: "Student" },
    ];

    const onDrop = (acceptedFiles: File[]) => {
        setUploadedFiles((prev) => [...prev, ...acceptedFiles]);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: true,
        accept: {
            "application/pdf": [],
            "application/msword": [],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [],
            "image/png": [],
            "image/jpeg": [],
        },
    });

    const validateForm = () => {
        // Example: purpose, monthlyIncome, employmentStatus, yearsOfEmployment are required
        if (!formData.purpose.trim()) return "Purpose is required";
        if (!formData.monthlyIncome || isNaN(Number(formData.monthlyIncome))) return "Valid monthly income is required";
        if (!formData.employmentStatus) return "Employment status is required";
        if (!formData.yearsOfEmployment || isNaN(Number(formData.yearsOfEmployment))) return "Valid years of employment is required";
        // Add more validation if needed
        return null;
    };

    const handleSubmit = async () => {
        const validationError = validateForm();
        if (validationError) {
            setErrorMessage(validationError);
            setSuccessMessage(null);
            return;
        }

        setLoading(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            const payload = {
                purpose: formData.purpose,
                monthlyIncome: parseFloat(formData.monthlyIncome),
                employmentStatus: formData.employmentStatus as Employment,
                yearsOfEmployment: parseInt(formData.yearsOfEmployment),
                existingLoans: formData.existingLoans,
                numberOfCars: parseInt(formData.numberOfCars) || 0,
                numberOfHouses: parseInt(formData.numberOfHouses) || 0,
                hasCriminalRecord: formData.hasCriminalRecord,
                otherAssets: formData.additionalInfo,
                otherIncomeSources: formData.otherIncomeSources,
                totalLoanAmount: parseFloat(formData.totalLoanAmount) || 0,
                monthlyLoanPayments: parseFloat(formData.monthlyLoanPayments) || 0,
                estimatedHouseValue: parseFloat(formData.estimatedHouseValue) || 0,
                estimatedCarValue: parseFloat(formData.estimatedCarValue) || 0,
                bankSavings: parseFloat(formData.bankSavings) || 0,
                documents: uploadedFiles.map((file) => ({
                    documentDate: new Date(),
                    originalName: file.name,
                    mimeType: file.type,
                    size: file.size,
                    filePath: `/uploads/${file.name}`,
                })),
            };

            await createRequest(payload, uploadedFiles[0]);
            setSuccessMessage("Request submitted successfully! Redirecting...");
            setErrorMessage(null);

            setTimeout(() => {
                router.push("/space/");
            }, 1500);
        } catch (error) {
            setErrorMessage("Failed to submit request.");
            setSuccessMessage(null);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* All your inputs... */}
            <div className="md:col-span-2">
                <Label>Purpose of Request</Label>
                <Input
                    type="text"
                    placeholder="e.g. Join Money Circle"
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                />
            </div>

            <div>
                <Label>Monthly Income (TND)</Label>
                <Input
                    type="number"
                    value={formData.monthlyIncome}
                    onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                />
            </div>

            <div>
                <Label>Employment Status</Label>
                <Select
                    options={employmentOptions}
                    placeholder="Select employment status"
                    onChange={(value) => setFormData({ ...formData, employmentStatus: value })}
                />
            </div>

            <div>
                <Label>Years of Employment</Label>
                <Input
                    type="number"
                    value={formData.yearsOfEmployment}
                    onChange={(e) => setFormData({ ...formData, yearsOfEmployment: e.target.value })}
                />
            </div>

            <div>
                <Label>Other Income Sources</Label>
                <Input
                    type="text"
                    value={formData.otherIncomeSources}
                    onChange={(e) => setFormData({ ...formData, otherIncomeSources: e.target.value })}
                />
            </div>

            <div>
                <Label>Total Loan Amount (TND)</Label>
                <Input
                    type="number"
                    value={formData.totalLoanAmount}
                    onChange={(e) => setFormData({ ...formData, totalLoanAmount: e.target.value })}
                />
            </div>

            <div>
                <Label>Monthly Loan Payments (TND)</Label>
                <Input
                    type="number"
                    value={formData.monthlyLoanPayments}
                    onChange={(e) => setFormData({ ...formData, monthlyLoanPayments: e.target.value })}
                />
            </div>

            <div>
                <Label>Estimated House Value (TND)</Label>
                <Input
                    type="number"
                    value={formData.estimatedHouseValue}
                    onChange={(e) => setFormData({ ...formData, estimatedHouseValue: e.target.value })}
                />
            </div>

            <div>
                <Label>Estimated Car Value (TND)</Label>
                <Input
                    type="number"
                    value={formData.estimatedCarValue}
                    onChange={(e) => setFormData({ ...formData, estimatedCarValue: e.target.value })}
                />
            </div>

            <div>
                <Label>Bank Savings (TND)</Label>
                <Input
                    type="number"
                    value={formData.bankSavings}
                    onChange={(e) => setFormData({ ...formData, bankSavings: e.target.value })}
                />
            </div>

            <div>
                <Label>Number of Cars</Label>
                <Input
                    type="number"
                    value={formData.numberOfCars}
                    onChange={(e) => setFormData({ ...formData, numberOfCars: e.target.value })}
                />
            </div>

            <div>
                <Label>Number of Houses</Label>
                <Input
                    type="number"
                    value={formData.numberOfHouses}
                    onChange={(e) => setFormData({ ...formData, numberOfHouses: e.target.value })}
                />
            </div>

            <div className="md:col-span-2">
                <Label>Additional Info</Label>
                <TextArea
                    rows={4}
                    value={formData.additionalInfo}
                    onChange={(value) => setFormData({ ...formData, additionalInfo: value })}
                />
            </div>

            <div className="col-span-full space-y-2">
                <Checkbox
                    checked={formData.existingLoans}
                    onChange={(checked) => setFormData({ ...formData, existingLoans: checked })}
                    label="Do you have existing loans?"
                />
                <Checkbox
                    checked={formData.hasCriminalRecord}
                    onChange={(checked) => setFormData({ ...formData, hasCriminalRecord: checked })}
                    label="Do you have a criminal record?"
                />
                <Checkbox
                    checked={formData.ownsBusiness}
                    onChange={(checked) => setFormData({ ...formData, ownsBusiness: checked })}
                    label="Do you own a business?"
                />
            </div>



            {/* Upload section */}
            <div className="md:col-span-2">
                <Label>Upload Supporting Documents</Label>
                <div
                    {...getRootProps()}
                    className={`transition border border-dashed cursor-pointer rounded-xl p-6 text-center ${
                        isDragActive
                            ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
                            : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
                    }`}
                >
                    <input {...getInputProps()} />
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        Drag & drop one or more documents here, or click to select files
                    </p>
                    {uploadedFiles.length > 0 && (
                        <ul className="mt-2 text-sm text-brand-600 list-disc pl-4">
                            {uploadedFiles.map((file, idx) => (
                                <li key={idx}>{file.name}</li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Success and error messages */}
            <div className="md:col-span-2">
                {successMessage && <div className="text-green-600 font-semibold">{successMessage}</div>}
                {errorMessage && <div className="text-red-600 font-semibold">{errorMessage}</div>}
            </div>

            {/* Submit button */}
            <div className="md:col-span-2">
                <button
                    type="button"
                    className="px-6 py-3 rounded-xl bg-brand-600 text-white hover:bg-brand-700 transition shadow disabled:opacity-50"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? "Submitting..." : "Submit Request"}
                </button>
            </div>
        </div>
    );
}
