import React, { useEffect, useState } from "react";
import { Search, MapPin, Phone, Droplet } from "lucide-react";

import Layout from "../components/Layout";
import api from "../services/api";

export default function FindDonors() {
  const [donors, setDonors] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);

  const [bloodGroup, setBloodGroup] = useState("");
  const [location, setLocation] = useState("");

  const [loading, setLoading] = useState(true);
  const [searched, setSearched] = useState(false);

  // Load all registered donors
  useEffect(() => {
    const loadDonors = async () => {
      try {
        setLoading(true);

        const response = await api.get("/donors");

        console.log("Registered donors:", response.data);

        setDonors(response.data);
      } catch (error) {
        console.error("Failed to load donors:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDonors();
  }, []);

  // Search donors
  const handleSearch = () => {
    const results = donors.filter((donor) => {
      const bloodGroupMatch =
        !bloodGroup ||
        donor.bloodGroup === bloodGroup;

      const locationMatch =
        !location ||
        donor.location
          ?.toLowerCase()
          .includes(location.toLowerCase());

      return bloodGroupMatch && locationMatch;
    });

    setFilteredDonors(results);
    setSearched(true);
  };

  // Clear search
  const handleClear = () => {
    setBloodGroup("");
    setLocation("");
    setFilteredDonors([]);
    setSearched(false);
  };

  // Format date
  const formatDate = (date) => {
    if (!date) {
      return "Never donated";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  };

  // Calculate available date
  const getAvailableDate = (lastDonated) => {
    if (!lastDonated) {
      return null;
    }

    const date = new Date(lastDonated);

    date.setDate(
      date.getDate() + 90
    );

    return date;
  };

  return (
    <Layout>
      <div className="p-6 max-w-7xl">

        {/* HEADER */}

        <h1 className="text-3xl font-bold">
          Find Blood Donors
        </h1>

        <p className="text-slate-500 mt-2">
          Search registered blood donors by blood group and location.
        </p>


        {/* SEARCH CARD */}

        <div className="card p-6 mt-6">

          <div className="grid md:grid-cols-3 gap-4">

            {/* BLOOD GROUP */}

            <div>

              <label className="font-semibold text-sm">
                Blood Group
              </label>

              <select
                value={bloodGroup}
                onChange={(e) =>
                  setBloodGroup(e.target.value)
                }
                className="field mt-2 w-full"
              >
                <option value="">
                  All Blood Groups
                </option>

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


            {/* LOCATION */}

            <div>

              <label className="font-semibold text-sm">
                Location
              </label>

              <div className="relative mt-2">

                <MapPin
                  size={18}
                  className="absolute left-3 top-3 text-slate-400"
                />

                <input
                  type="text"
                  value={location}
                  onChange={(e) =>
                    setLocation(e.target.value)
                  }
                  placeholder="Example: Nandyal"
                  className="field w-full pl-10"
                />

              </div>

            </div>


            {/* SEARCH BUTTON */}

            <div className="flex items-end gap-3">

              <button
                onClick={handleSearch}
                className="btn-red flex items-center gap-2"
              >
                <Search size={18} />

                Search Donors
              </button>


              {searched && (

                <button
                  onClick={handleClear}
                  className="border border-slate-300 px-4 py-2 rounded-lg hover:bg-slate-100"
                >
                  Clear
                </button>

              )}

            </div>

          </div>

        </div>


        {/* LOADING */}

        {loading && (

          <div className="card p-6 mt-6">
            Loading registered donors...
          </div>

        )}


        {/* SEARCH RESULTS */}

        {!loading && searched && (

          <div className="mt-8">

            <div className="flex justify-between items-center mb-4">

              <div>

                <h2 className="text-2xl font-bold">
                  Search Results
                </h2>

                <p className="text-slate-500 text-sm mt-1">
                  {filteredDonors.length} donor
                  {filteredDonors.length !== 1
                    ? "s"
                    : ""}{" "}
                  found
                </p>

              </div>

            </div>


            {/* NO RESULTS */}

            {filteredDonors.length === 0 ? (

              <div className="card p-10 text-center">

                <Search
                  size={50}
                  className="mx-auto text-slate-400"
                />

                <h3 className="text-xl font-bold mt-4">
                  No donors found
                </h3>

                <p className="text-slate-500 mt-2">
                  Try another blood group or location.
                </p>

              </div>

            ) : (

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">

                {filteredDonors.map((donor) => {

                  const availableDate =
                    getAvailableDate(
                      donor.lastDonated
                    );

                  return (

                    <div
                      key={donor._id}
                      className="card p-6"
                    >

                      {/* PROFILE HEADER */}

                      <div className="flex items-start justify-between">

                        <div className="flex items-center gap-3">

                          <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xl font-bold">

                            {donor.name
                              ?.charAt(0)
                              ?.toUpperCase()}

                          </div>


                          <div>

                            <h3 className="font-bold text-lg">
                              {donor.name}
                            </h3>

                            <p className="text-sm text-slate-500">
                              {donor.email}
                            </p>

                          </div>

                        </div>


                        {/* BLOOD GROUP */}

                        <div className="bg-red-50 text-red-600 px-3 py-2 rounded-lg font-bold">

                          <Droplet
                            size={16}
                            className="inline mr-1"
                          />

                          {donor.bloodGroup}

                        </div>

                      </div>


                      {/* LOCATION */}

                      <div className="mt-5 flex items-center gap-2 text-slate-600">

                        <MapPin size={18} />

                        {donor.location ||
                          "Location not specified"}

                      </div>


                      {/* LAST DONATED */}

                      <div className="mt-4">

                        <p className="text-sm text-slate-500">
                          Last Blood Donation
                        </p>

                        <p className="font-semibold mt-1">
                          {formatDate(
                            donor.lastDonated
                          )}
                        </p>

                      </div>


                      {/* STATUS */}

                      <div className="mt-4">

                        {donor.isAvailable ? (

                          <div className="bg-green-50 border border-green-200 rounded-lg p-3">

                            <p className="font-semibold text-green-700">
                              🟢 Available to Donate
                            </p>

                            <p className="text-sm text-green-600 mt-1">
                              This donor is currently eligible.
                            </p>

                          </div>

                        ) : (

                          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">

                            <p className="font-semibold text-orange-700">
                              🟠 Currently Unavailable
                            </p>

                            {availableDate && (

                              <p className="text-sm text-orange-600 mt-1">

                                Available after{" "}

                                <b>
                                  {formatDate(
                                    availableDate
                                  )}
                                </b>

                              </p>

                            )}

                          </div>

                        )}

                      </div>


                      {/* DONATION STATS */}

                      <div className="grid grid-cols-2 gap-3 mt-5">

                        <div className="bg-slate-50 rounded-lg p-3">

                          <p className="text-xs text-slate-500">
                            Donations
                          </p>

                          <p className="font-bold text-lg">
                            {donor.donations || 0}
                          </p>

                        </div>


                        <div className="bg-slate-50 rounded-lg p-3">

                          <p className="text-xs text-slate-500">
                            BloodLife Points
                          </p>

                          <p className="font-bold text-lg">
                            ⭐ {donor.points || 0}
                          </p>

                        </div>

                      </div>


                      {/* CALL BUTTON */}

                      <a
                        href={`tel:${donor.phone}`}
                        className="btn-red w-full mt-5 flex items-center justify-center gap-2"
                      >

                        <Phone size={18} />

                        Call Donor

                      </a>

                    </div>

                  );

                })}

              </div>

            )}

          </div>

        )}


        {/* BEFORE SEARCH */}

        {!loading && !searched && (

          <div className="card p-10 mt-6 text-center">

            <Search
              size={55}
              className="mx-auto text-red-500"
            />

            <h2 className="text-xl font-bold mt-4">
              Search for Blood Donors
            </h2>

            <p className="text-slate-500 mt-2">
              Select a blood group and/or enter a location to find registered donors.
            </p>

          </div>

        )}

      </div>
    </Layout>
  );
}