const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development", // Disable PWA in development mode
  register: true, // Automatically register the service worker
  skipWaiting: true, // Skip the waiting phase and activate the new service worker immediately
});

module.exports = withPWA({
  reactStrictMode: true, // Enable React Strict Mode for highlighting potential problems
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL, // Ensure these environment variables are set
    NEXT_PUBLIC_SUPABASE_KEY: process.env.NEXT_PUBLIC_SUPABASE_KEY, // Ensure these environment variables are set
  },
});
