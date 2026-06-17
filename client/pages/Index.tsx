import { useState, useEffect, useRef, useCallback } from "react";
import RollingNumber from "../components/RollingNumber";

function useColumns() {
  const [cols, setCols] = useState(6);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1024) setCols(6);
      else if (w >= 640) setCols(3);
      else setCols(2);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return cols;
}

interface Metric {
  id: string;
  label: string;
  value: number | string;
  unit: string;
  description: string;
  decimals?: number;
  maxDigits: number;
}

const METRIC_DEFS: Omit<Metric, "value">[] = [
  { id: "volume", label: "volume", unit: "", description: "*Arbitrary calibrated units", maxDigits: 3 },
  { id: "pressure", label: "pressure", unit: "", description: "*Dimensionless (0–20 scale)", decimals: 1, maxDigits: 3 },
  { id: "vibration", label: "vibration", unit: "%", description: "% (0–100%)", decimals: 1, maxDigits: 3 },
  { id: "battery", label: "battery", unit: "%", description: "% (0–100%)", maxDigits: 3 },
  { id: "network", label: "network", unit: "", description: "*RSSI (0–31)", maxDigits: 2 },
  { id: "gas", label: "gas", unit: "", description: "*Raw ADC (0–4095)", maxDigits: 4 },
];

const GLITCH_CHARS = "*#!&%$~^+≡§¤░▒▓█";
const GLITCH_FONTS = [
  "monospace",
  "serif",
  "Georgia, serif",
  "'Courier New', monospace",
  "Impact, sans-serif",
  "'Times New Roman', serif",
];

function GlitchLogo() {
  const [glitchE, setGlitchE] = useState<string | null>(null);
  const [glitchFont, setGlitchFont] = useState<string>("");
  const [dotGreen, setDotGreen] = useState(false);

  useEffect(() => {
    const runGlitch = () => {
      let frame = 0;
      const totalFrames = 8;
      const interval = setInterval(() => {
        if (frame < totalFrames) {
          setGlitchE(GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]);
          setGlitchFont(GLITCH_FONTS[Math.floor(Math.random() * GLITCH_FONTS.length)]);
          frame++;
        } else {
          clearInterval(interval);
          setGlitchE(null);
          setGlitchFont("");
          setDotGreen(true);
          setTimeout(() => setDotGreen(false), 400);
        }
      }, 60);
    };

    const scheduleNext = () => {
      const delay = 6000 + Math.random() * 8000;
      return setTimeout(() => {
        runGlitch();
        timerId = scheduleNext();
      }, delay);
    };

    let timerId = scheduleNext();
    return () => clearTimeout(timerId);
  }, []);

  return (
    <h1 className="text-5xl md:text-6xl font-bold mt-8 mb-24 text-black">
      One<span className="font-thin italic" style={{ letterSpacing: "0.05em" }}>B<span style={{ display: "inline-block", transform: "scaleX(-1)", marginLeft: "0.12em" }}>y</span></span><span
        style={{
          display: "inline-block",
          width: "0.65em",
          textAlign: "center",
          overflow: "hidden",
          verticalAlign: "baseline",
          position: "relative",
          top: "0.1em",
          marginLeft: "-0.05em",
          fontFamily: glitchE ? glitchFont : "inherit",
          fontWeight: glitchE ? "normal" : "bold",
        }}
      >
        {glitchE ?? "E"}
      </span>
      <span
        style={{
          transition: "color 0.15s ease-out",
          color: dotGreen ? "#22c55e" : "black",
        }}
      >
        .
      </span>
    </h1>
  );
}

export default function Index() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const cols = useColumns();

  const [metrics, setMetrics] = useState<Metric[]>(
    METRIC_DEFS.map((d) => ({ ...d, value: "--" }))
  );

  const [refreshing, setRefreshing] = useState(false);

  const fetchMetrics = useCallback(async () => {
    try {
      const res = await fetch("/api/metrics");
      if (res.ok) {
        const data: Record<string, number> = await res.json();
        setMetrics((prev) =>
          prev.map((m) => ({
            ...m,
            value: data[m.id] !== undefined ? data[m.id] : m.value,
          }))
        );
      }
    } catch {
      // keep existing values
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchMetrics();
    await new Promise((r) => setTimeout(r, 400));
    setRefreshing(false);
  }, [fetchMetrics]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return (
    <div className="min-h-screen bg-white p-8 md:p-12 font-dm-sans relative overflow-hidden flex flex-col">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex justify-center">
          <GlitchLogo />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 mb-16 mt-16">
          {metrics.map((metric, index) => {
            const isHovered = hoveredIndex === index;
            const sameRow =
              hoveredIndex !== null &&
              Math.floor(index / cols) === Math.floor(hoveredIndex / cols);
            const moveLeft = sameRow && index < hoveredIndex;
            const moveRight = sameRow && index > hoveredIndex;

            return (
              <div
                key={metric.id}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`bg-[#DADADA] rounded-2xl p-8 flex flex-col h-80 justify-between text-center transition-all duration-300 ease-out cursor-pointer
                ${isHovered ? "bg-black text-white" : ""}
                ${moveLeft ? "-translate-x-2" : ""}
                ${moveRight ? "translate-x-2" : ""}
                `}
              >
                <h2 className={`text-2xl font-medium transition-colors duration-300 ${isHovered ? "text-white" : "text-black"}`}>
                  {metric.label}
                </h2>

                <div className="flex items-center justify-center">
                  <div
                    className={`border rounded-lg px-4 py-2 transition-colors duration-300 ${
                      isHovered ? "border-white bg-black" : "border-black bg-transparent"
                    }`}
                    style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <RollingNumber
                      value={metric.value}
                      isHovered={isHovered}
                      decimals={metric.decimals}
                      maxDigits={metric.maxDigits}
                      unit={metric.unit}
                    />
                  </div>
                </div>

                <div className={`text-xs px-2 transition-colors duration-300 ${
                  isHovered ? "text-gray-200" : "text-gray-700"
                }`}>
                  <p>{metric.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center mt-8 mb-12">
          <button
            onClick={handleRefresh}
            className={`py-3 rounded-lg font-medium font-dm-sans text-base transition-all duration-200 border
              ${refreshing
                ? "bg-white text-black border-black px-14"
                : "bg-black text-white border-black px-10 hover:scale-[1.03] active:bg-white active:text-black active:border-black active:px-14"
              }`}
            style={{ borderWidth: 1 }}
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="fixed bottom-0 right-0 pointer-events-none opacity-90 w-[25vw] min-w-[120px] max-w-[320px]">
        <img
          src="https://cdn.builder.io/api/v1/image/assets%2Fe823c8e023884dc69249e889278d0a1d%2Fa85e6212ad1e40728f4b25b9fbfa330b?format=webp&width=400"
          alt="OneByE"
          className="w-full h-auto object-cover"
        />
      </div>
    </div>
  );
}
