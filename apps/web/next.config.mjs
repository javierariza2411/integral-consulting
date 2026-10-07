// El navegador llama a /backend/* (mismo dominio) y Next lo reenvía a la API de Railway.
// Así no hay problemas de CORS. API_URL debe estar definida ANTES del build.
const API = (process.env.API_URL || 'http://localhost:4000').replace(/\/$/, '');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [{ source: '/backend/:path*', destination: `${API}/:path*` }];
  },
};
export default nextConfig;
