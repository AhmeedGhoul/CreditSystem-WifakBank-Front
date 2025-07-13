"use client";
import React, { useRef, useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  className?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  isFullscreen?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
                                              isOpen,
                                              onClose,
                                              title,
                                              children,
                                              className,
                                              showCloseButton = true,
                                              isFullscreen = false,
                                            }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const contentClasses = isFullscreen
      ? "w-full h-full"
      : "relative w-full max-w-xl rounded-3xl bg-white dark:bg-gray-900 p-6 sm:p-8";

  return (
      <div className="fixed inset-0 z-[99999] flex items-center justify-center overflow-y-auto">
        {!isFullscreen && (
            <div
                className="fixed inset-0 h-full w-full bg-gray-400/50 backdrop-blur-[32px]"
                onClick={onClose}
            />
        )}
        <div
            ref={modalRef}
            className={`${contentClasses} ${className}`}
            onClick={(e) => e.stopPropagation()}
        >
          {showCloseButton && (
              <button
                  onClick={onClose}
                  className="absolute right-3 top-3 sm:right-6 sm:top-6 z-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 p-2"
              >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path
                      d="M6.04 16.54c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.54 4.54c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.54-4.54a.996.996 0 1 0-1.41-1.41L12 10.59 7.46 6.05a.996.996 0 1 0-1.41 1.41L10.59 12l-4.54 4.54Z"
                      fill="currentColor"
                  />
                </svg>
              </button>
          )}
          {title && (
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{title}</h2>
          )}
          <div>{children}</div>
        </div>
      </div>
  );
};
