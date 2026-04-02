import { Routes, Route, NavLink } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AdversaryLabPage from "./pages/AdversaryLabPage";
import SocCenterPage from "./pages/SocCenterPage";
import ReportPage from "./pages/ReportPage";

export default function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">SOCForge X</div>
        <nav className="nav">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/adversary-lab">Adversary Lab</NavLink>
          <NavLink to="/soc-center">SOC Command Center</NavLink>
          <NavLink to="/report">Purple Team Report</NavLink>
        </nav>
      </aside>

      <main className="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/adversary-lab" element={<AdversaryLabPage />} />
          <Route path="/soc-center" element={<SocCenterPage />} />
          <Route path="/report" element={<ReportPage />} />
        </Routes>
      </main>
    </div>
  );
}