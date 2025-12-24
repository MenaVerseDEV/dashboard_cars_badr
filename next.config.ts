import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["menaverse.b-cdn.net", "alkhedr.b-cdn.net", "albadr.b-cdn.net"],
  },
};

export default withNextIntl(nextConfig);
