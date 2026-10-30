import { createFileRoute } from "@tanstack/react-router";
import Signup from "../pages/Signup";
import "../App.css";
import "../pages/style/Auth.css";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign Up — Manag'it" },
      {
        name: "description",
        content: "Create your Manag'it account and start managing your projects with your team.",
      },
      { property: "og:title", content: "Sign Up — Manag'it" },
      {
        property: "og:description",
        content: "Create your Manag'it account and start managing your projects with your team.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Signup,
});
