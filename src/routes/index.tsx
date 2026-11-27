import { createFileRoute } from "@tanstack/react-router";
import { RudraApp } from "@/components/RudraApp.jsx";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rudra Arts And Handicrafts | Maratha Heritage Art" },
      { name: "description", content: "Discover handcrafted Shivaji Maharaj statues, historical replicas, Maratha weaponry, and heritage decor from Kolhapur." },
      { property: "og:title", content: "Rudra Arts And Handicrafts | Maratha Heritage Art" },
      { property: "og:description", content: "Discover handcrafted Shivaji Maharaj statues, historical replicas, Maratha weaponry, and heritage decor from Kolhapur." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RudraApp,
});
