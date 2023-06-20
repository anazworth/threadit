import Navbar from "@/components/navbar";
import { useEffect, useState } from "react";

async function getVotes(postId: number) {
  const res = await fetch("http://0.0.0.0:8083/api/v1/votes/" + postId, { cache: "no-cache" });
  return await res.json();
}

async function getPosts() {
  const res = await fetch("http://0.0.0.0:8084/api/v1/feed/new", { cache: "no-cache" });
  const json = await res.json();
  // Convert date to hours ago
  json.map(async (post: any) => {

    const now = new Date();
    const created = new Date(post.created * 1000);
    const diff = now.getTime() - created.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));
    const seconds = Math.floor(diff / 1000);
    if (days > 0) {
      post.created = days + " days ago";
    } else if (hours > 0) {
      post.created = hours + " hours ago";
    } else if (minutes > 0) {
      post.created = minutes + " minutes ago";
    } else {
      post.created = seconds + " seconds ago";
    }
  });

  // Get votes

  for (let post of json) {
    post.votes = await getVotes(post.postId);
    console.log(post);
  }
  return json;
}

export default async function Home() {
  const post = await getPosts();

  return (
    <div>
      <main className="flex min-h-screen flex-col justify-between bg-slate-200">
        <div className="flex flex-col justify-center items-center">
          <h1>New</h1>
          <div className="space-y-8">
            {post.map((post: any) => (
              <div key={post.postId} className="flex flex-row bg-slate-50 hover:outline outline-1 outline-black">
                <div className="flex flex-col text-slate-800 bg-slate-200/40 p-2 text-center">
                  <div>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M17.6569 16.2427L19.0711 14.8285L12.0001 7.75739L4.92896 14.8285L6.34317 16.2427L12.0001 10.5858L17.6569 16.2427Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <h3>{post.votes}</h3>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.34317 7.75732L4.92896 9.17154L12 16.2426L19.0711 9.17157L17.6569 7.75735L12 13.4142L6.34317 7.75732Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <div className="flex flex-col justify-evenly max-w-xs sm:max-w-xl p-4">
                  <h2 className="text-sm text-black font-bold">t/{post.topic}</h2>
                  <h1 className="text-xl text-black font-semibold">
                    {post.title}
                  </h1>
                  <p className=" flex text-sm text-black font-light truncate break-words">{post.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main >
    </div >
  );
}
