/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Esto permite que el build continúe incluso si hay errores de ESLint
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Esto permite que el build continúe incluso si hay errores de TypeScript
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig