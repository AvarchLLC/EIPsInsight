// "use client";
// import { useState } from "react";
// import { useSession } from "next-auth/react";
// import { SubscribeForm } from "@/components/SubscriptionForm";

// export default function SubscriptionButton({ type, id }: {
//     type: "eips" | "ercs" | "rips";
//     id: string
// }) {
//     const { data: session } = useSession();
//     const [showForm, setShowForm] = useState(false);

//     if (showForm) {
//         return <SubscribeForm type={type} id={id} />;
//     }

//     return (
//         <button
//             onClick={async () => {
//                 if (session) {
//                     // Session exists - subscribe directly
//                     try {
//                         await fetch("/api/subscribe", {
//                             method: "POST",
//                             headers: { "Content-Type": "application/json" },
//                             body: JSON.stringify({
//                                 email: session.user!.email, // Non-null assertion
//                                 type,
//                                 id,
//                                 filter: "all"
//                             }),
//                         });
//                         alert(`Subscribed to ${type.toUpperCase()}-${id} updates!`);
//                     } catch (error) {
//                         console.error("Subscription failed:", error);
//                         alert("Subscription failed. Please try again.");
//                     }
//                 } else {
//                     // Show form for non-logged-in users
//                     setShowForm(true);
//                 }
//             }}
//             className="bg-blue-600 text-white px-4 py-2 rounded"
//         >
//             {session ? "Subscribe to Updates" : "Get Email Updates"}
//         </button>
//     );
// }
"use client";
import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";

export default function SubscriptionButton({ type, id }: {
  type: "eips" | "ercs" | "rips";
  id: string;
}) {
  const { data: session } = useSession();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  // Check subscription on mount
  useEffect(() => {
    const check = async () => {
      if (!session?.user?.email) {
        setChecking(false);
        return;
      }

      try {
        const res = await fetch(`/api/subscriptions?email=${session.user.email}`);
        const subs = await res.json();

        const match = subs.find((sub: any) => sub.type === type && sub.id === id);
        setIsSubscribed(!!match);
      } catch (err) {
        console.error("❌ Subscription check failed", err);
      } finally {
        setChecking(false);
      }
    };

    check();
  }, [session, type, id]);

  const subscribe = async () => {
    if (!session) {
      signIn(undefined, { callbackUrl: window.location.href });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          type,
          id,
          filter: "all",
        }),
      });

      if (response.ok) {
        setIsSubscribed(true);
        alert(`Subscribed to ${type.toUpperCase()}-${id} updates!`);
      } else {
        const errorData = await response.json();
        alert(`Subscription failed: ${errorData.error}`);
      }
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const unsubscribe = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session?.user?.email,
          type,
          id,
          filter: "all",
        }),
      });

      if (response.ok) {
        setIsSubscribed(false);
        alert(`Unsubscribed from ${type.toUpperCase()}-${id} updates.`);
      } else {
        const errorData = await response.json();
        alert(`Unsubscribe failed: ${errorData.error}`);
      }
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (checking) return <p className="text-gray-500 text-sm">Checking subscription...</p>;

  return (
    <button
      onClick={isSubscribed ? unsubscribe : subscribe}
      className={`px-4 py-2 rounded text-white ${isSubscribed ? "bg-red-600" : "bg-blue-600"}`}
      disabled={isLoading}
    >
      {isLoading
        ? isSubscribed
          ? "Unsubscribing..."
          : "Subscribing..."
        : isSubscribed
          ? `Unsubscribe from ${type.toUpperCase()}-${id}`
          : `Subscribe to All ${type.toUpperCase()}s`}
    </button>
  );
}
