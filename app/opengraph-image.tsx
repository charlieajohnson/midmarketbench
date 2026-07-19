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
        background: "#F4F2EC",
        color: "#14130F",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          height: 78,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#14130F",
          color: "#F4F2EC",
          padding: "0 58px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 27, fontWeight: 700, letterSpacing: -0.8 }}>
          MidMarketBench
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 17, letterSpacing: 1.8 }}>
          <div style={{ width: 10, height: 10, borderRadius: 10, background: "#F2C105" }} />
          OBSERVED · 18 JUL 2026
        </div>
      </div>

      <div style={{ height: 552, display: "flex" }}>
        <div
          style={{
            width: 750,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "56px 58px 46px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: 2.1 }}>
              EUROPEAN B2B SOFTWARE · MODEL EVALUATION
            </div>
            <div
              style={{
                marginTop: 28,
                maxWidth: 660,
                fontSize: 72,
                fontWeight: 700,
                letterSpacing: -3.2,
                lineHeight: 0.98,
              }}
            >
              Investment judgement, benchmarked.
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ width: 82, height: 5, background: "#E52F45" }} />
            <div style={{ maxWidth: 620, fontSize: 23, lineHeight: 1.3 }}>
              Not “can the model answer?” but “can the model help decide?”
            </div>
          </div>
        </div>

        <div
          style={{
            width: 450,
            height: "100%",
            position: "relative",
            display: "flex",
            overflow: "hidden",
            background: "#E52F45",
            borderLeft: "2px solid #14130F",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 330,
              height: 330,
              borderRadius: 330,
              right: -102,
              top: -92,
              background: "#F2C105",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 260,
              height: 278,
              left: -2,
              top: 150,
              background: "#F89A15",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 286,
              height: 214,
              right: -74,
              bottom: -2,
              background: "#EB5D4B",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 184,
              height: 184,
              borderRadius: 184,
              left: 74,
              bottom: -70,
              background: "#F2C105",
            }}
          />
          <div
            style={{
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 94,
              height: 94,
              left: 36,
              top: 42,
              border: "2px solid #14130F",
              background: "#F4F2EC",
              color: "#14130F",
              fontSize: 27,
              fontWeight: 700,
              letterSpacing: -1,
            }}
          >
            MMB
          </div>
          <div
            style={{
              position: "absolute",
              left: 40,
              bottom: 36,
              color: "#14130F",
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: 1.2,
            }}
          >
            SCORE / COST / EVIDENCE
          </div>
        </div>
      </div>
    </div>,
    size,
  );
}
