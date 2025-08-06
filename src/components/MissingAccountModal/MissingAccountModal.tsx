"use client";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function MissingAccountModal({
                                                isOpen,
                                                onClose,
                                            }: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const router = useRouter();

    const handleRedirect = () => {
        onClose();
        router.push("moneyAccount/add");
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="No Account Found">
            <p className="text-gray-700 dark:text-gray-300 text-sm">
                You must create a money account before joining a circle.
            </p>
            <div className="flex justify-end space-x-4 pt-4">
                <Button variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button onClick={handleRedirect}>
                    Add Money Account
                </Button>
            </div>
        </Modal>
    );
}
