import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #38BDF8 0%, #06B6D4 45%, #8B5CF6 100%)",
          borderRadius: 7,
          fontFamily: "monospace",
          fontWeight: 700,
          fontSize: 16,
          color: "#020617",
        }}
      >
        {"</>"}
      </div>
    ),
    { ...size }
  );
}
