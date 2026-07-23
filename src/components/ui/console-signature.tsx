"use client";

import { useEffect } from "react";

export function ConsoleSignature() {
  useEffect(() => {
    const title =
      "%cDevClub";
    const titleStyle = [
      "font-size:28px",
      "font-weight:700",
      "color:#38BDF8",
      "text-shadow:0 2px 12px rgba(56,189,248,0.5)",
      "padding:8px 0",
    ].join(";");

    const line = "%cDo primeiro console.log ao primeiro emprego.";
    const lineStyle = "font-size:13px;color:#CBD5E1";

    const nudge =
      "%c› Curioso sobre como este site foi construído? Você tem olho pra código.";
    const nudgeStyle = "font-size:12px;color:#06B6D4";

    console.log(title, titleStyle);
    console.log(line, lineStyle);
    console.log(nudge, nudgeStyle);
  }, []);

  return null;
}
