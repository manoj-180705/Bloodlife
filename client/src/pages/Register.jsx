import React, { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  z,
} from "zod";

import {
  HeartPulse,
  User,
  Mail,
  Lock,
  MapPin,
  Droplet,
  Phone,
} from "lucide-react";

import axios from "axios";


/* =========================================
   FORM VALIDATION
========================================= */

const schema = z.object({

  name: z
    .string()
    .min(
      2,
      "Name must be at least 2 characters"
    ),

  email: z
    .string()
    .email(
      "Please enter a valid email"
    ),

  phone: z
    .string()
    .min(
      10,
      "Please enter a valid phone number"
    ),

  bloodGroup: z
    .string()
    .min(
      1,
      "Please select your blood group"
    ),

  location: z
    .string()
    .min(
      2,
      "Please enter your location"
    ),

  password: z
    .string()
    .min(
      6,
      "Password must be at least 6 characters"
    ),

});


export default function Register() {

  const nav = useNavigate();


  const [registerError, setRegisterError] =
    useState("");


  const [loading, setLoading] =
    useState(false);


  const {

    register,

    handleSubmit,

    formState: {
      errors,
    },

  } = useForm({

    resolver:
      zodResolver(schema),

  });



  /* =========================================
     REGISTER USER
  ========================================= */

  const submit =
    async (data) => {

      try {

        setLoading(true);

        setRegisterError("");


        const response =
          await axios.post(

            `${
              import.meta.env.VITE_API_URL ||
              "http://localhost:5000/api"
            }/auth/register`,

            data

          );


        console.log(
          "Register response:",
          response.data
        );


        /*
        =================================
        IMPORTANT

        DO NOT AUTOMATICALLY GO TO
        DASHBOARD AFTER REGISTERING.

        USER MUST LOGIN FIRST.
        =================================
        */


        alert(
          "Registration successful! Please login."
        );


        /*
        =================================
        REDIRECT TO LOGIN
        =================================
        */

        nav(
          "/login"
        );


      } catch (error) {

        console.error(
          "Register error:",
          error
        );


        setRegisterError(

          error.response
            ?.data
            ?.message ||

          "Registration failed. Please try again."

        );


      } finally {

        setLoading(false);

      }

    };



  return (

    <div
      className="
        auth-bg
        min-h-screen
        grid
        lg:grid-cols-2
      "
    >


      {/* =====================================
          LEFT SIDE
      ====================================== */}

      <section
        className="
          hero-red
          hidden
          lg:flex
          text-white
          p-16
          flex-col
          justify-center
        "
      >


        <HeartPulse
          size={70}
          className="mb-8"
        />


        <h1
          className="
            text-5xl
            font-bold
          "
        >

          Become a
          <br />

          Life Saver.

        </h1>


        <p
          className="
            text-xl
            mt-6
          "
        >

          Join BloodLife and help
          <br />

          save lives.

        </p>


        <div
          className="
            mt-12
            text-lg
          "
        >

          🩸 Donate Blood

          <br />

          ❤️ Save Lives

          <br />

          🦸 Be a Hero

        </div>


      </section>



      {/* =====================================
          RIGHT SIDE
      ====================================== */}

      <section
        className="
          flex
          items-center
          justify-center
          p-6
          py-10
        "
      >


        <form

          onSubmit={
            handleSubmit(
              submit
            )
          }

          className="
            glass
            w-full
            max-w-lg
            rounded-3xl
            p-8
          "

        >


          {/* LOGO */}

          <div
            className="
              text-center
              mb-7
            "
          >


            <HeartPulse
              className="
                mx-auto
                text-blood
              "
              size={60}
            />


            <h1
              className="
                text-4xl
                font-bold
                mt-2
              "
            >

              <span
                className="
                  text-blood
                "
              >

                Blood

              </span>

              Life

            </h1>


            <h2
              className="
                text-2xl
                font-bold
                mt-5
              "
            >

              Create Account

            </h2>


            <p
              className="
                text-slate-500
                mt-1
              "
            >

              Join us and help save lives.

            </p>


          </div>



          {/* =====================================
              ERROR MESSAGE
          ====================================== */}

          {registerError && (

            <div
              className="
                mb-4
                p-3
                rounded-lg
                bg-red-100
                text-red-700
                text-sm
              "
            >

              {registerError}

            </div>

          )}



          {/* =====================================
              NAME
          ====================================== */}

          <label>

            Full Name

          </label>


          <div
            className="
              relative
              mt-2
            "
          >


            <User
              className="
                absolute
                left-3
                top-3
                text-slate-400
              "
              size={19}
            />


            <input

              type="text"

              className="
                field
                pl-10
              "

              placeholder="
                Enter your full name
              "

              {...register(
                "name"
              )}

            />


          </div>


          {errors.name && (

            <p
              className="
                text-xs
                text-blood
                mt-1
              "
            >

              {errors.name.message}

            </p>

          )}



          {/* =====================================
              EMAIL
          ====================================== */}

          <label
            className="
              block
              mt-4
            "
          >

            Email

          </label>


          <div
            className="
              relative
              mt-2
            "
          >


            <Mail
              className="
                absolute
                left-3
                top-3
                text-slate-400
              "
              size={19}
            />


            <input

              type="email"

              className="
                field
                pl-10
              "

              placeholder="
                Enter your email
              "

              {...register(
                "email"
              )}

            />


          </div>


          {errors.email && (

            <p
              className="
                text-xs
                text-blood
                mt-1
              "
            >

              {errors.email.message}

            </p>

          )}



          {/* =====================================
              PHONE
          ====================================== */}

          <label
            className="
              block
              mt-4
            "
          >

            Phone Number

          </label>


          <div
            className="
              relative
              mt-2
            "
          >


            <Phone
              className="
                absolute
                left-3
                top-3
                text-slate-400
              "
              size={19}
            />


            <input

              type="tel"

              className="
                field
                pl-10
              "

              placeholder="
                Enter your phone number
              "

              {...register(
                "phone"
              )}

            />


          </div>


          {errors.phone && (

            <p
              className="
                text-xs
                text-blood
                mt-1
              "
            >

              {errors.phone.message}

            </p>

          )}



          {/* =====================================
              BLOOD GROUP + LOCATION
          ====================================== */}

          <div
            className="
              grid
              md:grid-cols-2
              gap-4
              mt-4
            "
          >


            {/* BLOOD GROUP */}

            <div>


              <label>

                Blood Group

              </label>


              <div
                className="
                  relative
                  mt-2
                "
              >


                <Droplet
                  className="
                    absolute
                    left-3
                    top-3
                    text-slate-400
                    pointer-events-none
                  "
                  size={19}
                />


                <select

                  className="
                    field
                    pl-10
                  "

                  {...register(
                    "bloodGroup"
                  )}

                >

                  <option value="">

                    Select

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


              {errors.bloodGroup && (

                <p
                  className="
                    text-xs
                    text-blood
                    mt-1
                  "
                >

                  {errors.bloodGroup.message}

                </p>

              )}


            </div>



            {/* LOCATION */}

            <div>


              <label>

                Location

              </label>


              <div
                className="
                  relative
                  mt-2
                "
              >


                <MapPin
                  className="
                    absolute
                    left-3
                    top-3
                    text-slate-400
                  "
                  size={19}
                />


                <input

                  type="text"

                  className="
                    field
                    pl-10
                  "

                  placeholder="
                    Your location
                  "

                  {...register(
                    "location"
                  )}

                />


              </div>


              {errors.location && (

                <p
                  className="
                    text-xs
                    text-blood
                    mt-1
                  "
                >

                  {errors.location.message}

                </p>

              )}


            </div>


          </div>



          {/* =====================================
              PASSWORD
          ====================================== */}

          <label
            className="
              block
              mt-4
            "
          >

            Password

          </label>


          <div
            className="
              relative
              mt-2
            "
          >


            <Lock
              className="
                absolute
                left-3
                top-3
                text-slate-400
              "
              size={19}
            />


            <input

              type="password"

              className="
                field
                pl-10
              "

              placeholder="
                Create a password
              "

              {...register(
                "password"
              )}

            />


          </div>


          {errors.password && (

            <p
              className="
                text-xs
                text-blood
                mt-1
              "
            >

              {errors.password.message}

            </p>

          )}



          {/* =====================================
              REGISTER BUTTON
          ====================================== */}

          <button

            type="submit"

            disabled={loading}

            className="
              btn-red
              w-full
              mt-7
              disabled:opacity-60
              disabled:cursor-not-allowed
            "

          >

            {

              loading

                ? "Creating Account..."

                : "Create Account →"

            }

          </button>



          {/* =====================================
              LOGIN LINK
          ====================================== */}

          <p
            className="
              text-center
              mt-6
              text-slate-600
            "
          >

            Already have an account?

            {" "}

            <Link

              to="/login"

              className="
                text-blood
                font-bold
              "

            >

              Login

            </Link>

          </p>


        </form>


      </section>


    </div>

  );

}