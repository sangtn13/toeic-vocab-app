function normalizeApiBaseUrl(url) {
  const trimmed = url.replace(/\/+$/, "");
  return trimmed.endsWith("/api/v1") ? trimmed : `${trimmed}/api/v1`;
}

const defaultBackendBaseUrl = "http://127.0.0.1:5050";
const rawBackendBaseUrl =
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  defaultBackendBaseUrl;

if (
  process.env.VERCEL_ENV &&
  !process.env.API_BASE_URL &&
  !process.env.NEXT_PUBLIC_API_URL
) {
  throw new Error(
    "Missing API_BASE_URL. Set it in Vercel Project Settings so /api/v1 rewrites can reach the backend."
  );
}

const backendBaseUrl = normalizeApiBaseUrl(rawBackendBaseUrl);

/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error"]
          }
        : false
  },
  experimental: {
    optimizePackageImports: ["lucide-react"]
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${backendBaseUrl}/:path*`
      }
    ];
  }
};

export default nextConfig;
