"use client";
import React, { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { createContract } from "@/api/contract";

// Dynamic import to fix compatibility issues
const SignatureCanvas = dynamic(() => import("react-signature-canvas"), {
    ssr: false,
}) as any;

type Props = {
    isOpen: boolean;
    onClose: () => void;
    creditPoolId: number;
    frequency: number;
    period: number;
    finalValue: number;
    onSubmitContract?: (signatureData: any) => void;
};

export default function SignContractModal({
                                              isOpen,
                                              onClose,
                                              creditPoolId,
                                              frequency,
                                              period,
                                              finalValue,
                                          }: Props) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const signatureRef = useRef<any>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const steps = Math.floor(period / frequency);
    const amountPerStep = steps > 0 ? finalValue / steps : 0;

    const handleGenerateContract = async () => {
        if (!signatureRef.current || signatureRef.current.isEmpty()) {
            alert("Please sign before submitting.");
            return;
        }

        setIsGenerating(true);

        try {
            const canvas = await html2canvas(scrollRef.current!, {
                scale: 2,
                useCORS: true,
            });

            const signatureImage = signatureRef.current.getTrimmedCanvas().toDataURL("image/png");

            const pdf = new jsPDF("p", "mm", "a4");
            const imgData = canvas.toDataURL("image/png");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

            const sigImg = new Image();
            sigImg.src = signatureImage;

            await new Promise((resolve) => {
                sigImg.onload = () => {
                    pdf.addImage(sigImg, "PNG", 10, pdfHeight + 10, 60, 20);
                    resolve(true);
                };
            });

            const blob = pdf.output("blob");
            const file = new File([blob], "signed_contract.pdf", { type: "application/pdf" });

            await createContract(
                {
                    contractDate: new Date(),
                    amount: finalValue,
                    creditPoolId: creditPoolId,
                    period,
                },
                file
            );
            console.log(creditPoolId);

            alert("✅ Contract submitted successfully.");
            onClose();
        } catch (error) {
            console.error("❌ Contract error:", error);
            alert("Error submitting contract.");
        }

        setIsGenerating(false);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Sign Your Contract">
            <div
                ref={scrollRef}
                style={{
                    backgroundColor: "#ffffff",
                    color: "#000000",
                    padding: "1rem",
                    maxHeight: "450px",
                    overflowY: "auto",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    fontSize: "14px",
                    lineHeight: "1.6",
                    fontFamily: "Arial, sans-serif",
                }}
            >
                <h2 style={{ fontSize: "20px", fontWeight: "bold", textAlign: "center" }}>
                    Money Circle Participation Agreement
                </h2>
                <p>
                    This Agreement is made between the Participant and the Organizer of the Money Circle
                    program ("System"). The purpose of this agreement is to outline the mutual
                    responsibilities of all parties participating in the savings system.
                </p>
                <p>
                    The Participant agrees to join a group where each member contributes a fixed amount
                    periodically. At each cycle, one member receives the pooled amount.
                </p>
                <p>By entering this agreement, the Participant commits to:</p>
                <ul style={{ paddingLeft: "1.5rem" }}>
                    <li>Contributing the agreed amount regularly</li>
                    <li>Respecting the payout order</li>
                </ul>
                <p>
                    The Organizer will coordinate payments and ensure fairness, but is not liable for
                    defaulting participants or unforeseen events.
                </p>
                <p>
                    By signing below, you confirm your agreement to the terms.
                </p>
                <p style={{ color: "red", fontWeight: "bold", marginTop: "1rem" }}>
                    You agree to pay {amountPerStep.toFixed(2)} DT every {frequency} month(s) to reach{" "}
                    {finalValue} DT over {period} months.
                </p>
            </div>

            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">Please sign below:</p>
            <div className="border border-gray-400 rounded-md p-2 bg-white my-2">
                <SignatureCanvas
                    penColor="black"
                    ref={signatureRef}
                    canvasProps={{ width: 400, height: 150, className: "sigCanvas" }}
                />
            </div>

            <div className="flex justify-end space-x-4 pt-2">
                <Button variant="destructive" onClick={() => signatureRef.current?.clear()}>
                    Clear
                </Button>
                <Button onClick={handleGenerateContract} disabled={isGenerating}>
                    {isGenerating ? "Processing..." : "Confirm & Submit"}
                </Button>
            </div>
        </Modal>
    );
}
