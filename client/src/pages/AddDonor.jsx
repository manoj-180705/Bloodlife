import React from "react";
import Layout from "../components/Layout";

export default function AddDonor() {
  return (
    <Layout>
      <div className="p-8">
        <h1 className="text-3xl font-bold">Add Donor</h1>
        <p className="text-slate-500 mt-2">
          Add a new blood donor to BloodLife.
        </p>
      </div>
    </Layout>
  );
}