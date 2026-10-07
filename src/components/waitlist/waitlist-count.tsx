"use client";

import { useEffect, useState } from "react";

export function WaitlistCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/counts")
      .then((res) => res.json())
      .then((data) => setCount(typeof data?.waitlist === "number" ? data.waitlist : null))
      .catch(() => setCount(null));
  }, []);

  return (
    <>
      {count === null
        ? "…"
        : count > 0
          ? `${count.toLocaleString()}${count >= 1000 ? "+" : ""}`
          : "0"}
    </>
  );
}