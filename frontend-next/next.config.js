/** @type {import('next').NextConfig} */
const nextConfig = {
  source: "/api/:path*",
  headers: [
    { key: "Access-Control-Allow-Origin", value: "*" },
    {
      key: "Access-Control-Allow-Methods",
      value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
    },
    {
      key: "Access-Control-Allow-Headers",
      value: "X-Requested-With, Content-Type, Authorization",
    },
  ],
};

module.exports = nextConfig;
