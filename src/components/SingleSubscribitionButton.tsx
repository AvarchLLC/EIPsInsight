// "use client";
// import { useState } from "react";
// import { useSession } from "next-auth/react";

// interface SingleSubscriptionButtonProps {
//   type: "eips" | "ercs" | "rips";
//   id: string;
// }

// export default function SingleSubscriptionButton({
//   type,
//   id,
// }: SingleSubscriptionButtonProps) {
//   const { data: session } = useSession();
//   const [showForm, setShowForm] = useState(false);
//   const [isSubscribed, setIsSubscribed] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubscribe = async () => {
//     if (!session) {
//       setShowForm(true);
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const response = await fetch("/api/subscribe", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           email: session.user?.email,
//           type,
//           id,
//           filter: "all", // default to 'all' for now
//         }),
//       });

//       if (response.ok) {
//         setIsSubscribed(true);
//       } else {
//         const errorData = await response.json();
//         console.error("Subscription failed:", errorData);
//         alert(`Subscription failed: ${errorData.error}`);
//       }
//     } catch (error) {
//       console.error("Network error:", error);
//       alert("Network error. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleGuestSubscribe = async (email: string) => {
//     setIsLoading(true);
//     try {
//       const response = await fetch("/api/subscribe", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           email,
//           type,
//           id,
//           filter: "all",
//         }),
//       });

//       if (response.ok) {
//         setIsSubscribed(true);
//         setShowForm(false);
//       } else {
//         const errorData = await response.json();
//         console.error("Subscription failed:", errorData);
//         alert(`Subscription failed: ${errorData.error}`);
//       }
//     } catch (error) {
//       console.error("Network error:", error);
//       alert("Network error. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (isSubscribed) {
//     return (
//       <div className="bg-green-100 text-green-800 p-2 rounded">
//         Subscribed to updates!
//       </div>
//     );
//   }

//   if (showForm) {
//     return (
//       <div className="space-y-2">
//         <input
//           type="email"
//           placeholder="Your email"
//           className="border rounded p-2 w-full"
//           id="guest-email"
//         />
//         <button
//           className="bg-blue-500 text-white p-2 rounded w-full"
//           onClick={() => {
//             const emailInput = document.getElementById("guest-email") as HTMLInputElement;
//             handleGuestSubscribe(emailInput.value);
//           }}
//           disabled={isLoading}
//         >
//           {isLoading ? "Subscribing..." : "Subscribe"}
//         </button>
//         <button
//           className="bg-gray-500 text-white p-2 rounded w-full"
//           onClick={() => setShowForm(false)}
//           disabled={isLoading}
//         >
//           Cancel
//         </button>
//       </div>
//     );
//   }

//   return (
//     <button
//       className="bg-blue-500 text-white p-2 rounded"
//       onClick={handleSubscribe}
//       disabled={isLoading}
//     >
//       {isLoading ? "Subscribing..." : "Subscribe to Updates"}
//     </button>
//   );
// }
"use client";
import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";

interface SingleSubscriptionButtonProps {
  type: "eips" | "ercs" | "rips";
  id: string;
}

export default function SingleSubscriptionButton({ type, id }: SingleSubscriptionButtonProps) {
  const { data: session } = useSession();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkExistingSubscription = async () => {
      if (!session?.user?.email) return setChecking(false);

      try {
        const res = await fetch(`/api/subscriptions?email=${session.user.email}`);
        const data = await res.json();

        const match = data.find(
          (sub: any) => sub.type === type && sub.id === id
        );

        if (match) setIsSubscribed(true);
      } catch (err) {
        console.error("❌ Failed to check existing subscription", err);
      } finally {
        setChecking(false);
      }
    };

    checkExistingSubscription();
  }, [session, type, id]);

  const handleSubscribe = async () => {
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
          email: session.user?.email,
          type,
          id,
          filter: "all",
        }),
      });

      if (response.ok) {
        setIsSubscribed(true);
      } else {
        const errorData = await response.json();
        alert(`Subscription failed: ${errorData.error}`);
      }
    } catch (error) {
      alert("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
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
      } else {
        const errorData = await response.json();
        alert(`Unsubscribe failed: ${errorData.error}`);
      }
    } catch (error) {
      alert("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (checking) return <div className="text-sm text-gray-500">Checking...</div>;

  return (
    <button
      className={`${isSubscribed ? "bg-red-500" : "bg-blue-500"} text-white px-3 py-2 rounded text-sm`}
      onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}
      disabled={isLoading}
    >
      {isLoading
        ? isSubscribed
          ? "Unsubscribing..."
          : "Subscribing..."
        : isSubscribed
          ? `Unsubscribe from ${type.toUpperCase()}-${id}`
          : `Subscribe to ${type.toUpperCase()}-${id}`}
    </button>
  );
}
