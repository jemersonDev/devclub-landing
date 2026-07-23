import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DevClub | A evolução do desenvolvedor começa aqui",
    short_name: "DevClub",
    description:
      "Do primeiro console.log ao primeiro emprego full stack. Uma jornada completa para quem quer se tornar um desenvolvedor extraordinário.",
    start_url: "/",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#020617",
    lang: "pt-BR",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
    ],
  };
}
