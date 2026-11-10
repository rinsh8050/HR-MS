import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Sidebar from "./Common/Sidebar";
import Navbar from "./Common/Navbar";
import Overview from "./Pages/Overview";
import Employees from "./Pages/Employees";
import Departments from "./Pages/Departments";
import Leave from "./Pages/Leave";
import Login from "./Pages/Login";

function ProtectedLayout() {
  if (!localStorage.getItem("token")) return <Navigate to="/login" replace />;

  return (
    <>
      <Sidebar />
      <div style={{ marginLeft: 300 }}>
        <Navbar />
        <div style={{ padding: 30 }}>
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Overview />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/departments" element={<Departments />} />
        <Route path="/leave-requests" element={<Leave />} />
      </Route>
    </Routes>
  );
}