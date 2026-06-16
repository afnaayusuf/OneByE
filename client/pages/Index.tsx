import { useState, useEffect } from "react";

interface Metric {
  id: string;
  label: string;
  value: number | string;
  unit: string;
  description: string;
  apiEndpoint: string;
}

export default function Index() {
  const [metrics, setMetrics] = useState<Metric[]>([
    {
      id: "volume",
      label: "volume",
      value: 57,
      unit: "",
      description: "*Arbitrary calibrated units",
      apiEndpoint: "/api/metrics/volume",
    },
    {
      id: "pressure",
      label: "pressure",
      value: 13.4,
      unit: "",
      description: "*Dimensionless (0–20 scale)",
      apiEndpoint: "/api/metrics/pressure",
    },
    {
      id: "vibration",
      label: "vibration",
      value: 72.6,
      unit: "%",
      description: "% (0–100%)",
      apiEndpoint: "/api/metrics/vibration",
    },
    {
      id: "battery",
      label: "battery",
      value: 84,
      unit: "%",
      description: "% (0–100%)",
      apiEndpoint: "/api/metrics/battery",
    },
    {
      id: "network",
      label: "network",
      value: 23,
      unit: "",
      description: "*RSSI (0–31)",
      apiEndpoint: "/api/metrics/network",
    },
    {
      id: "gas",
      label: "gas",
      value: 1380,
      unit: "",
      description: "*Raw ADC (0–4095)",
      apiEndpoint: "/api/metrics/gas",
    },
  ]);

  const [loading, setLoading] = useState(false);

  // Fetch metrics from API endpoints
  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const updatedMetrics = await Promise.all(
        metrics.map(async (metric) => {
          try {
            const response = await fetch(metric.apiEndpoint);
            if (response.ok) {
              const data = await response.json();
              return { ...metric, value: data.value };
            }
          } catch {
            // Keep original value if fetch fails
          }
          return metric;
        })
      );
      setMetrics(updatedMetrics);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return (
    <div className="min-h-screen bg-white p-8 md:p-12 font-dm-sans relative overflow-hidden flex flex-col">
      {/* Main content wrapper */}
      <div className="max-w-7xl mx-auto w-full">
        <h1 className="text-4xl md:text-5xl font-bold mt-8 mb-16 text-black text-center">
          One<span className="font-normal">By</span>E.
        </h1>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 mb-16">
          {metrics.map((metric) => (
            <div
              key={metric.id}
              className="bg-gray-100 rounded-2xl p-6 flex flex-col h-64 hover:bg-gray-150 transition-colors items-center justify-center text-center"
            >
              {/* Label */}
              <h2 className="text-base font-medium text-black mb-4">
                {metric.label}
              </h2>

              {/* Value */}
              <div className="mb-4">
                <div className="inline-block border-2 border-black rounded-lg px-4 py-2">
                  <span className="text-2xl font-bold text-black">
                    {metric.value}
                  </span>
                  {metric.unit && (
                    <span className="text-lg font-medium text-black ml-1">
                      {metric.unit}
                    </span>
                  )}
                </div>
              </div>

              {/* Description only */}
              <div className="text-xs text-gray-600 px-2">
                <p>{metric.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Refresh Button */}
        <div className="flex gap-4 mt-20 justify-center">
          <button
            onClick={fetchMetrics}
            disabled={loading}
            className="px-8 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh Metrics"}
          </button>
        </div>
      </div>

      {/* Bottom Right Image - Portrait */}
      <div className="fixed bottom-0 right-0 w-64 h-auto md:w-80 pointer-events-none opacity-90">
        <img
          src="https://cdn.builder.io/api/v1/image/assets%2Fe823c8e023884dc69249e889278d0a1d%2Fa85e6212ad1e40728f4b25b9fbfa330b?format=webp&width=400"
          alt="OneByE"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
