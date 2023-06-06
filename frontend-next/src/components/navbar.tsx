"use client";

import { useState } from "react";

export default function Navbar() {
  const [login, setLogin] = useState(false);

  function handleLogin() {
    setLogin(true);
  }

  return (
    <div className="flex flex-row w-full justify-between p-2 bg-white">
      <div className="flex flex-row ">
        <button className="text-2xl">Threadit</button>
      </div>
      <div className="flex flex-row">
        {login && (
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <input
              className="rounded-md py-2 px-4 outline"
              placeholder="Username"
            />
            <input
              className="rounded-md py-2 px-4 outline"
              placeholder="Password"
            />
            <button className="rounded-md py-2 px-4 bg-orange-400">
              Login
            </button>
            <button className="rounded-md py-2 px-4 bg-blue-400">
              Register
            </button>
          </div>
        )}

        {!login && (
          <button
            className="rounded-md py-2 px-4 bg-orange-400"
            onClick={handleLogin}
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
}
