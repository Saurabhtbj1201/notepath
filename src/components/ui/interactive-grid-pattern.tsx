import { useCallback, useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface InteractiveGridPatternProps
  extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  squares?: [number, number];
  className?: string;
  squaresClassName?: string;
}

export function InteractiveGridPattern({
  width = 40,
  height = 40,
  squares = [24, 24],
  className,
  squaresClassName,
  ...props
}: InteractiveGridPatternProps) {
  const id = useId();
  const containerRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoveredSquare, setHoveredSquare] = useState<string | null>(null);

  const getPos = useCallback(
    (x: number, y: number) => `${x}-${y}`,
    []
  );

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const numSquaresX = Math.ceil(dimensions.width / width) + 1;
  const numSquaresY = Math.ceil(dimensions.height / height) + 1;

  return (
    <svg
      ref={containerRef}
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full",
        className
      )}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M${width} 0L${width} ${height}M0 ${height}L${width} ${height}`}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.1}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
      <svg x={0} y={0} className="overflow-visible">
        {Array.from({ length: numSquaresY }, (_, y) =>
          Array.from({ length: numSquaresX }, (_, x) => (
            <rect
              key={getPos(x, y)}
              x={x * width}
              y={y * height}
              width={width}
              height={height}
              className={cn(
                "fill-transparent stroke-transparent transition-all duration-100 ease-in-out [&:not(:hover)]:duration-1000",
                hoveredSquare === getPos(x, y)
                  ? "fill-primary/10 stroke-primary/20"
                  : "",
                squaresClassName
              )}
              onMouseEnter={() => setHoveredSquare(getPos(x, y))}
              onMouseLeave={() => setHoveredSquare(null)}
              style={{ pointerEvents: "auto" }}
            />
          ))
        )}
      </svg>
    </svg>
  );
}