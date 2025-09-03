"use client";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";


export default function Home() {
  const {
    data: session,
    isPending, // loading state
    error, // error object
    refetch, // refetch the session
  } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-20">
        <span className="text-lg font-semibold">Loading...</span>
      </div>
    );
  }

  return (
    <>
      {session ? (
        <div className="flex flex-col items-center justify-center min-h-screen py-20">
          <h1 className="text-3xl font-bold">Welcome, {session.user?.email}!</h1>
          <p className="mt-4">You are logged in.</p>
          <button
            className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            onClick={() => authClient.signOut()}
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
          <h1 className="text-4xl font-bold mb-4">Welcome to EIPs Insight</h1>
          <p className="text-lg mb-8 text-center px-4">
            Your gateway to exploring and understanding Ethereum Improvement Proposals (EIPs). Dive into the world of Ethereum development with us!
          </p>
          <a
            href="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Get Started
          </a>
        </div>
      )}
    </>
  );
}
