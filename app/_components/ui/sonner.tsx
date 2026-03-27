"use client";

import { Toaster as Sonner } from "sonner";

const Toaster = () => {
  return (
    <Sonner
      theme="light"
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        duration: 4000,
        style: {
          borderRadius: "12px",
        },
      }}
    />
  );
};

export { Toaster };
