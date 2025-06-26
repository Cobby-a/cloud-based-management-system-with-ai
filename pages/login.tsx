import React from "react";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

function login(){

  const { data: session, status } = useSession();

  const router=useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status]);

  if (status === "loading") return null;

  if (status === "authenticated") return null;

    return(
        <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 md:p-10 w-full max-w-md text-center">
        <h1 className="text-2xl font-semibold mb-4 text-gray-800">Welcome to Cloud Manager</h1>
        <p className="mb-6 text-gray-600">Please sign in with Google to continue</p>
        <button
          onClick={() => signIn("google")}
          className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow transition w-full"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21.35 11.1h-9.36v2.92h5.44c-.24 1.44-1.51 4.23-5.44 4.23-3.27 0-5.95-2.71-5.95-6.07s2.68-6.07 5.95-6.07c1.86 0 3.11.79 3.83 1.48l2.62-2.53C17.36 3.95 15.12 3 12.41 3 6.93 3 2.64 7.5 2.64 12s4.29 9 9.77 9c5.65 0 9.36-3.96 9.36-9 0-.6-.07-1.16-.18-1.9z"/>
          </svg>
          Sign in with Google
        </button>
      </div>
    </div>

    )
}

export default login