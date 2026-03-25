// "use client";
// import { useState } from "react";

// interface SubscribeFormProps {
//   type?: "eips" | "ercs" | "rips";
//   id?: string | number;
//   filter?: "all" | "status";
// }

// export function SubscribeForm({ type, id = "", filter }: SubscribeFormProps) {
//   // Assign default values to local constants first:
//   const initType: "eips" | "ercs" | "rips" = type ?? "eips";
//   const initFilter: "all" | "status" = filter ?? "all";

//   const [email, setEmail] = useState("");
//   const [selectedType, setSelectedType] = useState(initType);
//   const [selectedId, setSelectedId] = useState(id?.toString() ?? "");
//   const [selectedFilter, setSelectedFilter] = useState(initFilter);

//   async function subscribe() {
//     await fetch("/api/subscribe", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         email,
//         type: selectedType,
//         id: selectedId,
//         filter: selectedFilter,
//       }),
//     });
//     alert("Subscribed successfully!");
//     console.log("📬 Inserting subscription:", {
//       email,
//       type: selectedType,
//       id: selectedId,
//       filter: selectedFilter,
//     });
//   }

//   return (
//     <form
//       onSubmit={async (e) => {
//         e.preventDefault(); // Prevent page refresh or navigation
//         await subscribe();
//       }}
//       className="space-y-4 p-4 bg-white rounded-xl shadow-md"
//     >
//       <input
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         placeholder="Email"
//         className="w-full p-2 border rounded"
//       />
//       <select
//         value={selectedType}
//         onChange={(e) =>
//           setSelectedType(e.target.value as "eips" | "ercs" | "rips")
//         }
//         className="w-full p-2 border rounded"
//       >
//         <option value="eips">EIP</option>
//         <option value="ercs">ERC</option>
//         <option value="rips">RIP</option>
//       </select>
//       <input
//         value={selectedId}
//         onChange={(e) => setSelectedId(e.target.value)}
//         placeholder="ID (e.g. 721 or 'all')"
//         className="w-full p-2 border rounded"
//       />
//       <select
//         value={selectedFilter}
//         onChange={(e) =>
//           setSelectedFilter(e.target.value as "all" | "status")
//         }
//         className="w-full p-2 border rounded"
//       >
//         <option value="all">All Changes</option>
//         <option value="status">Status Only</option>
//       </select>
//       <button
//         type="submit"
//         className="w-full bg-blue-600 text-white p-2 rounded"
//       >
//         Subscribe
//       </button>
//     </form>
//   );
// }


"use client";
import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";

interface SubscribeFormProps {
  type?: "eips" | "ercs" | "rips";
  id?: string | number;
  filter?: "all" | "status" | "content";
}

export function SubscribeForm({ type = "eips", id = "", filter = "all" }: SubscribeFormProps) {
  const { data: session } = useSession();
  const [selectedType, setSelectedType] = useState(type);
  const [selectedId, setSelectedId] = useState(id.toString());
  const [selectedFilter, setSelectedFilter] = useState(filter);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSelectedType(type);
    setSelectedId(id.toString());
    setSelectedFilter(filter);
  }, [type, id, filter]);

  async function subscribe() {
    if (!session?.user?.email) {
      signIn(undefined, { callbackUrl: window.location.href });
      return;
    }

    setLoading(true);
    await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: selectedType,
        id: selectedId,
        filter: selectedFilter,
      }),
    });

    setLoading(false);
    alert("Subscribed successfully!");
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); subscribe(); }} className="space-y-4 p-4 bg-white rounded-xl shadow-md">
      <select value={selectedType} onChange={(e) => setSelectedType(e.target.value as any)} className="w-full p-2 border rounded">
        <option value="eips">EIP</option>
        <option value="ercs">ERC</option>
        <option value="rips">RIP</option>
      </select>

      <input
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
        placeholder="ID (e.g. 721 or 'all')"
        className="w-full p-2 border rounded"
      />

      <select
        value={selectedFilter}
        onChange={(e) => setSelectedFilter(e.target.value as "all" | "status" | "content")}
        className="w-full p-2 border rounded"
      >
        <option value="all">All Changes</option>
        <option value="status">Status Only</option>
        <option value="content">Content Only</option>
      </select>

      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded" disabled={loading}>
        {loading ? "Subscribing..." : session?.user?.email ? "Subscribe" : "Sign in to subscribe"}
      </button>
    </form>
  );
}
