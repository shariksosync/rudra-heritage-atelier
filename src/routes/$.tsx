import { createFileRoute } from "@tanstack/react-router";
import { RudraApp } from "@/components/RudraApp.jsx";

export const Route = createFileRoute("/$")({
  head: () => ({
    meta: [
      { title: "Rudra Arts And Handicrafts | Heritage Collection" },
      { name: "description", content: "Explore traditional Maratha sculptures, historical replicas, heritage wall art, and custom decor by Rudra Arts And Handicrafts." },
      { property: "og:title", content: "Rudra Arts And Handicrafts | Heritage Collection" },
      { property: "og:description", content: "Explore traditional Maratha sculptures, historical replicas, heritage wall art, and custom decor by Rudra Arts And Handicrafts." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RudraApp,
});