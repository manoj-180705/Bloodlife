import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";

import {
  User,
  Mail,
  Phone,
  MapPin,
  Droplet,
  Save,
  ShieldCheck,
} from "lucide-react";

export default function Settings() {
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bloodGroup: "",
    location: "",
    isAvailable: true,
  });

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await api.get("/donors");

        console.log("Settings users:", response.data);

        // Temporary approach:
        // Get latest registered user
        const loggedInUser = response.data[0];

        if (loggedInUser) {
          setUser(loggedInUser);

          setFormData({
            name: loggedInUser.name || "",
            email: loggedInUser.email || "",
            phone: loggedInUser.phone || "",
            bloodGroup:
              loggedInUser.bloodGroup ||
              "O+",
            location:
              loggedInUser.location ||
              "",
            isAvailable:
              loggedInUser.isAvailable ??
              true,
          });
        }
      } catch (error) {
        console.error(
          "Failed to load settings:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } =
      e.target;

    setFormData((previous) => ({
      ...previous,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError(
        "User profile not found."
      );

      return;
    }

    try {
      setSaving(true);

      setMessage("");

      setError("");

      const response = await api.put(
        `/donors/${user._id}/profile`,
        formData
      );

      console.log(
        "Updated profile:",
        response.data
      );

      setUser(
        response.data.user
      );

      setFormData({
        name:
          response.data.user.name ||
          "",

        email:
          response.data.user.email ||
          "",

        phone:
          response.data.user.phone ||
          "",

        bloodGroup:
          response.data.user
            .bloodGroup ||
          "",

        location:
          response.data.user
            .location ||
          "",

        isAvailable:
          response.data.user
            .isAvailable,
      });

      setMessage(
        "Profile updated successfully!"
      );

    } catch (error) {
      console.error(
        "Update profile error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update profile"
      );

    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-6">
          Loading settings...
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="p-6">

          <h2 className="text-xl font-bold">
            Profile not found
          </h2>

          <p className="text-slate-500 mt-2">
            Please register or login first.
          </p>

        </div>
      </Layout>
    );
  }

  return (
    <Layout>

      <div className="p-6 max-w-5xl">

        {/* PAGE HEADER */}

        <div className="mb-6">

          <h1 className="text-3xl font-bold">
            Settings
          </h1>

          <p className="text-slate-500 mt-2">
            Manage your BloodLife profile
            and donor preferences.
          </p>

        </div>


        {/* PROFILE OVERVIEW */}

        <div className="card p-6 mb-6">

          <div className="flex flex-col sm:flex-row items-center gap-5">

            {/* PROFILE AVATAR */}

            <div className="w-24 h-24 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-4xl font-bold">

              {user.name
                ?.charAt(0)
                ?.toUpperCase()}

            </div>


            {/* USER INFO */}

            <div className="text-center sm:text-left">

              <h2 className="text-2xl font-bold">
                {user.name}
              </h2>

              <p className="text-slate-500">
                {user.email}
              </p>


              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">

                <span className="bg-red-50 text-red-600 px-3 py-1 rounded-lg font-semibold">

                  🩸 {user.bloodGroup}

                </span>


                <span
                  className={
                    user.isAvailable
                      ? "bg-green-100 text-green-700 px-3 py-1 rounded-lg"
                      : "bg-orange-100 text-orange-700 px-3 py-1 rounded-lg"
                  }
                >

                  {user.isAvailable
                    ? "Available to Donate"
                    : "Currently Unavailable"}

                </span>

              </div>

            </div>

          </div>

        </div>


        {/* SETTINGS FORM */}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >


          {/* PERSONAL INFORMATION */}

          <div className="card p-6">

            <div className="flex items-center gap-2 mb-6">

              <User
                className="text-blood"
                size={24}
              />

              <h2 className="text-xl font-bold">
                Personal Information
              </h2>

            </div>


            <div className="grid md:grid-cols-2 gap-5">


              {/* NAME */}

              <div>

                <label className="font-medium">

                  Full Name

                </label>


                <div className="relative mt-2">

                  <User
                    size={18}
                    className="absolute left-3 top-3 text-slate-400"
                  />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="field pl-10"
                    placeholder="Enter your name"
                    required
                  />

                </div>

              </div>


              {/* EMAIL */}

              <div>

                <label className="font-medium">

                  Email Address

                </label>


                <div className="relative mt-2">

                  <Mail
                    size={18}
                    className="absolute left-3 top-3 text-slate-400"
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="field pl-10"
                    placeholder="Enter email"
                    required
                  />

                </div>

              </div>


              {/* PHONE */}

              <div>

                <label className="font-medium">

                  Phone Number

                </label>


                <div className="relative mt-2">

                  <Phone
                    size={18}
                    className="absolute left-3 top-3 text-slate-400"
                  />

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="field pl-10"
                    placeholder="Enter phone number"
                    required
                  />

                </div>

              </div>


              {/* BLOOD GROUP */}

              <div>

                <label className="font-medium">

                  Blood Group

                </label>


                <div className="relative mt-2">

                  <Droplet
                    size={18}
                    className="absolute left-3 top-3 text-red-500"
                  />

                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="field pl-10"
                  >

                    <option value="A+">
                      A+
                    </option>

                    <option value="A-">
                      A-
                    </option>

                    <option value="B+">
                      B+
                    </option>

                    <option value="B-">
                      B-
                    </option>

                    <option value="AB+">
                      AB+
                    </option>

                    <option value="AB-">
                      AB-
                    </option>

                    <option value="O+">
                      O+
                    </option>

                    <option value="O-">
                      O-
                    </option>

                  </select>

                </div>

              </div>


              {/* LOCATION */}

              <div className="md:col-span-2">

                <label className="font-medium">

                  Location

                </label>


                <div className="relative mt-2">

                  <MapPin
                    size={18}
                    className="absolute left-3 top-3 text-slate-400"
                  />

                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="field pl-10"
                    placeholder="Example: Nandyal, Andhra Pradesh"
                  />

                </div>

              </div>

            </div>

          </div>


          {/* DONOR AVAILABILITY */}

          <div className="card p-6">

            <div className="flex items-center gap-2 mb-4">

              <ShieldCheck
                className="text-green-600"
                size={24}
              />

              <h2 className="text-xl font-bold">

                Donor Availability

              </h2>

            </div>


            <p className="text-slate-500 text-sm mb-5">

              Control whether other users
              can find you when searching
              for blood donors.

            </p>


            <label className="flex items-center justify-between border rounded-xl p-5 cursor-pointer">

              <div>

                <h3 className="font-semibold">

                  Available for Blood Donation

                </h3>

                <p className="text-sm text-slate-500 mt-1">

                  Allow people to contact you
                  for blood donation.

                </p>

              </div>


              <input
                type="checkbox"
                name="isAvailable"
                checked={
                  formData.isAvailable
                }
                onChange={handleChange}
                className="w-5 h-5"
              />

            </label>

          </div>


          {/* ERROR MESSAGE */}

          {error && (

            <div className="bg-red-50 text-red-600 border border-red-200 p-4 rounded-xl">

              {error}

            </div>

          )}


          {/* SUCCESS MESSAGE */}

          {message && (

            <div className="bg-green-50 text-green-700 border border-green-200 p-4 rounded-xl">

              {message}

            </div>

          )}


          {/* SAVE BUTTON */}

          <button
            type="submit"
            disabled={saving}
            className="btn-red flex items-center gap-2"
          >

            <Save size={18} />

            {saving
              ? "Saving Changes..."
              : "Save Changes"}

          </button>


        </form>

      </div>

    </Layout>
  );
}
