import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { api } from "../api/client";

interface Zone {
  region_city: string;
  risk_level: "green" | "yellow" | "orange" | "red";
  report_count: number;
  top_scam_types: string[];
}

interface HotspotResponse {
  window: string;
  zones: Zone[];
}

const RISK_COLOR: Record<Zone["risk_level"], string> = {
  green:  "bg-safe",
  yellow: "bg-caution",
  orange: "bg-saffron",
  red:    "bg-highrisk",
};

export default function RiskMap() {
  const [window, setWindow] = useState<"week" | "month">("week");
  const [zones, setZones] = useState<Zone[]>([]);

  useEffect(() => {
    api
      .get<HotspotResponse>(`/api/hotspots?window=${window}`)
      .then((r) => setZones(r.zones))
      .catch(() => setZones([]));
  }, [window]);

  return (
    <Layout>
      <div className="mb-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-ink">Risk map</h1>
        <div className="flex rounded-card border border-hairline text-sm">
          {(["week", "month"] as const).map((w) => (
            <button
              key={w}
              className={`px-3 py-1 ${window === w ? "bg-navy text-white" : "text-muted"}`}
              onClick={() => setWindow(w)}
            >
              This {w}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {zones.map((z) => (
          <div key={z.region_city} className="card flex items-center gap-3">
            <span className={`h-4 w-4 rounded-full ${RISK_COLOR[z.risk_level]}`} />
            <div className="flex-1">
              <p className="font-medium text-ink">{z.region_city}</p>
              <p className="text-xs text-muted">{z.top_scam_types.join(", ") || "—"}</p>
            </div>
            <span className="text-sm text-muted">{z.report_count}</span>
          </div>
        ))}
        {zones.length === 0 && <p className="text-sm text-muted">No data for this window.</p>}
      </div>
    </Layout>
  );
}
