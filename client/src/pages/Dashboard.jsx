import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import api from "../services/api";

import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import DonorTable from "../components/DonorTable";

import {
  Users,
  Heart,
  ShieldCheck,
  HeartHandshake,
  Bell,
  MapPin,
  CalendarDays,
  UserPlus,
  Building2,
  Search,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


const data = [
  { m: "Jan", v: 18 },
  { m: "Feb", v: 25 },
  { m: "Mar", v: 22 },
  { m: "Apr", v: 37 },
  { m: "May", v: 45 },
];


export default function Dashboard() {

  const navigate =
    useNavigate();


  /* =====================================
     LOGGED-IN USER
  ===================================== */

  const loggedInUser =
    JSON.parse(
      localStorage.getItem("user")
    );


  /* =====================================
     DASHBOARD STATISTICS
  ===================================== */

  const [stats, setStats] =
    useState({
      totalDonors: 0,
      availableDonors: 0,
      totalDonations: 0,
    });


  /* =====================================
     ACTIVE BLOOD REQUEST COUNT
  ===================================== */

  const [
    requestCount,
    setRequestCount,
  ] = useState(0);



  /* =====================================
     GET ACTIVE REQUEST COUNT
  ===================================== */

  const getRequestCount =
    async () => {

      try {

        const response =
          await api.get(
            "/requests/count"
          );


        setRequestCount(
          response.data.count
        );

      } catch (error) {

        console.error(
          "Failed to load request count:",
          error
        );

      }

    };



  /* =====================================
     LOAD DASHBOARD DATA
  ===================================== */

  useEffect(() => {

    const getStats =
      async () => {

        try {

          const response =
            await api.get(
              "/donors/stats"
            );


          console.log(
            "Dashboard Stats:",
            response.data
          );


          setStats(
            response.data
          );

        } catch (error) {

          console.error(
            "Failed to load dashboard statistics:",
            error
          );

        }

      };


    getStats();

    getRequestCount();


  }, []);



  /* =====================================
     QUICK ACTIONS
  ===================================== */

  const quickActions = [

    {
      icon: UserPlus,
      text: "Add Donor",
      path: "/add-donor",
    },

    {
      icon: Heart,
      text: "Request Blood",
      path: "/requests",
    },

    {
      icon: Users,
      text: "Find Donors",
      path: "/donors",
    },

    {
      icon: Building2,
      text: "Blood Banks",
      path: "/blood-banks",
    },

  ];



  return (

    <Layout>


      {/* =====================================
          HEADER
      ===================================== */}

      <header className="h-20 bg-white border-b px-6 flex items-center justify-between">



        {/* SEARCH */}

        <div className="hidden md:flex items-center border rounded-xl px-4 py-3 w-96">

          <Search size={18} />


          <input
            className="ml-2 outline-none w-full"
            placeholder="Search donors by name, blood group, location..."

            onKeyDown={(e) => {

              if (e.key === "Enter") {

                navigate(
                  "/donors"
                );

              }

            }}

          />

        </div>



        {/* LOGGED-IN USER */}

        <div className="flex gap-4 items-center">

          <Bell />


          <div className="font-semibold">

            {loggedInUser?.name ||
              "User"}

            <br />


            <small className="text-slate-500">

              {loggedInUser?.role ||
                "Donor"}

            </small>

          </div>

        </div>

      </header>



      {/* =====================================
          MAIN CONTENT
      ===================================== */}

      <div className="p-6 max-w-[1700px]">


        {/* WELCOME */}

        <h1 className="text-2xl font-bold">

          Hello,

          {" "}

          {loggedInUser?.name ||
            "User"}

          {" "}

          👋

        </h1>


        <p className="text-slate-500 mb-6">

          Every drop counts. Be a hero, save a life.

        </p>



        {/* =====================================
            STAT CARDS
        ===================================== */}

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">


          <StatCard
            icon={Users}
            label="Total Donors"
            value={stats.totalDonors}
            delta="Registered donors"
          />


          <StatCard
            icon={Heart}
            label="Available Donors"
            value={stats.availableDonors}
            delta="Ready to donate"
          />


          <StatCard
            icon={ShieldCheck}
            label="Total Donations"
            value={stats.totalDonations}
            delta="Successful donations"
            color="text-emerald-600"
          />


          <StatCard
            icon={HeartHandshake}
            label="Lives Impacted"
            value={stats.totalDonations}
            delta="Based on donations"
            color="text-indigo-600"
          />


        </div>



        <div className="grid xl:grid-cols-[1fr_320px] gap-5 mt-5">


          {/* =====================================
              LEFT SIDE
          ===================================== */}

          <div className="space-y-5">


            <DonorTable />



            {/* FIND DONORS */}

            <div className="card p-5 grid md:grid-cols-[1fr_1.4fr] gap-4 items-center">


              <div>

                <h2 className="text-xl font-bold">

                  Find Blood Donors Near You

                </h2>


                <p className="text-slate-500 mt-2">

                  Search by location and blood group
                  to find eligible donors quickly.

                </p>


                <button
                  onClick={() =>
                    navigate("/donors")
                  }

                  className="btn-red mt-4"
                >

                  Search Donors

                </button>

              </div>



              {/* CHART */}

              <div className="h-48">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <LineChart
                    data={data}
                  >

                    <XAxis
                      dataKey="m"
                    />


                    <YAxis />


                    <Tooltip />


                    <Line
                      type="monotone"
                      dataKey="v"
                      stroke="#d71920"
                      strokeWidth={3}
                    />

                  </LineChart>

                </ResponsiveContainer>

              </div>


            </div>


          </div>



          {/* =====================================
              RIGHT SIDE
          ===================================== */}

          <aside className="space-y-5">


            {/* PROFILE CARD */}

            <div className="hero-red rounded-2xl text-white p-7 text-center">


              <div className="w-24 h-24 rounded-full bg-white/30 mx-auto mb-4 grid place-items-center text-5xl">

                👨🏻

              </div>


              <h2 className="text-2xl font-bold">

                {loggedInUser?.name ||
                  "User"}


                <span className="text-sm bg-white/20 p-2 rounded ml-2">

                  {loggedInUser?.bloodGroup ||
                    "Not Specified"}

                </span>

              </h2>


              <p className="mt-2">

                BloodLife Donor

              </p>


              <p className="mt-2 flex justify-center gap-1">

                <MapPin
                  size={18}
                />


                {loggedInUser?.location ||
                  "Location not specified"}

              </p>



              <div className="bg-white text-slate-800 rounded-xl mt-6 p-4 grid grid-cols-3">


                {/* DONATIONS */}

                <div>

                  🩸


                  <b className="block">

                    {loggedInUser?.donations ||
                      0}

                  </b>


                  <small>

                    Donations

                  </small>

                </div>



                {/* POINTS */}

                <div>

                  ⭐


                  <b className="block">

                    {loggedInUser?.points ||
                      0}

                  </b>


                  <small>

                    Points

                  </small>

                </div>



                {/* STATUS */}

                <div>

                  🛡️


                  <b className="block">

                    {loggedInUser?.isAvailable
                      ? "Available"
                      : "Unavailable"}

                  </b>


                  <small>

                    Donor

                  </small>

                </div>


              </div>


            </div>



            {/* =====================================
                QUICK ACTIONS
            ===================================== */}

            <div className="card p-5">


              <h3 className="font-bold">

                Quick Actions

              </h3>


              <div className="grid grid-cols-2 gap-3 mt-4">


                {quickActions.map(
                  (action) => {

                    const Icon =
                      action.icon;


                    return (

                      <button

                        key={action.text}

                        onClick={() =>
                          navigate(
                            action.path
                          )
                        }

                        className="relative border rounded-xl p-4 text-sm flex flex-col gap-2 items-center hover:bg-slate-50"
                      >


                        {/* REQUEST COUNT BADGE */}

                        {action.text ===
                          "Request Blood" &&

                          requestCount > 0 && (

                            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">

                              {requestCount}

                            </span>

                          )}


                        <Icon
                          className="text-blood"
                        />


                        {action.text}


                      </button>

                    );

                  }
                )}


              </div>


            </div>



            {/* =====================================
                UPCOMING CAMP
            ===================================== */}

            <div className="card p-5">


              <div className="flex justify-between">


                <h3 className="font-bold">

                  Upcoming Camp

                </h3>


                <button

                  onClick={() =>
                    navigate("/camps")
                  }

                  className="text-blood"
                >

                  View All

                </button>


              </div>



              <div className="mt-5">


                <b>

                  Mega Blood Donation Camp

                </b>


                <p className="text-sm text-slate-500 mt-2 flex gap-1">

                  <MapPin
                    size={15}
                  />

                  Nandyal, Andhra Pradesh

                </p>


                <p className="text-sm text-slate-500 flex gap-1">

                  <CalendarDays
                    size={15}
                  />

                  25 May 2026, 10:00 AM

                </p>


                <button

                  onClick={() =>
                    navigate("/camps")
                  }

                  className="btn-red w-full mt-4"
                >

                  Register

                </button>


              </div>


            </div>


          </aside>


        </div>


      </div>


    </Layout>

  );

}