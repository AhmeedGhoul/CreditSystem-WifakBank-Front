"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

type LoadingContextType = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);

  return (
      <LoadingContext.Provider value={{ loading, setLoading }}>
        {children}
        {loading && (
            <div
                style={{
                  position: "fixed",
                  inset: 0,
                  backgroundColor: "rgba(0,0,0,0.4)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 9999,
                }}
            >
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <div className="rolling-spinner" />
              </div>
            </div>
        )}
        <style jsx>{`
        .rolling-spinner {
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-top: 4px solid #4f46e5; /* Indigo 600 */
          border-radius: 50%;
          width: 48px;
          height: 48px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
      </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) throw new Error("useLoading must be used within LoadingProvider");
  return context;
}