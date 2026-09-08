import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Search,
  UsersRound,
  UserPlus,
  Bell,
  Building2,
  CalendarDays,
  MessageSquare,
  User,
  Settings,
  LogOut,
  HeartPulse,
  Menu,
  X,
} from "lucide-react";

const links = [
  ["/dashboard", LayoutDashboard, "Dashboard"],
  ["/find-donors", Search, "Find Donors"],
  ["/donors", UsersRound, "Donor List"],
  ["/add-donor", UserPlus, "Add Donor"],
  ["/requests", Bell, "Blood Requests"],
  ["/blood-banks", Building2, "Blood Banks"],
  ["/camps", CalendarDays, "Camps & Events"],
  ["/messages", MessageSquare, "Messages"],
  ["/profile", User, "My Profile"],
  ["/settings", Settings, "Settings"],
];

export default function Layout({ children }) {

  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] =
    useState(true);


  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/login");

  };


  return (

    <div className="min-h-screen bg-slate-50 flex">


      {/* SIDEBAR */}

      <aside
        className={`

          fixed lg:relative

          z-50

          w-64

          min-h-screen

          bg-white

          border-r

          border-slate-100

          p-5

          transition-all

          duration-300

          ${sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:-ml-64"
          }

        `}
      >


        {/* LOGO */}

        <div className="flex items-center gap-2 text-2xl font-bold mb-10">

          <HeartPulse
            className="text-blood"
            size={38}
          />

          <span>

            <span className="text-blood">

              Blood

            </span>

            Life

          </span>

        </div>



        {/* NAVIGATION */}

        <nav className="space-y-2">


          {links.map(([to, Icon, label]) => (

            <NavLink

              key={label}

              to={to}

              onClick={() => {

                if (window.innerWidth < 1024) {

                  setSidebarOpen(false);

                }

              }}

              className={({ isActive }) =>

                `sidebar-link ${
                  isActive
                    ? "active"
                    : ""
                }`

              }

            >

              <Icon size={20} />

              <span>

                {label}

              </span>


            </NavLink>

          ))}



          {/* LOGOUT */}

          <button

            onClick={handleLogout}

            className="sidebar-link w-full"

          >

            <LogOut size={20} />

            <span>

              Logout

            </span>

          </button>


        </nav>



        {/* BOTTOM CARD */}

        <div className="hero-red text-white rounded-2xl p-5 mt-8 min-h-64 relative overflow-hidden">


          <h3 className="font-bold text-lg">

            Be someone's

            <br />

            lifesaver.

          </h3>


          <p className="text-sm mt-2">

            Donate Blood.

            <br />

            Save Lives.

          </p>


          <HeartPulse

            className="absolute bottom-6 right-8 opacity-90"

            size={95}

          />


        </div>


      </aside>



      {/* MAIN AREA */}

      <main className="flex-1 min-w-0">


        {/* TOP BAR */}

        <div className="h-20 bg-white border-b flex items-center px-6">


          {/* THREE LINE BUTTON */}

          <button

            onClick={() =>

              setSidebarOpen(
                !sidebarOpen
              )

            }

            className="p-2 rounded-lg hover:bg-slate-100"

          >

            {sidebarOpen ? (

              <X size={25} />

            ) : (

              <Menu size={25} />

            )}

          </button>


        </div>



        {/* PAGE CONTENT */}

        {children}


      </main>


    </div>

  );

}