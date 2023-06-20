import Navbar from "@/components/navbar";
import { useState } from "react";
import router from "next/router";

async function getPosts() {
  const res = await fetch("http://127.0.0.1:8084/api/v1/feed/new?page=" + router.query.slug);
  const json = await res.json();
  return json;
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <div>
      <main className="flex min-h-screen flex-col items-center justify-between bg-slate-300">
        <div>
          <div>
          {router.query.slug}
          </div>
        </div>
      </main>
    </div>
  );
}
