import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/dashboard", name: "Lernzi — Learn Everyday", short_name: "Lernzi",
    description: "Your notes, reviewed study terms, flashcards and quizzes. Learn on your device.",
    start_url: "/dashboard", scope: "/", display: "standalone",
    background_color: "#F8FAFC", theme_color: "#1E3A8A", lang: "en",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Add study material", url: "/upload", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Flashcards", url: "/flashcards", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
    ],
  };
}
