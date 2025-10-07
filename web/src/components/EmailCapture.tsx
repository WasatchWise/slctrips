"use client";
import { useState } from "react";

export default function EmailCapture({ onSuccess }: { onSuccess?: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/email/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, source: "web" }),
      });
      if (res.ok) {
        setStatus("success");
        onSuccess?.();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return <div className="p-4 bg-emerald-50 text-emerald-700 rounded-md">Thanks! Check your inbox.</div>;
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <input
        type="text"
        placeholder="Your name"
        className="rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email address"
        required
        className="rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        type="submit"
        className="rounded-md bg-[#f59e0b] text-white font-semibold px-4 py-2 hover:opacity-95 disabled:opacity-70"
        disabled={status === "loading"}
      >
        {status === "loading" ? "Submitting..." : "Get the Free TripKit"}
      </button>
    </form>
  );
}


