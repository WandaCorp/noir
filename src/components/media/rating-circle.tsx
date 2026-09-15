import { cn } from "@/lib/utils";

type RatingCircleProps = {
  rating: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
};

export function RatingCircle({
  rating,
  size = 35,
  strokeWidth = 2.3,
  className,
}: RatingCircleProps) {
  // Convertir rating de 0-10 a porcentaje 0-100
  const percentage = Math.min(Math.max(rating * 10, 0), 100);

  // Radio del círculo
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  // Color según calificación
  const color =
    rating >= 7.5
      ? "#22c55e" // verde
      : rating >= 5
        ? "#eab308" // amarillo
        : "#ef4444"; // rojo

  return (
    <div
      className={cn("relative grid place-items-center", className)}
      style={{ width: size, height: size }}
      aria-label={`Calificación: ${rating.toFixed(1)} de 10`}
    >
      {/* SVG circular */}
      <svg
        width={size}
        height={size}
        className="absolute inset-0 -rotate-90"
        aria-hidden="true"
      >
        {/* Círculo de fondo (gris) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="rgba(0, 0, 0, 0.75)"
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth={strokeWidth}
        />
        {/* Círculo de progreso (color según rating) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 0.6s ease-out",
          }}
        />
      </svg>
      {/* Número dentro */}
      <span className="relative z-10 text-[11px] font-bold tabular-nums text-white">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}