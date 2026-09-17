import Image from "next/image";

export default function LogoMark({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt=""
      width={64}
      height={64}
      priority
      className={`h-8 w-8 shrink-0 rounded-lg object-cover ${className}`}
    />
  );
}
