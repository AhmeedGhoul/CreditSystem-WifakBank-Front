"use client";
import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { createContract, fetchTakenRanks } from "@/api/contract";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";

const SignatureCanvas = dynamic(() => import("react-signature-canvas"), { ssr: false }) as any;

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
    const [takenRanks, setTakenRanks] = useState<number[]>([]);
    const [selectedRank, setSelectedRank] = useState<string>("0");
    const [availableRanks, setAvailableRanks] = useState<{ label: string; value: string }[]>([]);
    const steps = Math.floor(period / frequency);
    const basePayment = finalValue  / steps;
    const totalProfit = finalValue * 0.005;
    const mid = Math.ceil(steps / 2);

    const rankNumber = parseInt(selectedRank);
    const normalized = selectedRank === "0" ? 0 : (mid - rankNumber) / (steps - 1);
    const adjustment = normalized * totalProfit;
    const finalPayment = basePayment + adjustment;

    useEffect(() => {
        if (isOpen && creditPoolId) {
            fetchTakenRanks(creditPoolId).then((taken) => {
                setTakenRanks(taken);
                const options = [{ label: "Random", value: "0" }];
                const maxParticipants = steps;
                for (let i = 1; i <= maxParticipants; i++) {
                    if (!taken.includes(i)) {
                        options.push({ label: `Position ${i}`, value: String(i) });
                    }
                }
                setAvailableRanks(options);
            });
        }
    }, [isOpen, creditPoolId, steps]);


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
                    amount: finalPayment *(period / frequency),
                    creditPoolId: creditPoolId,
                    period,
                    frequency,
                    rank: parseInt(selectedRank),
                },
                file
            );

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
                    By signing below,
                    <strong>You agree to pay:</strong>{" "}
                    <span style={{ color: "red", fontWeight: "bold" }}>
            {finalPayment.toFixed(2)} DT
          </span>{" "}
                    every {frequency} month(s), over {period} months.
                </p>
                    {selectedRank !== "0" && (
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                            Based on your selected rank <strong>({selectedRank})</strong>,{" "}
                            {adjustment > 0
                                ? `you benefit from a bonus of +${adjustment.toFixed(2)} DT`
                                : `you contribute an additional ${Math.abs(adjustment).toFixed(2)} DT`}{" "}
                            to balance the system and ensure fairness.
                        </p>
                    )}
            </div>

            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">Please sign below:</p>
            <div className="border border-gray-400 rounded-md p-2 bg-white my-2">
                <SignatureCanvas
                    penColor="black"
                    ref={signatureRef}
                    canvasProps={{ width: 400, height: 150, className: "sigCanvas" }}
                />
            </div>

            <div className="my-4">
                <Label>Select Cashout Position</Label>
                <Select
                    options={availableRanks}
                    placeholder="Choose your position"
                    onChange={(value) => setSelectedRank(value)}
                    value={selectedRank}
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
