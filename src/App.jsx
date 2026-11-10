import { Routes, Route } from "react-router-dom";
import Sidebar from "./Common/Sidebar";
import Navbar from "./Common/Navbar";
import Overview from "./Pages/Overview";
import Employees from "./Pages/Employees";
import Departments from "./Pages/Departments";
import Leave from "./Pages/Leave";

export default function App() {
  return (
    <>
      <Sidebar />

      <div style={{ marginLeft: 300 }}>
        <Navbar />

        <div style={{ padding: 30 }}>
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/leave-requests" element={<Leave />} />
          </Routes>
        </div>
      </div>
    </>
  );
}