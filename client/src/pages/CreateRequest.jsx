import React, {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import Layout from "../components/Layout";

import api from "../services/api";


export default function CreateRequest() {

  const navigate =
    useNavigate();


  const [form, setForm] =
    useState({

      patientName: "",

      bloodGroup: "",

      location: "",

      phone: "",

      units: 1,

      hospital: "",

      message: "",

    });


  const [loading, setLoading] =
    useState(false);


  const handleChange =
    (e) => {

      setForm({

        ...form,

        [e.target.name]:
          e.target.value,

      });

    };


  const handleSubmit =
    async (e) => {

      e.preventDefault();


      try {

        setLoading(true);


        await api.post(

          "/requests",

          form

        );


        alert(
          "Emergency blood request submitted successfully!"
        );


        navigate(
          "/requests"
        );

      } catch (error) {

        alert(

          error.response
            ?.data
            ?.message ||

          "Failed to create blood request"

        );

      } finally {

        setLoading(false);

      }

    };


  return (

    <Layout>

      <div className="p-6 max-w-3xl">

        <h1 className="text-3xl font-bold">

          🚨 Request Emergency Blood

        </h1>


        <p className="text-slate-500 mt-2">

          Submit blood requirements so nearby donors can help.

        </p>


        <form
          onSubmit={handleSubmit}
          className="card p-6 mt-6"
        >


          {/* PATIENT NAME */}

          <label>

            Patient Name

          </label>

          <input
            type="text"
            name="patientName"
            value={form.patientName}
            onChange={handleChange}
            className="field mt-2"
            placeholder="Enter patient name"
            required
          />


          {/* BLOOD GROUP */}

          <label className="block mt-5">

            Blood Group Required

          </label>

          <select
            name="bloodGroup"
            value={form.bloodGroup}
            onChange={handleChange}
            className="field mt-2"
            required
          >

            <option value="">
              Select Blood Group
            </option>

            <option>A+</option>
            <option>A-</option>

            <option>B+</option>
            <option>B-</option>

            <option>AB+</option>
            <option>AB-</option>

            <option>O+</option>
            <option>O-</option>

          </select>


          {/* LOCATION */}

          <label className="block mt-5">

            Location

          </label>

          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            className="field mt-2"
            placeholder="City / Area"
            required
          />


          {/* HOSPITAL */}

          <label className="block mt-5">

            Hospital Name

          </label>

          <input
            type="text"
            name="hospital"
            value={form.hospital}
            onChange={handleChange}
            className="field mt-2"
            placeholder="Enter hospital name"
          />


          {/* PHONE */}

          <label className="block mt-5">

            Contact Phone Number

          </label>

          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="field mt-2"
            placeholder="Enter phone number"
            required
          />


          {/* UNITS */}

          <label className="block mt-5">

            Units Required

          </label>

          <input
            type="number"
            name="units"
            value={form.units}
            onChange={handleChange}
            min="1"
            max="10"
            className="field mt-2"
            required
          />


          {/* MESSAGE */}

          <label className="block mt-5">

            Emergency Details

          </label>

          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            className="field mt-2 min-h-28"
            placeholder="Describe the emergency..."
          />


          <button
            type="submit"
            disabled={loading}
            className="btn-red w-full mt-6"
          >

            {loading

              ? "Submitting Request..."

              : "🚨 Submit Emergency Blood Request"

            }

          </button>

        </form>

      </div>

    </Layout>

  );

}