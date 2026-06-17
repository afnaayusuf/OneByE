const DIGIT_HEIGHT = 36;
const DIGIT_WIDTH = 18;
const DOT_WIDTH = 10;
const TRANSITION_MS = 600;

function SingleDigit({ digit, isHovered }: { digit: string; isHovered: boolean }) {
  const colorClass = isHovered ? "text-white" : "text-black";

  if (digit === ".") {
    return (
      <span
        className={`text-2xl font-bold transition-colors duration-300 ${colorClass}`}
        style={{
          display: "inline-block",
          width: DOT_WIDTH,
          height: DIGIT_HEIGHT,
          lineHeight: `${DIGIT_HEIGHT}px`,
          textAlign: "center",
          verticalAlign: "bottom",
        }}
      >
        .
      </span>
    );
  }

  const num = parseInt(digit, 10);

  return (
    <span
      style={{
        display: "inline-block",
        overflow: "hidden",
        height: DIGIT_HEIGHT,
        width: DIGIT_WIDTH,
        verticalAlign: "bottom",
        position: "relative",
      }}
    >
      <span
        className={`transition-colors duration-300 ${colorClass}`}
        style={{
          display: "block",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          transition: `transform ${TRANSITION_MS}ms ease-out`,
          transform: `translateY(${-num * DIGIT_HEIGHT}px)`,
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <span
            key={n}
            className="text-2xl font-bold"
            style={{
              display: "block",
              height: DIGIT_HEIGHT,
              lineHeight: `${DIGIT_HEIGHT}px`,
              textAlign: "center",
            }}
          >
            {n}
          </span>
        ))}
      </span>
    </span>
  );
}

interface Props {
  value: number | string;
  isHovered: boolean;
  decimals?: number;
  maxDigits?: number;
  unit?: string;
}

export default function RollingNumber({ value, isHovered, decimals, maxDigits, unit }: Props) {
  let display: string;

  if (typeof value === "number") {
    display = decimals !== undefined ? value.toFixed(decimals) : String(value);
  } else {
    display = String(value);
  }

  const chars = display.split("");

  const totalWidth =
    chars.reduce((w, ch) => w + (ch === "." ? DOT_WIDTH : DIGIT_WIDTH), 0) +
    (unit ? 16 : 0);

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "flex-end",
        justifyContent: "center",
        height: DIGIT_HEIGHT,
        minWidth: maxDigits
          ? maxDigits * DIGIT_WIDTH + (decimals ? DOT_WIDTH : 0)
          : undefined,
      }}
    >
      {chars.map((ch, i) => (
        <SingleDigit key={`${i}-${chars.length}`} digit={ch} isHovered={isHovered} />
      ))}
      {unit && (
        <span
          className={`text-base font-medium transition-colors duration-300 ${isHovered ? "text-white" : "text-black"}`}
          style={{
            lineHeight: `${DIGIT_HEIGHT}px`,
            height: DIGIT_HEIGHT,
            display: "inline-block",
            verticalAlign: "bottom",
            marginLeft: 2,
          }}
        >
          {unit}
        </span>
      )}
    </span>
  );
}
