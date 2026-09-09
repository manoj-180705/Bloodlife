import React, {
  useState,
} from "react";

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
  Phone,
  Lock,
  MapPin,
  Droplet,
} from "lucide-react";

import api from "../services/api";


/* =========================================
   FORM VALIDATION
========================================= */

const schema = z.object({

  name: z
    .string()
    .min(
      2,
      "Name must contain at least 2 characters"
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

  password: z
    .string()
    .min(
      6,
      "Password must be at least 6 characters"
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

});


/* =========================================
   REGISTER COMPONENT
========================================= */

export default function Register() {


  const nav = useNavigate();


  /* =========================================
     STATES
  ========================================= */

  const [registerError, setRegisterError] =
    useState("");


  const [successMessage, setSuccessMessage] =
    useState("");


  const [loading, setLoading] =
    useState(false);


  /* =========================================
     REACT HOOK FORM
  ========================================= */

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
     SUBMIT REGISTER FORM
  ========================================= */

  const submit =
    async (data) => {

      try {

        setLoading(true);

        setRegisterError("");

        setSuccessMessage("");


        console.log(
          "Registration data:",
          data
        );


        /* =========================================
           SEND DATA TO BACKEND
        ========================================= */

        const response =
          await api.post(

            "/auth/register",

            {

              name:
                data.name,

              email:
                data.email,

              phone:
                data.phone,

              password:
                data.password,

              bloodGroup:
                data.bloodGroup,

              location:
                data.location,

            }

          );


        console.log(
          "Registration response:",
          response.data
        );


        /* =========================================
           SAVE TOKEN
        ========================================= */

        if (
          response.data.token
        ) {

          localStorage.setItem(

            "token",

            response.data.token

          );

        }


        /* =========================================
           SAVE USER
        ========================================= */

        if (
          response.data.user
        ) {

          localStorage.setItem(

            "user",

            JSON.stringify(
              response.data.user
            )

          );

        }


        /* =========================================
           SUCCESS MESSAGE
        ========================================= */

        setSuccessMessage(

          response.data.message ||

          "Registration successful!"

        );


        /* =========================================
           REDIRECT TO DASHBOARD
        ========================================= */

        setTimeout(

          () => {

            nav(
              "/dashboard"
            );

          },

          1000

        );


      } catch (error) {


        console.error(
          "Registration error:",
          error
        );


        console.error(
          "Backend response:",
          error.response?.data
        );


        /* =========================================
           DISPLAY ERROR
        ========================================= */

        setRegisterError(

          error.response
            ?.data
            ?.message ||

          "Registration failed. Please try again."

        );


      } finally {


        setLoading(
          false
        );

      }

    };


  /* =========================================
     UI
  ========================================= */

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
      ===================================== */}

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


        <h1

          className="

            text-5xl

            font-bold

          "

        >

          Become a Hero.

          <br />

          Save a Life.

        </h1>


        <p

          className="

            text-xl

            mt-6

          "

        >

          Join our community

          <br />

          of life savers.

        </p>


        <div

          className="

            blood-drop

            mt-20

          "

        />


      </section>



      {/* =====================================
          RIGHT SIDE
      ===================================== */}

      <section

        className="

          flex

          items-center

          justify-center

          p-6

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

            max-w-md

            rounded-3xl

            p-8

            my-6

          "

        >


          {/* =====================================
              LOGO
          ===================================== */}

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

              "

            >

              <span
                className="text-blood"
              >

                Blood

              </span>

              Life

            </h1>


            <p
              className="text-slate-500"
            >

              Save a Life. Be a Hero.

            </p>


            <h2

              className="

                text-2xl

                font-bold

                mt-6

              "

            >

              Create Account

            </h2>


            <p
              className="text-slate-500"
            >

              Join the BloodLife community.

            </p>


          </div>



          {/* =====================================
              ERROR MESSAGE
          ===================================== */}

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
              SUCCESS MESSAGE
          ===================================== */}

          {successMessage && (

            <div

              className="

                mb-4

                p-3

                rounded-lg

                bg-green-100

                text-green-700

                text-sm

              "

            >

              {successMessage}

            </div>

          )}



          {/* =====================================
              NAME
          ===================================== */}

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

              placeholder="Enter your full name"

              {...register(
                "name"
              )}

            />

          </div>


          {errors.name && (

            <p

              className="

                text-xs

                text-red-600

                mt-1

              "

            >

              {errors.name.message}

            </p>

          )}



          {/* =====================================
              EMAIL
          ===================================== */}

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

              placeholder="Enter your email"

              {...register(
                "email"
              )}

            />

          </div>


          {errors.email && (

            <p

              className="

                text-xs

                text-red-600

                mt-1

              "

            >

              {errors.email.message}

            </p>

          )}



          {/* =====================================
              PHONE
          ===================================== */}

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

              placeholder="Enter your phone number"

              {...register(
                "phone"
              )}

            />

          </div>


          {errors.phone && (

            <p

              className="

                text-xs

                text-red-600

                mt-1

              "

            >

              {errors.phone.message}

            </p>

          )}



          {/* =====================================
              BLOOD GROUP
          ===================================== */}

          <label

            className="

              block

              mt-4

            "

          >

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

              defaultValue=""

              {...register(
                "bloodGroup"
              )}

            >

              <option
                value=""
              >

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


          {errors.bloodGroup && (

            <p

              className="

                text-xs

                text-red-600

                mt-1

              "

            >

              {errors.bloodGroup.message}

            </p>

          )}



          {/* =====================================
              LOCATION
          ===================================== */}

          <label

            className="

              block

              mt-4

            "

          >

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

              placeholder="Enter your city"

              {...register(
                "location"
              )}

            />

          </div>


          {errors.location && (

            <p

              className="

                text-xs

                text-red-600

                mt-1

              "

            >

              {errors.location.message}

            </p>

          )}



          {/* =====================================
              PASSWORD
          ===================================== */}

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

              placeholder="Create a password"

              {...register(
                "password"
              )}

            />

          </div>


          {errors.password && (

            <p

              className="

                text-xs

                text-red-600

                mt-1

              "

            >

              {errors.password.message}

            </p>

          )}



          {/* =====================================
              REGISTER BUTTON
          ===================================== */}

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

            {loading

              ? "Creating Account..."

              : "Create Account →"

            }

          </button>



          {/* =====================================
              LOGIN LINK
          ===================================== */}

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

              className="

                text-blood

                font-bold

              "

              to="/login"

            >

              Login

            </Link>

          </p>


        </form>


      </section>


    </div>

  );

}