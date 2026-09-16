"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollNavbar() {
  const pathname = usePathname();

  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;

    const onScroll = () => {
      header.classList.toggle("scrolled", window.scrollY > 8);
    };

    const frame = window.requestAnimationFrame(() => {
      header.classList.add("nav-entered");
    });
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  return null;
}