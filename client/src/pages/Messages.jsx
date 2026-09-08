import React from "react";
import Layout from "../components/Layout";

export default function Messages() {
  return (
    <Layout>
      <div className="p-8">
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-slate-500 mt-2">
          View your messages and notifications.
        </p>
      </div>
    </Layout>
  );
}