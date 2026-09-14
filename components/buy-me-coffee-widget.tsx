"use client";

import { usePathname } from "next/navigation";
import { Coffee } from "lucide-react";

const BMC_URL = "https://www.buymeacoffee.com/abenezerak8";

export default function BuyMeCoffeeWidget() {
  const pathname = usePathname();

  if (pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <a
      href={BMC_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Buy me a coffee"
      title="Buy me a coffee"
      className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#FFDD00] text-[#0d0d0d] shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:brightness-105 active:scale-[0.98]"
    >
      <Coffee className="h-5 w-5" />
    </a>
  );
}