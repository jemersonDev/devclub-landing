import { ImageResponse } from "next/og";

export const alt = "DevClub — A evolução do desenvolvedor começa aqui";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#020617",
          position: "relative",
        }}
      >
        {/* radial brand glow */}
        <div
          style={{
            position: "absolute",
            width: 900,
            height: 900,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(56,189,248,0.25) 0%, rgba(2,6,23,0) 65%)",
          }}
        />
        <div
          style={{
            fontSize: 120,
            fontWeight: 700,
            fontFamily: "monospace",
            background: "linear-gradient(135deg, #38BDF8 0%, #06B6D4 45%, #8B5CF6 100%)",
            backgroundClip: "text",
            color: "transparent",
            display: "flex",
          }}
        >
          {"</>"}
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 60,
            fontWeight: 700,
            color: "#FFFFFF",
            display: "flex",
          }}
        >
          Dev
          <span
            style={{
              background:
                "linear-gradient(135deg, #38BDF8 0%, #06B6D4 45%, #8B5CF6 100%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Club
          </span>
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 30,
            color: "#CBD5E1",
            display: "flex",
          }}
        >
          A evolução do desenvolvedor começa aqui
        </div>
      </div>
    ),
    { ...size }
  );
}
