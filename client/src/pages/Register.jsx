import React, {
  useEffect,
  useState,
} from "react";

import Layout from "../components/Layout";

import api from "../services/api";


export default function Requests() {

  const [requests, setRequests] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [deletingId, setDeletingId] =
    useState(null);


  const loggedInUser =
    JSON.parse(
      localStorage.getItem("user")
    );


  useEffect(() => {

    loadRequests();

  }, []);



  /* =========================================
     LOAD BLOOD REQUESTS
  ========================================= */

  const loadRequests =
    async () => {

      try {

        const response =
          await api.get(
            "/requests"
          );


        setRequests(
          response.data
        );

      } catch (error) {

        console.error(
          "Failed to load requests:",
          error
        );

      } finally {

        setLoading(false);

      }

    };



  /* =========================================
     DELETE / COMPLETE REQUEST
  ========================================= */

  const handleComplete =
    async (requestId) => {

      const confirmed =
        window.confirm(
          "Has blood been received? This request will be removed."
        );


      if (!confirmed) {
        return;
      }


      try {

        setDeletingId(
          requestId
        );


        await api.delete(
          `/requests/${requestId}`,
          {
            data: {

              userId:
                loggedInUser._id,

            },
          }
        );


        // Remove request immediately from UI

        setRequests(
          requests.filter(
            (request) =>
              request._id !== requestId
          )
        );


        alert(
          "Blood request completed and removed successfully."
        );


      } catch (error) {

        console.error(
          "Delete request error:",
          error
        );


        alert(

          error.response?.data?.message ||

          "Failed to remove blood request"

        );

      } finally {

        setDeletingId(
          null
        );

      }

    };



  /* =========================================
     FORMAT DATE
  ========================================= */

  const formatDate =
    (date) => {

      return new Date(
        date
      ).toLocaleString(
        "en-IN"
      );

    };



  /* =========================================
     CHECK REQUEST OWNER
  ========================================= */

  const isRequestOwner =
    (request) => {

      if (
        !loggedInUser ||
        !request.requestedBy
      ) {
        return false;
      }


      return (

        request.requestedBy.toString() ===

        loggedInUser._id.toString()

      );

    };



  return (

    <Layout>

      <div className="p-6 max-w-7xl">


        {/* HEADER */}

        <div className="flex justify-between items-center">

          <div>

            <h1 className="text-3xl font-bold">

              🩸 Blood Requests

            </h1>


            <p className="text-slate-500 mt-2">

              Emergency blood requests from people in need.

            </p>

          </div>


          {/* ACTIVE REQUEST COUNT */}

          <div className="bg-red-100 text-red-600 px-5 py-3 rounded-xl font-bold">

            Active Requests:

            {" "}

            {requests.length}

          </div>

        </div>



        {/* LOADING */}

        {loading ? (

          <div className="mt-8">

            Loading blood requests...

          </div>

        ) : requests.length === 0 ? (

          <div className="card p-8 mt-8 text-center">

            <h2 className="text-xl font-bold">

              No Active Blood Requests

            </h2>


            <p className="text-slate-500 mt-2">

              There are currently no emergency requests.

            </p>

          </div>

        ) : (

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 mt-8">


            {requests.map(
              (request) => (

                <div
                  key={request._id}
                  className="card p-6 border-l-4 border-red-500"
                >


                  {/* REQUEST HEADER */}

                  <div className="flex justify-between items-start">

                    <div>

                      <h2 className="text-xl font-bold">

                        {request.patientName}

                      </h2>


                      <p className="text-red-600 font-semibold mt-2">

                        🚨 Emergency Blood Required

                      </p>

                    </div>


                    <span className="bg-red-100 text-red-600 px-3 py-2 rounded-lg font-bold">

                      {request.bloodGroup}

                    </span>

                  </div>



                  {/* REQUEST DETAILS */}

                  <div className="mt-5 space-y-3">


                    <p>

                      📍

                      {" "}

                      <b>Location:</b>

                      {" "}

                      {request.location}

                    </p>



                    <p>

                      🏥

                      {" "}

                      <b>Hospital:</b>

                      {" "}

                      {request.hospital ||

                        "Not specified"}

                    </p>



                    <p>

                      🩸

                      {" "}

                      <b>Units Needed:</b>

                      {" "}

                      {request.units}

                    </p>



                    <p>

                      📞

                      {" "}

                      <b>Contact:</b>

                      {" "}

                      {request.phone}

                    </p>



                    {request.message && (

                      <div className="bg-red-50 p-3 rounded-lg">

                        <b>Message:</b>


                        <p className="text-sm mt-1">

                          {request.message}

                        </p>

                      </div>

                    )}

                  </div>



                  {/* DATE */}

                  <p className="text-xs text-slate-400 mt-5">

                    Requested:

                    {" "}

                    {formatDate(
                      request.createdAt
                    )}

                  </p>



                  {/* CONTACT BUTTON */}

                  <a
                    href={`tel:${request.phone}`}
                    className="btn-red w-full mt-5 block text-center"
                  >

                    Contact Patient

                  </a>



                  {/* DELETE BUTTON ONLY FOR REQUEST OWNER */}

                  {isRequestOwner(
                    request
                  ) && (

                    <button

                      onClick={() =>

                        handleComplete(
                          request._id
                        )

                      }

                      disabled={
                        deletingId ===
                        request._id
                      }

                      className="w-full mt-3 border border-green-600 text-green-600 rounded-xl py-3 font-semibold hover:bg-green-50"

                    >

                      {deletingId ===
                      request._id

                        ? "Completing..."

                        : "✓ Blood Received / Close Request"}

                    </button>

                  )}

                </div>

              )
            )}

          </div>

        )}

      </div>

    </Layout>

  );

}