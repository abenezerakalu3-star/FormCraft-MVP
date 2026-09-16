"use client";

import { MotionConfig } from "framer-motion";
import PageVeil from "./page-veil";
import ScrollNavbar from "./scroll-navbar";

export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ScrollNavbar />
      <PageVeil />
      {children}
    </MotionConfig>
  );
}