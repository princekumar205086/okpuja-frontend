"use client";

import React, { useState, useEffect } from "react";
import Loader from "@/app/utils/loader"; // Import your loader component

const LoaderWrapper = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handlePageLoad = () => setIsLoading(false);

    // Simulate loading for demonstration (can be replaced with actual data fetching/loading)
    if (document.readyState === "complete") {
      setIsLoading(false);
    } else {
      window.addEventListener("load", handlePageLoad);
    }

    return () => {
      window.removeEventListener("load", handlePageLoad);
    };
  }, []);

  return <>{isLoading ? <Loader /> : children}</>;
};

export default LoaderWrapper;
