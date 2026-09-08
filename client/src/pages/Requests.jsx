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

  const [showForm, setShowForm] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [formData, setFormData] =
    useState({
      patientName: "",
      bloodGroup: "",
      location: "",
      hospital: "",
      units: 1,
      phone: "",
      message: "",
    });


  /* =========================================
     LOAD BLOOD REQUESTS
  ========================================= */

  const loadRequests =
    async () => {

      try {

        setLoading(true);

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


  useEffect(() => {

    loadRequests();

  }, []);



  /* =========================================
     HANDLE INPUT CHANGE
  ========================================= */

  const handleChange =
    (e) => {

      const {
        name,
        value,
      } = e.target;


      setFormData({
        ...formData,

        [name]: value,
      });

    };



  /* =========================================
     SUBMIT BLOOD REQUEST
  ========================================= */

  const handleSubmit =
    async (e) => {

      e.preventDefault();


      if (
        !formData.patientName ||
        !formData.bloodGroup ||
        !formData.location ||
        !formData.phone
      ) {

        setMessage(
          "Please fill all required fields."
        );

        return;

      }


      try {

        setSubmitting(true);

        setMessage("");


        await api.post(
          "/requests",
          {
            ...formData,

            units:
              Number(
                formData.units
              ),
          }
        );


        setMessage(
          "Blood request created successfully!"
        );


        setFormData({
          patientName: "",
          bloodGroup: "",
          location: "",
          hospital: "",
          units: 1,
          phone: "",
          message: "",
        });


        setShowForm(
          false
        );


        loadRequests();

      } catch (error) {

        console.error(
          "Failed to create request:",
          error
        );


        setMessage(

          error.response?.data?.message ||

          "Failed to create blood request"

        );

      } finally {

        setSubmitting(false);

      }

    };



  /* =========================================
     FORMAT DATE
  ========================================= */

  const formatDate =
    (date) => {

      if (!date) {
        return "";
      }


      return new Date(
        date
      ).toLocaleString(
        "en-IN"
      );

    };



  return (

    <Layout>

      <div className="p-6 max-w-7xl">


        {/* =========================================
           PAGE HEADER
        ========================================= */}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">


          <div>

            <h1 className="text-3xl font-bold">

              🩸 Blood Requests

            </h1>


            <p className="text-slate-500 mt-2">

              Emergency blood requests from people in need.

            </p>

          </div>



          <button
            onClick={() =>
              setShowForm(
                !showForm
              )
            }
            className="btn-red"
          >

            {showForm

              ? "Close Form"

              : "+ Request Blood"}

          </button>


        </div>



        {/* =========================================
           SUCCESS / ERROR MESSAGE
        ========================================= */}

        {message && (

          <div className="mt-5 p-4 rounded-xl bg-slate-100">

            {message}

          </div>

        )}



        {/* =========================================
           BLOOD REQUEST FORM
        ========================================= */}

        {showForm && (

          <div className="card p-6 mt-6">


            <h2 className="text-xl font-bold">

              🚨 Create Emergency Blood Request

            </h2>


            <p className="text-slate-500 mt-2">

              Fill in the details to request blood.

            </p>



            <form
              onSubmit={handleSubmit}
              className="mt-6"
            >


              <div className="grid md:grid-cols-2 gap-5">


                {/* PATIENT NAME */}

                <div>

                  <label>

                    Patient Name *

                  </label>


                  <input
                    type="text"
                    name="patientName"
                    value={
                      formData.patientName
                    }
                    onChange={
                      handleChange
                    }
                    className="field mt-2"
                    placeholder="Enter patient name"
                  />

                </div>



                {/* BLOOD GROUP */}

                <div>

                  <label>

                    Blood Group *

                  </label>


                  <select
                    name="bloodGroup"
                    value={
                      formData.bloodGroup
                    }
                    onChange={
                      handleChange
                    }
                    className="field mt-2"
                  >

                    <option value="">

                      Select Blood Group

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

                  <label>

                    Location *

                  </label>


                  <input
                    type="text"
                    name="location"
                    value={
                      formData.location
                    }
                    onChange={
                      handleChange
                    }
                    className="field mt-2"
                    placeholder="City / Area"
                  />

                </div>



                {/* HOSPITAL */}

                <div>

                  <label>

                    Hospital

                  </label>


                  <input
                    type="text"
                    name="hospital"
                    value={
                      formData.hospital
                    }
                    onChange={
                      handleChange
                    }
                    className="field mt-2"
                    placeholder="Hospital name"
                  />

                </div>



                {/* UNITS */}

                <div>

                  <label>

                    Units Required

                  </label>


                  <input
                    type="number"
                    name="units"
                    value={
                      formData.units
                    }
                    onChange={
                      handleChange
                    }
                    min="1"
                    className="field mt-2"
                  />

                </div>



                {/* PHONE */}

                <div>

                  <label>

                    Contact Number *

                  </label>


                  <input
                    type="tel"
                    name="phone"
                    value={
                      formData.phone
                    }
                    onChange={
                      handleChange
                    }
                    className="field mt-2"
                    placeholder="Enter contact number"
                  />

                </div>


              </div>



              {/* MESSAGE */}

              <div className="mt-5">

                <label>

                  Emergency Message

                </label>


                <textarea
                  name="message"
                  value={
                    formData.message
                  }
                  onChange={
                    handleChange
                  }
                  className="field mt-2 min-h-28"
                  placeholder="Describe the emergency..."
                />

              </div>



              <button
                type="submit"
                disabled={submitting}
                className="btn-red mt-6"
              >

                {submitting

                  ? "Submitting..."

                  : "Submit Blood Request"}

              </button>


            </form>


          </div>

        )}



        {/* =========================================
           REQUEST LIST
        ========================================= */}

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


                  <div className="flex justify-between items-start gap-3">


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



                  <div className="mt-5 space-y-3">


                    <p>

                      📍{" "}

                      <b>
                        Location:
                      </b>{" "}

                      {request.location}

                    </p>



                    <p>

                      🏥{" "}

                      <b>
                        Hospital:
                      </b>{" "}

                      {request.hospital ||
                        "Not specified"}

                    </p>



                    <p>

                      🩸{" "}

                      <b>
                        Units Needed:
                      </b>{" "}

                      {request.units}

                    </p>



                    <p>

                      📞{" "}

                      <b>
                        Contact:
                      </b>{" "}

                      {request.phone}

                    </p>



                    {request.message && (

                      <div className="bg-red-50 p-3 rounded-lg">

                        <b>
                          Message:
                        </b>


                        <p className="text-sm mt-1">

                          {request.message}

                        </p>

                      </div>

                    )}


                  </div>



                  <p className="text-xs text-slate-400 mt-5">

                    Requested:{" "}

                    {formatDate(
                      request.createdAt
                    )}

                  </p>



                  <a
                    href={`tel:${request.phone}`}
                    className="btn-red w-full mt-5 block text-center"
                  >

                    Contact Patient

                  </a>


                </div>

              )
            )}


          </div>

        )}


      </div>

    </Layout>

  );

}