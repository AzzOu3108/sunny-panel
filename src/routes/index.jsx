import { createFileRoute } from "@tanstack/react-router";
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import Home from "../pages/Home";
import "../App.css";
import "../pages/style/Home.css";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Manag'it — Manage Your Work Efficiently" },
      {
        name: "description",
        content:
          "Manag'it is an all-in-one project management platform that simplifies planning, improves collaboration, and keeps every project on track.",
      },
      { property: "og:title", content: "Manag'it — Manage Your Work Efficiently" },
      {
        property: "og:description",
        content:
          "Plan projects, collaborate with your team, and track progress from one clean workspace.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="marketing-shell">
      <NavBar />
      <Home />
      <Footer />
    </div>
  );
}
