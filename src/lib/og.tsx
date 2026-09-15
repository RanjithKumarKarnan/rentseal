import { ImageResponse } from "@vercel/og";
import { OG_SIZE } from "@/seo/og";

const NAVY = "#0f172a";
const BRAND = "#2563eb";

/**
 * One card layout for every social preview on the site. Pages pass their own
 * eyebrow/title/facts; everything else — brand mark, colours, footer — stays
 * identical so shares are recognisable as LP Stamp Paper at a glance.
 */
export function ogImage({
  eyebrow,
  title,
  facts,
}: {
  eyebrow: string;
  title: string;
  facts: string[];
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: NAVY,
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: 12,
            background: BRAND,
            display: "flex",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                display: "flex",
                width: 52,
                height: 52,
                borderRadius: 14,
                background: BRAND,
                alignItems: "center",
                justifyContent: "center",
                fontSize: 30,
                fontWeight: 800,
                color: "white",
              }}
            >
              R
            </div>
            <div style={{ display: "flex", fontSize: 32, fontWeight: 800, color: "white" }}>
              LP Stamp Paper
            </div>
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 44,
              fontSize: 21,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#60a5fa",
            }}
          >
            {eyebrow}
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 18,
              fontSize: title.length > 52 ? 60 : 70,
              lineHeight: 1.1,
              fontWeight: 800,
              color: "white",
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
        </div>

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {facts.map((fact) => (
            <div
              key={fact}
              style={{
                display: "flex",
                padding: "10px 18px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.22)",
                fontSize: 21,
                color: "rgba(255,255,255,0.85)",
              }}
            >
              {fact}
            </div>
          ))}
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
