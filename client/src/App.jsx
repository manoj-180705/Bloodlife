import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Donors from "./pages/Donors";
import Profile from "./pages/Profile";

import FindDonors from "./pages/FindDonors";
import AddDonor from "./pages/AddDonor";
import Requests from "./pages/Requests";
import BloodBanks from "./pages/BloodBanks";
import Camps from "./pages/Camps";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";
import CreateRequest from "./pages/CreateRequest";

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/login" />}
      />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/find-donors" element={<FindDonors />} />
      <Route path="/donors" element={<Donors />} />
      <Route path="/add-donor" element={<AddDonor />} />
      <Route path="/requests" element={<Requests />} />
      <Route path="/blood-banks" element={<BloodBanks />} />
      <Route path="/camps" element={<Camps />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/find-donors" element={<FindDonors />}/>
      <Route path="/create-request" element={<CreateRequest />}/>
    </Routes>
  );
}