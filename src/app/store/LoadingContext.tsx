"use client";

import React, { createContext, useContext, useState } from "react";

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
      {isLoading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
          {/* You can replace with your own spinner component */}
        </div>
      )}
    </LoadingContext.Provider>
  );
};

export const useGlobalLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useGlobalLoading must be used within LoadingProvider");
  }
  return context;
};
