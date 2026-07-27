import Topbar from "./components/layout/Topbar";
import Dashboard from "./components/dashboard/Dashboard";

export default function App() {
  return (
    <div className="min-h-screen bg-background font-display">
      <Topbar />
      <Dashboard />
    </div>
  );
}
