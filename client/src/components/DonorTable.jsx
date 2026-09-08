import React, { useEffect, useState } from "react";
import api from "../services/api";

import {
  Eye,
  X,
  MapPin,
  Phone,
  Mail,
  Droplet,
  CalendarDays,
  Award,
} from "lucide-react";

export default function DonorTable() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedDonor, setSelectedDonor] = useState(null);

  useEffect(() => {
    loadDonors();
  }, []);

  const loadDonors = async () => {
    try {
      const response = await api.get("/donors");

      setDonors(response.data);
    } catch (error) {
      console.error("Failed to load donors:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "Never donated";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  if (loading) {
    return (
      <div className="card p-6">
        Loading donors...
      </div>
    );
  }

  return (
    <>
      {/* DONOR TABLE */}

      <div className="card overflow-hidden">

        <div className="p-6 border-b">

          <h2 className="text-xl font-bold">
            🩸 Donor List
          </h2>

          <p className="text-slate-500 mt-1">
            Registered BloodLife donors
          </p>

        </div>


        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-slate-50">

              <tr className="text-left">

                <th className="p-4">
                  Donor
                </th>

                <th className="p-4">
                  Blood Group
                </th>

                <th className="p-4">
                  Location
                </th>

                <th className="p-4">
                  Last Donated
                </th>

                <th className="p-4">
                  Status
                </th>

                <th className="p-4">
                  Contact
                </th>

              </tr>

            </thead>


            <tbody>

              {donors.map((donor) => (

                <tr
                  key={donor._id}
                  className="border-t hover:bg-slate-50"
                >

                  {/* DONOR */}

                  <td className="p-4">

                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">

                        {donor.name
                          ?.charAt(0)
                          ?.toUpperCase()}

                      </div>


                      <div>

                        <p className="font-semibold">

                          {donor.name}

                        </p>


                        <p className="text-sm text-slate-500">

                          {donor.email}

                        </p>

                      </div>

                    </div>

                  </td>


                  {/* BLOOD GROUP */}

                  <td className="p-4">

                    <span className="bg-red-50 text-red-600 px-3 py-1 rounded-lg font-semibold">

                      {donor.bloodGroup}

                    </span>

                  </td>


                  {/* LOCATION */}

                  <td className="p-4">

                    <div className="flex items-center gap-1">

                      <MapPin size={16} />

                      {donor.location}

                    </div>

                  </td>


                  {/* LAST DONATED */}

                  <td className="p-4">

                    {formatDate(
                      donor.lastDonated
                    )}

                  </td>


                  {/* STATUS */}

                  <td className="p-4">

                    <span
                      className={`px-3 py-1 rounded-lg ${
                        donor.isAvailable
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >

                      {donor.isAvailable
                        ? "Available"
                        : "Unavailable"}

                    </span>

                  </td>


                  {/* ACTIONS */}

                  <td className="p-4">

                    <div className="flex gap-2">


                      {/* CALL */}

                      <a
                        href={`tel:${donor.phone}`}
                        className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-green-50"
                      >

                        <Phone
                          size={18}
                          className="text-green-600"
                        />

                      </a>


                      {/* EYE BUTTON */}

                      <button
                        onClick={() =>
                          setSelectedDonor(
                            donor
                          )
                        }
                        className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-red-50"
                      >

                        <Eye size={18} />

                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>


        <div className="p-4 border-t text-sm text-slate-500">

          Showing {donors.length} registered donors

        </div>

      </div>



      {/* DONOR PROFILE POPUP */}

      {selectedDonor && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">


          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl relative overflow-hidden">


            {/* CLOSE BUTTON */}

            <button
              onClick={() =>
                setSelectedDonor(null)
              }
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white shadow flex items-center justify-center"
            >

              <X size={20} />

            </button>


            {/* PROFILE HEADER */}

            <div className="hero-red text-white p-8 text-center">


              <div className="w-24 h-24 mx-auto rounded-full bg-white/30 flex items-center justify-center text-4xl font-bold">

                {selectedDonor.name
                  ?.charAt(0)
                  ?.toUpperCase()}

              </div>


              <h2 className="text-2xl font-bold mt-4">

                {selectedDonor.name}

              </h2>


              <span className="inline-block mt-3 bg-white/20 px-4 py-2 rounded-lg font-bold">

                🩸 {selectedDonor.bloodGroup}

              </span>


            </div>



            {/* PROFILE DETAILS */}

            <div className="p-6">


              <h3 className="text-xl font-bold mb-5">

                Donor Information

              </h3>


              <div className="space-y-4">


                {/* EMAIL */}

                <div className="flex gap-3">

                  <Mail
                    className="text-red-500"
                    size={20}
                  />

                  <div>

                    <p className="text-sm text-slate-500">

                      Email

                    </p>

                    <p className="font-medium">

                      {selectedDonor.email}

                    </p>

                  </div>

                </div>



                {/* PHONE */}

                <div className="flex gap-3">

                  <Phone
                    className="text-red-500"
                    size={20}
                  />

                  <div>

                    <p className="text-sm text-slate-500">

                      Phone

                    </p>

                    <p className="font-medium">

                      {selectedDonor.phone ||
                        "Not specified"}

                    </p>

                  </div>

                </div>



                {/* LOCATION */}

                <div className="flex gap-3">

                  <MapPin
                    className="text-red-500"
                    size={20}
                  />

                  <div>

                    <p className="text-sm text-slate-500">

                      Location

                    </p>

                    <p className="font-medium">

                      {selectedDonor.location ||
                        "Not specified"}

                    </p>

                  </div>

                </div>



                {/* LAST DONATION */}

                <div className="flex gap-3">

                  <CalendarDays
                    className="text-red-500"
                    size={20}
                  />

                  <div>

                    <p className="text-sm text-slate-500">

                      Last Blood Donation

                    </p>

                    <p className="font-medium">

                      {formatDate(
                        selectedDonor.lastDonated
                      )}

                    </p>

                  </div>

                </div>



                {/* DONATIONS */}

                <div className="flex gap-3">

                  <Droplet
                    className="text-red-500"
                    size={20}
                  />

                  <div>

                    <p className="text-sm text-slate-500">

                      Total Donations

                    </p>

                    <p className="font-medium">

                      {selectedDonor.donations || 0}

                    </p>

                  </div>

                </div>



                {/* POINTS */}

                <div className="flex gap-3">

                  <Award
                    className="text-yellow-500"
                    size={20}
                  />

                  <div>

                    <p className="text-sm text-slate-500">

                      BloodLife Points

                    </p>

                    <p className="font-medium">

                      ⭐ {selectedDonor.points || 0}

                    </p>

                  </div>

                </div>


              </div>



              {/* STATUS */}

              <div className="mt-6 border-t pt-5">


                <p className="text-sm text-slate-500">

                  Donor Status

                </p>


                <span
                  className={`inline-block mt-2 px-4 py-2 rounded-lg font-semibold ${
                    selectedDonor.isAvailable
                      ? "bg-green-100 text-green-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >

                  {selectedDonor.isAvailable
                    ? "✓ Available to Donate"
                    : "Currently Unavailable"}

                </span>


              </div>



              {/* CONTACT BUTTON */}

              <a
                href={`tel:${selectedDonor.phone}`}
                className="btn-red w-full mt-6 block text-center"
              >

                📞 Contact Donor

              </a>


            </div>

          </div>

        </div>

      )}

    </>
  );
}