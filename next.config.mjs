/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/_error",
        destination: "/map.html",
        permanent: true,
      },
      {
        source: "/_not-found",
        destination: "/map.html",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
