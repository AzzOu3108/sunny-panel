import { createFileRoute } from "@tanstack/react-router";
import Login from "../pages/Login";
import "../App.css";
import "../pages/style/Auth.css";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — Manag'it" },
      {
        name: "description",
        content: "Log in to your Manag'it workspace and get back to managing your projects.",
      },
      { property: "og:title", content: "Login — Manag'it" },
      {
        property: "og:description",
        content: "Log in to your Manag'it workspace and get back to managing your projects.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Login,
});
