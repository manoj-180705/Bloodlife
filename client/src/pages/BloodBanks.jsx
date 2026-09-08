import React, {
  useState,
} from "react";

import Layout from "../components/Layout";

import api from "../services/api";

import {
  Search,
  MapPin,
  Phone,
  Building2,
  Droplet,
} from "lucide-react";


export default function BloodBanks() {

  const [location, setLocation] =
    useState("");

  const [bloodBanks, setBloodBanks] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [searched, setSearched] =
    useState(false);


  const searchBloodBanks =
    async () => {

      if (!location.trim()) {
        alert(
          "Please enter a location"
        );

        return;
      }


      try {

        setLoading(true);

        setSearched(true);


        const response =
          await api.get(
            `/blood-banks?location=${location}`
          );


        setBloodBanks(
          response.data
        );

      } catch (error) {

        console.error(
          "Blood bank search error:",
          error
        );


        alert(
          "Failed to search blood banks"
        );

      } finally {

        setLoading(false);

      }

    };


  const bloodGroups = [

    "A+",
    "A-",

    "B+",
    "B-",

    "AB+",
    "AB-",

    "O+",
    "O-",

  ];


  return (

    <Layout>

      <div className="p-6 max-w-7xl">


        {/* HEADER */}

        <h1 className="text-3xl font-bold">

          Blood Banks

        </h1>


        <p className="text-slate-500 mt-2">

          Search blood availability by location.

        </p>



        {/* SEARCH BAR */}

        <div className="card p-6 mt-6">

          <h2 className="text-xl font-bold mb-4">

            🔍 Search Blood Availability

          </h2>


          <div className="flex flex-col md:flex-row gap-3">


            <div className="relative flex-1">

              <MapPin
                size={20}
                className="absolute left-3 top-3 text-slate-400"
              />


              <input
                type="text"

                value={location}

                onChange={(e) =>
                  setLocation(
                    e.target.value
                  )
                }

                onKeyDown={(e) => {

                  if (
                    e.key === "Enter"
                  ) {

                    searchBloodBanks();

                  }

                }}

                placeholder="Enter location (Example: Nandyal)"

                className="field pl-10 w-full"

              />

            </div>


            <button
              onClick={
                searchBloodBanks
              }

              className="btn-red flex items-center justify-center gap-2"
            >

              <Search
                size={19}
              />

              Search

            </button>


          </div>

        </div>



        {/* LOADING */}

        {loading && (

          <div className="text-center mt-10">

            Searching blood banks...

          </div>

        )}



        {/* NO RESULTS */}

        {!loading &&
          searched &&
          bloodBanks.length === 0 && (

            <div className="card p-10 mt-6 text-center">

              <Building2
                size={55}
                className="mx-auto text-slate-400"
              />


              <h2 className="text-xl font-bold mt-4">

                No Blood Banks Found

              </h2>


              <p className="text-slate-500 mt-2">

                No blood bank information found in:

                {" "}

                <b>
                  {location}
                </b>

              </p>

            </div>

          )}



        {/* BLOOD BANK RESULTS */}

        {!loading &&
          bloodBanks.length > 0 && (

            <div className="mt-6">


              <h2 className="text-xl font-bold">

                Blood Availability in {location}

              </h2>


              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 mt-5">


                {bloodBanks.map(
                  (bank) => (

                    <div
                      key={bank._id}

                      className="card p-6"
                    >


                      {/* BANK HEADER */}

                      <div className="flex justify-between items-start">


                        <div>

                          <div className="flex gap-2 items-center">

                            <Building2
                              className="text-blood"
                            />


                            <h2 className="text-xl font-bold">

                              {bank.name}

                            </h2>

                          </div>


                          <p className="text-slate-500 flex gap-1 mt-3">

                            <MapPin
                              size={17}
                            />


                            {bank.location}

                          </p>


                          {bank.phone && (

                            <p className="text-slate-500 flex gap-1 mt-2">

                              <Phone
                                size={17}
                              />


                              {bank.phone}

                            </p>

                          )}

                        </div>

                      </div>



                      {/* BLOOD STOCK */}

                      <div className="mt-6 border-t pt-5">


                        <h3 className="font-bold mb-4">

                          🩸 Blood Availability

                        </h3>


                        <div className="grid grid-cols-2 gap-3">


                          {bloodGroups.map(
                            (group) => {

                              const units =
                                bank.bloodStock?.[
                                  group
                                ] || 0;


                              return (

                                <div
                                  key={group}

                                  className={`p-3 rounded-xl border ${
                                    units > 0

                                      ? "bg-red-50 border-red-100"

                                      : "bg-slate-50 border-slate-200"
                                  }`}
                                >


                                  <div className="flex justify-between items-center">


                                    <span className="font-bold text-blood">

                                      <Droplet
                                        size={15}
                                        className="inline mr-1"
                                      />

                                      {group}

                                    </span>


                                    <span
                                      className={`font-bold ${
                                        units > 0

                                          ? "text-green-600"

                                          : "text-slate-400"
                                      }`}
                                    >

                                      {units} Units

                                    </span>


                                  </div>

                                </div>

                              );

                            }
                          )}

                        </div>

                      </div>


                    </div>

                  )
                )}

              </div>

            </div>

          )}

      </div>

    </Layout>

  );

}