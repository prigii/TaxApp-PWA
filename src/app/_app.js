import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

// Initialize the Supabase client
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const {
      data: { session },
    } = supabase.auth.getSession();

    // Redirect if user is authenticated or not
    if (router.pathname === "/admin" && !session) {
      router.push("/auth");
    } else if (router.pathname === "/auth" && session) {
      router.push("/admin");
    }

    // Listen to auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN") {
          router.push("/admin");
        } else if (event === "SIGNED_OUT") {
          router.push("/auth");
        }
      }
    );

    setLoading(false);

    // Cleanup auth listener
    return () => {
      authListener?.unsubscribe();
    };
  }, [router]);

  if (loading) return <div>Loading...</div>;

  return <Component {...pageProps} />;
}

export default MyApp;
