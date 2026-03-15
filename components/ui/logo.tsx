import { cn } from "@/lib/utils";

export function Logo({
  size = 32,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
    >
      <defs>
        <linearGradient id="logo-grad" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="96" fill="#0c0c14" />
      <rect width="512" height="512" rx="96" fill="none" stroke="rgba(124,58,237,0.25)" strokeWidth="3" />
      <path
        d="M 66,96 L 66,416 M 66,96 L 196,256 L 326,96 L 326,416 M 326,256 L 446,256 M 446,96 L 446,416"
        stroke="url(#logo-grad)"
        strokeWidth="44"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
