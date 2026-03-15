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
      width={size * (290 / 96)}
      height={size}
      viewBox="0 0 290 96"
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
      <path
        d="M 10,8 L 10,88 M 10,8 L 75,48 L 140,8 L 140,88 M 140,48 L 260,48 M 260,8 L 260,88"
        stroke="url(#logo-grad)"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
