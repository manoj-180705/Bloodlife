import React, {
  useEffect,
  useState,
} from "react";

import Layout from "../components/Layout";
import api from "../services/api";


export default function Profile() {

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [lastDonated, setLastDonated] =
    useState("");

  const [updating, setUpdating] =
    useState(false);

  const [message, setMessage] =
    useState("");


  /* =========================================
     LOAD LOGGED-IN USER
  ========================================= */

  useEffect(() => {

    const loadProfile = async () => {

      try {

        // Get logged-in user from localStorage
        const savedUser =
          localStorage.getItem("user");


        if (!savedUser) {

          setMessage(
            "No logged-in user found. Please login again."
          );

          return;

        }


        const loggedInUser =
          JSON.parse(savedUser);


        console.log(
          "Logged-in user:",
          loggedInUser
        );


        // Get latest user details from backend
        const response =
          await api.get(
            `/donors/${loggedInUser._id}`
          );


        const currentUser =
          response.data;


        setUser(
          currentUser
        );


        // Update localStorage with latest details
        localStorage.setItem(
          "user",
          JSON.stringify(
            currentUser
          )
        );


        if (
          currentUser.lastDonated
        ) {

          setLastDonated(

            new Date(
              currentUser.lastDonated
            )
              .toISOString()
              .split("T")[0]

          );

        }

      } catch (error) {

        console.error(
          "Failed to load profile:",
          error
        );

        setMessage(
          error.response?.data?.message ||
          "Failed to load profile"
        );

      } finally {

        setLoading(false);

      }

    };


    loadProfile();

  }, []);



  /* =========================================
     UPDATE LAST DONATION DATE
  ========================================= */

  const handleUpdate =
    async () => {

      if (!lastDonated) {

        setMessage(
          "Please select a blood donation date."
        );

        return;

      }


      try {

        setUpdating(true);

        setMessage("");


        const response =
          await api.put(

            `/donors/${user._id}/last-donated`,

            {
              lastDonated,
            }

          );


        const updatedUser =
          response.data.donor;


        setUser(
          updatedUser
        );


        // IMPORTANT:
        // Update logged-in user in localStorage
        localStorage.setItem(

          "user",

          JSON.stringify(
            updatedUser
          )

        );


        setMessage(
          "Last blood donation date updated successfully! You are temporarily unavailable for donation."
        );

      } catch (error) {

        console.error(
          "Update error:",
          error
        );


        setMessage(

          error.response?.data?.message ||

          "Failed to update donation date"

        );

      } finally {

        setUpdating(false);

      }

    };



  /* =========================================
     FORMAT DATE
  ========================================= */

  const formatDate =
    (date) => {

      if (!date) {

        return "Never donated";

      }


      return new Date(
        date
      ).toLocaleDateString(

        "en-IN",

        {

          day: "numeric",

          month: "long",

          year: "numeric",

        }

      );

    };



  /* =========================================
     CALCULATE NEXT AVAILABLE DATE
  ========================================= */

  const getAvailableDate =
    () => {

      if (!user?.lastDonated) {

        return null;

      }


      const date =
        new Date(
          user.lastDonated
        );


      date.setDate(
        date.getDate() + 90
      );


      return date;

    };



  /* =========================================
     LOADING
  ========================================= */

  if (loading) {

    return (

      <Layout>

        <div className="p-6">

          Loading profile...

        </div>

      </Layout>

    );

  }



  /* =========================================
     USER NOT FOUND
  ========================================= */

  if (!user) {

    return (

      <Layout>

        <div className="p-6">

          <h2 className="text-xl font-bold text-red-600">

            Profile not found.

          </h2>


          {message && (

            <p className="mt-3 text-slate-500">

              {message}

            </p>

          )}

        </div>

      </Layout>

    );

  }



  const availableDate =
    getAvailableDate();



  /* =========================================
     UI
  ========================================= */

  return (

    <Layout>

      <div className="p-6 max-w-4xl">


        {/* HEADER */}

        <h1 className="text-3xl font-bold">

          My Profile

        </h1>


        <p className="text-slate-500 mt-2">

          Manage your BloodLife donor information.

        </p>



        {/* PROFILE CARD */}

        <div className="card p-6 mt-6">

          <div className="flex items-center gap-5">


            {/* PROFILE INITIAL */}

            <div className="w-20 h-20 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-3xl font-bold">

              {user.name
                ?.charAt(0)
                ?.toUpperCase()}

            </div>



            {/* USER DETAILS */}

            <div>

              <h2 className="text-2xl font-bold">

                {user.name}

              </h2>


              <p className="text-slate-500">

                {user.email}

              </p>


              <p className="text-slate-500">

                {user.phone ||
                  "Phone not specified"}

              </p>

            </div>


          </div>

        </div>



        {/* DONATION INFORMATION */}

        <div className="card p-6 mt-5">


          <h2 className="text-xl font-bold mb-6">

            🩸 Donation Information

          </h2>



          <div className="grid md:grid-cols-2 gap-6">


            {/* BLOOD GROUP */}

            <div>

              <p className="text-slate-500 text-sm">

                Blood Group

              </p>


              <p className="text-2xl font-bold text-blood mt-1">

                {user.bloodGroup ||
                  "Not specified"}

              </p>

            </div>



            {/* LOCATION */}

            <div>

              <p className="text-slate-500 text-sm">

                Location

              </p>


              <p className="text-lg font-semibold mt-1">

                {user.location ||
                  "Not specified"}

              </p>

            </div>



            {/* LAST DONATED */}

            <div>

              <p className="text-slate-500 text-sm">

                Last Blood Donated

              </p>


              <p className="text-lg font-semibold mt-1">

                {formatDate(
                  user.lastDonated
                )}

              </p>

            </div>



            {/* DONOR STATUS */}

            <div>

              <p className="text-slate-500 text-sm">

                Donor Status

              </p>


              <span

                className={`inline-block mt-2 px-4 py-2 rounded-full ${
                  user.isAvailable

                    ? "bg-green-100 text-green-700"

                    : "bg-orange-100 text-orange-700"
                }`}

              >

                {user.isAvailable

                  ? "Available to Donate"

                  : "Currently Unavailable"}

              </span>

            </div>



            {/* DONATION COUNT */}

            <div>

              <p className="text-slate-500 text-sm">

                Total Donations

              </p>


              <p className="text-2xl font-bold mt-1">

                {user.donations || 0}

              </p>

            </div>



            {/* POINTS */}

            <div>

              <p className="text-slate-500 text-sm">

                BloodLife Points

              </p>


              <p className="text-2xl font-bold text-yellow-600 mt-1">

                ⭐ {user.points || 0}

              </p>

            </div>


          </div>



          {/* AVAILABILITY MESSAGE */}

          {!user.isAvailable &&
            availableDate && (

              <div className="mt-6 p-4 rounded-xl bg-orange-50 border border-orange-200">

                <p className="font-semibold text-orange-700">

                  🩸 You are currently recovering after donation.

                </p>


                <p className="text-sm text-orange-600 mt-1">

                  You will become available to donate again after{" "}

                  <b>

                    {formatDate(
                      availableDate
                    )}

                  </b>

                </p>

              </div>

            )}



          {/* UPDATE DONATION DATE */}

          <div className="border-t mt-8 pt-6">


            <h3 className="text-lg font-bold">

              Update Last Blood Donation

            </h3>


            <p className="text-sm text-slate-500 mt-1">

              Update this whenever you donate blood.

            </p>



            <div className="mt-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">


              <input

                type="date"

                value={lastDonated}

                onChange={(e) =>
                  setLastDonated(
                    e.target.value
                  )
                }

                className="field"

                max={
                  new Date()
                    .toISOString()
                    .split("T")[0]
                }

              />


              <button

                onClick={handleUpdate}

                disabled={updating}

                className="btn-red"

              >

                {updating

                  ? "Updating..."

                  : "Update Date"}

              </button>


            </div>



            {message && (

              <p className="mt-4 text-sm text-green-600">

                {message}

              </p>

            )}


          </div>


        </div>


      </div>

    </Layout>

  );

}