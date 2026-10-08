"use client";

import { useState } from "react";
import { MessageCircleHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function FeedbackButton() {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [page, setPage] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [open, setOpen] = useState(false);

  function openDialog() {
    setPage(
      typeof window !== "undefined"
        ? window.location.pathname + window.location.search
        : ""
    );
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) {
      setError("Please write a message.");
      return;
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address (optional).");
      return;
    }
    setError("");
    setStatus("submitting");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          email: email.trim() || null,
          page,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Something went wrong. Please try again.");
        setStatus("idle");
        return;
      }
      setStatus("done");
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("idle");
    }
  }

  function closeAndReset() {
    setOpen(false);
    setMessage("");
    setEmail("");
    setError("");
    setStatus("idle");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            onClick={openDialog}
            className="fixed bottom-5 right-5 z-40 flex items-center gap-1.5 rounded-full shadow-[0_12px_32px_-12px_color-mix(in_oklab,var(--aurora-2)_55%,transparent)]"
          >
            <MessageCircleHeart className="size-4" />
            Feedback
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        {status === "done" ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-gradient">Thank you!</DialogTitle>
              <DialogDescription>
                Your feedback has been sent. It goes straight to the Revo OS team.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={closeAndReset}>Done</Button>
            </DialogFooter>
          </>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <DialogHeader>
              <DialogTitle>Help shape Revo OS</DialogTitle>
              <DialogDescription>
                What worked? What didn&apos;t? One line is plenty.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-1.5">
              <Label htmlFor="feedback-message">Your feedback</Label>
              <Textarea
                id="feedback-message"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (error) setError("");
                }}
                placeholder="e.g. I loved the memory graph, but search felt slow…"
                disabled={status === "submitting"}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="feedback-email">Email (optional)</Label>
              <Input
                id="feedback-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                placeholder="you@example.com"
                disabled={status === "submitting"}
              />
            </div>
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
            <DialogFooter showCloseButton>
              <Button type="submit" disabled={status === "submitting"}>
                {status === "submitting" ? "Sending…" : "Send feedback"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}