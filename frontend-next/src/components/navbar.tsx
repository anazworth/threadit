"use client";

import axios from "axios";
import { use, useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function Navbar() {
  const [loginFormDisplay, setLoginFormDisplay] = useState(false);

  let value = localStorage.getItem("username");
  const [username, setUsername] = useState(value ? value : "");

  const [loggedIn, setLoggedIn] = useState(value ? true : false);

  function handleLogin() {
    setLoginFormDisplay(true);
  }

  async function onSubmit(event: any) {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;

    axios("http://localhost:8080/api/v1/users/login?username", {
      method: "POST",
      data: {
        username: username,
        password: password,
      },
    })
      .then((res) => {
        //set cookie
        Cookies.set("jwt", res.data.jwt, { expires: 1 });
        Cookies.set("username", res.data.username, { expires: 1 });

        // @TODO: Add state for login

        window.localStorage.setItem("jwt", res.data.jwt);
        window.localStorage.setItem("username", res.data.username);
        sessionStorage.setItem("username", res.data.username);

        setLoggedIn(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function loginform() {
    return (
      <form
        className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
        onSubmit={onSubmit}
      >
        <input
          className="rounded-md py-2 px-4 outline"
          placeholder="Username"
          id="username"
          itemID="username"
          type="text"
        />
        <input
          className="rounded-md py-2 px-4 outline"
          id="password"
          itemID="password"
          placeholder="Password"
        />
        <button
          className="rounded-3xl py-2 sm:px-12 bg-orange-400"
          type="submit"
        >
          Login
        </button>
        <button className="rounded-3xl py-2 sm:px-12 bg-blue-400">
          Register
        </button>
      </form>
    );
  }

  return (
    <div className="flex flex-row w-full justify-between p-2 bg-white">
      <div className="flex flex-row ">
        <button className="text-2xl">Threadit</button>
      </div>
      <div className="flex flex-col outline">
        {loggedIn && <div className="flex flex-row">hello o</div>}
        <div>karma</div>
        <div>{username}</div>
      </div>
      <div className="flex flex-row">
        {loginFormDisplay && loginform()}

        {!loginFormDisplay && (
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
