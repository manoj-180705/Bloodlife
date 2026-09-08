import React from "react";
import Layout from "../components/Layout";

export default function Camps() {
  return (
    <Layout>
      <div className="p-8">
        <h1 className="text-3xl font-bold">Camps & Events</h1>
        <p className="text-slate-500 mt-2">
          View upcoming blood donation camps and events.
        </p>
      </div>
    </Layout>
  );
}