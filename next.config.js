/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    "/basket/**/*": [
      "./lib/generated/prisma/**",
      "./node_modules/.prisma/client/**",
    ],
    "/api/**/*": [
      "./lib/generated/prisma/**",
      "./node_modules/.prisma/client/**",
    ],
  },
};

module.exports = nextConfig;
