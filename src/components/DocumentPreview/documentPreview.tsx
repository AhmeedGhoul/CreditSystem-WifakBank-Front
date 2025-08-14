"use client";

import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

import workerSrc from "pdfjs-dist/build/pdf.worker.min.js";

interface Props {
    fileUrl: string;
    mimeType: string;
    onClose: () => void;
}

export default function DocumentPreviewModal({ fileUrl, mimeType, onClose }: Props) {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    const isImage = mimeType.startsWith("image/");
    const isPdf = mimeType === "application/pdf";

    return (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
            <div className="relative bg-white w-[90%] h-[90%] rounded-lg shadow-lg overflow-hidden">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 z-50 bg-white border text-gray-800 px-3 py-1 rounded-full shadow hover:bg-gray-200"
                >
                    ✕
                </button>

                <div className="w-full h-full">
                    {isImage && (
                        <img
                            src={fileUrl}
                            alt="Preview"
                            className="object-contain w-full h-full"
                        />
                    )}

                    {isPdf && (
                        <Worker workerUrl={workerSrc}>
                            <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
                        </Worker>
                    )}

                    {!isImage && !isPdf && (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            Unsupported file type: {mimeType}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
