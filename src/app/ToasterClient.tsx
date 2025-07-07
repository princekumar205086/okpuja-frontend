"use client";
import { Toaster } from "react-hot-toast";

export default function ToasterClient() {
  return (
    <Toaster 
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#363636',
          color: '#fff',
        },
      }}
    />
  );
}
