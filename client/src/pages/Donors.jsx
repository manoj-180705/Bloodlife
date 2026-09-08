import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";

export default function Donors() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDonors = async () => {
      try {
        const response = await api.get("/donors");

        console.log("Donors:", response.data);

        setDonors(response.data);
      } catch (error) {
        console.error("Failed to load donors:", error);
      } finally {
        setLoading(false);
      }
    };

    getDonors();
  }, []);

  return (
    <Layout>
      <div className="p-6 max-w-[1500px]">

        <h1 className="text-3xl font-bold">
          🩸 Registered Donors
        </h1>

        <p className="text-slate-500 mt-2 mb-6">
          Search and find available blood donors.
        </p>

        {loading ? (
          <div className="card p-6">
            Loading donors...
          </div>
        ) : donors.length === 0 ? (
          <div className="card p-6">
            No donors registered yet.
          </div>
        ) : (
          <div className="card overflow-x-auto">

            <table className="w-full">

              <thead>
                <tr className="border-b bg-slate-50">

                  <th className="p-4 text-left">
                    Donor
                  </th>

                  <th className="p-4 text-left">
                    Blood Group
                  </th>

                  <th className="p-4 text-left">
                    Phone
                  </th>

                  <th className="p-4 text-left">
                    Location
                  </th>

                  <th className="p-4 text-left">
                    Last Blood Donated
                  </th>

                  <th className="p-4 text-left">
                    Status
                  </th>

                </tr>
              </thead>

              <tbody>

                {donors.map((donor) => (

                  <tr
                    key={donor._id}
                    className="border-b hover:bg-slate-50"
                  >

                    <td className="p-4">

                      <div className="font-semibold">
                        {donor.name}
                      </div>

                      <div className="text-sm text-slate-500">
                        {donor.email}
                      </div>

                    </td>

                    <td className="p-4">

                      <span className="bg-red-50 text-red-600 px-3 py-1 rounded-lg font-bold">
                        {donor.bloodGroup || "Not specified"}
                      </span>

                    </td>

                    <td className="p-4">
                      {donor.phone || "Not specified"}
                    </td>

                    <td className="p-4">
                      {donor.location || "Not specified"}
                    </td>

                    <td className="p-4">

                      {donor.lastDonated
                        ? new Date(
                            donor.lastDonated
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "Never donated"}

                    </td>

                    <td className="p-4">

                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">

                        {donor.status || "Available"}

                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

            <div className="p-4 text-sm text-slate-500">
              Showing {donors.length} registered donors
            </div>

          </div>
        )}

      </div>
    </Layout>
  );
}