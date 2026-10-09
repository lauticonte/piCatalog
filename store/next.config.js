const { execSync } = require('child_process')
const { version } = require('./package.json')

// Versión visible en la UI: la del package.json más el commit del build.
// En Vercel viene por env; en local se le pregunta a git.
function commitCorto() {
  if (process.env.VERCEL_GIT_COMMIT_SHA) return process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 7)
  try {
    return execSync('git rev-parse --short HEAD').toString().trim()
  } catch {
    return 'dev'
  }
}

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION: version,
    NEXT_PUBLIC_COMMIT_SHA: commitCorto(),
  },
  reactStrictMode: true,
  // PostHog llega a través de la propia tienda (/ingest): los bloqueadores de anuncios
  // cortan los pedidos directos a posthog.com. skipTrailingSlashRedirect lo pide su API.
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      { source: '/ingest/static/:path*', destination: 'https://us-assets.i.posthog.com/static/:path*' },
      { source: '/ingest/:path*', destination: 'https://us.i.posthog.com/:path*' },
    ]
  },
  swcMinify: true,
  experimental: {
    serverActions: true,
  },
  images: {
    loader: 'custom',
    loaderFile: './lib/cloudinary-loader.ts',
    // Menos anchos posibles = más visitas que piden la misma URL y la encuentran en la
    // caché de Cloudinary (un ancho nuevo tarda ~0,5 s la primera vez).
    deviceSizes: [640, 828, 1080, 1200, 1920],
  },
}

module.exports = withPWA(nextConfig)
