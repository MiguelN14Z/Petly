import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ClientDashboard from "./pages/ClientDashboard";
import UserProfile from "./pages/UserProfile";
import HealthHistory from "./pages/HealthHistory";
import MedicalReport from "./pages/MedicalReport";
import RegisterPet from "./pages/RegisterPet";
import ScheduleAppointment from "./pages/ScheduleAppointment";
import PatientDirectory from "./pages/PatientDirectory";
import AccessControl from "./pages/AccessControl";
import AppCalendar from "./pages/AppCalendar";
import AddHealthRecord from "./pages/AddHealthRecord";
import EditHealthRecord from "./pages/EditHealthRecord";
import Layout from "./components/Layout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route element={<Layout />}>
          <Route path="/client" element={<ClientDashboard />} />
          <Route path="/pet/history/:petId" element={<HealthHistory />} />
          <Route path="/pet/report/:reportId" element={<MedicalReport />} />
          <Route path="/pet/register" element={<RegisterPet />} />
          <Route path="/appointment/schedule" element={<ScheduleAppointment />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/calendar" element={<AppCalendar />} />
          <Route path="/patients" element={<PatientDirectory />} />
          <Route path="/vet/pet/history/:petId" element={<HealthHistory />} />
          <Route path="/vet/add-record/:petId" element={<AddHealthRecord />} />
          <Route path="/vet/edit-record/:recordId" element={<EditHealthRecord />} />
          <Route path="/access" element={<AccessControl />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
