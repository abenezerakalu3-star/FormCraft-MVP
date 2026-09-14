import { Coffee } from "lucide-react";

const BMC_URL = "https://www.buymeacoffee.com/abenezerak8";

export default function BuyMeCoffeeButton() {
  return (
    <a
      href={BMC_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-xl bg-[#FFDD00] px-5 py-2.5 text-sm font-bold text-[#0d0d0d] shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:brightness-105 active:scale-[0.98]"
    >
      <Coffee className="h-4 w-4" /> Buy me a coffee
    </a>
  );
}