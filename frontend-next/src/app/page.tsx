import Navbar from "@/components/navbar";
import { useState } from "react";

async function getPosts() {
  const res = await fetch("http://127.0.0.1:8888/api/v1/read/1");
  const json = await res.json();
  return json;
}

export default async function Home() {
  const post = await getPosts();

  return (
    <div>
      <main className="flex min-h-screen flex-col items-center justify-between bg-slate-300">
        <div>
          <div>
            <p>{post.title}</p>
            <p>{post.content}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
