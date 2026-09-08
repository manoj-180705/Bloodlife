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
  Lock,
  Mail,
} from "lucide-react";

import axios from "axios";


const schema = z.object({
  email: z
    .string()
    .email("Please enter a valid email"),

  password: z
    .string()
    .min(
      6,
      "Password must be at least 6 characters"
    ),
});


export default function Login() {

  const nav = useNavigate();


  const [loginError, setLoginError] =
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


  const submit =
    async (data) => {

      try {

        setLoading(true);

        setLoginError("");


        const response =
          await axios.post(

            `${
              import.meta.env.VITE_API_URL ||
              "http://localhost:5000/api"
            }/auth/login`,

            data

          );


        console.log(
          "Login response:",
          response.data
        );


        /*
        =================================
        SAVE LOGIN TOKEN
        =================================
        */

        localStorage.setItem(

          "token",

          response.data.token

        );


        /*
        =================================
        SAVE LOGGED-IN USER
        =================================
        */

        localStorage.setItem(

          "user",

          JSON.stringify(
            response.data.user
          )

        );


        /*
        =================================
        REDIRECT ONLY AFTER SUCCESS
        =================================
        */

        nav(
          "/dashboard"
        );


      } catch (error) {

        console.error(
          "Login error:",
          error
        );


        /*
        =================================
        SHOW BACKEND ERROR
        =================================
        */

        setLoginError(

          error.response
            ?.data
            ?.message ||

          "Login failed. Please check your email and password."

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


      {/* LEFT SIDE */}

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

          Every Drop
          <br />

          Counts.

        </h1>


        <p
          className="
            text-xl
            mt-6
          "
        >

          Donate Blood,

          <br />

          Save Lives.

        </p>


        <div
          className="
            blood-drop
            mt-20
          "
        />

      </section>



      {/* RIGHT SIDE */}

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
            p-10
          "

        >


          {/* LOGO */}

          <div
            className="
              text-center
              mb-8
            "
          >

            <HeartPulse
              className="
                mx-auto
                text-blood
              "
              size={68}
            />


            <h1
              className="
                text-4xl
                font-bold
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


            <p
              className="
                text-slate-500
              "
            >

              Save a Life. Be a Hero.

            </p>


            <h2
              className="
                text-2xl
                font-bold
                mt-8
              "
            >

              Welcome Back!

            </h2>


            <p
              className="
                text-slate-500
              "
            >

              Login to continue your journey
              of saving lives.

            </p>

          </div>



          {/* LOGIN ERROR */}

          {loginError && (

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

              {loginError}

            </div>

          )}



          {/* EMAIL */}

          <label>

            Email

          </label>


          <div
            className="
              relative
              mt-2
              mb-1
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

              {...register(
                "email"
              )}

              placeholder="
                Enter your email
              "

            />

          </div>


          {errors.email && (

            <p
              className="
                text-xs
                text-blood
              "
            >

              {errors.email.message}

            </p>

          )}



          {/* PASSWORD */}

          <label
            className="
              block
              mt-5
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

              {...register(
                "password"
              )}

              placeholder="
                Enter your password
              "

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



          {/* LOGIN BUTTON */}

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

              ? "Logging in..."

              : "Login →"

            }

          </button>



          {/* REGISTER */}

          <p
            className="
              text-center
              mt-7
              text-slate-600
            "
          >

            Don't have an account?

            {" "}

            <Link

              className="
                text-blood
                font-bold
              "

              to="/register"

            >

              Register Now

            </Link>

          </p>


        </form>


      </section>


    </div>

  );

}