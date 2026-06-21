import { ImageResponse } from "next/og";

export const alt = "MidMarketBench: investment judgement, benchmarked";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#F4EFE4",
        color: "#1E2A28",
        padding: "72px",
        fontFamily: "serif",
      }}
    >
      <div style={{ fontSize: 32 }}>MidMarketBench</div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ color: "#2F6F62", fontFamily: "sans-serif", fontSize: 20, letterSpacing: 3 }}>
          EUROPEAN B2B SOFTWARE INVESTMENT BENCHMARK
        </div>
        <div style={{ marginTop: 24, maxWidth: 850, fontSize: 80, lineHeight: 1 }}>
          Investment judgement, benchmarked.
        </div>
      </div>
      <div
        style={{
          borderTop: "1px solid #CFC4AC",
          paddingTop: 22,
          color: "#56635B",
          fontFamily: "sans-serif",
          fontSize: 24,
        }}
      >
        Not “can the model answer?” but “can the model help decide?”
      </div>
    </div>,
    size,
  );
}
