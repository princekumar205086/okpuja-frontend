"use client";
import * as React from "react";
import { CacheProvider } from "@emotion/react";
import emotionCache from "./emotionCache";

export default function EmotionProvider({ children }: { children: React.ReactNode }) {
  return <CacheProvider value={emotionCache}>{children}</CacheProvider>;
}
