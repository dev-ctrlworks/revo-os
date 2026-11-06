"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInAction, signUpAction } from "@/features/auth/actions";
import type { ActionState } from "@/features/auth/constants";
import { OAuthButtons } from "./oauth-buttons";

const initialState: ActionState = {};

interface AuthFormProps {
  mode: "sign-in" | "sign-up";
}

export function AuthForm({ mode }: AuthFormProps) {
  const isSignUp = mode === "sign-up";
  const action = isSignUp ? signUpAction : signInAction;
  const [state, formAction, pending] = useActionState(action, initialState);
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";
  const authError = searchParams.get("error");

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold text-[var(--plum,#21164C)]">
          {isSignUp ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {isSignUp
            ? "Start building your memory layer."
            : "Sign in to your memory layer."}
        </p>
      </div>

      <OAuthButtons />

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs uppercase tracking-wide text-muted-foreground">
          or
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="next" value={next} />
        {isSignUp && (
          <div className="space-y-1.5">
            <Label htmlFor="displayName">Name</Label>
            <Input
              id="displayName"
              name="displayName"
              type="text"
              autoComplete="name"
              placeholder="Optional"
            />
          </div>
        )}
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete={isSignUp ? "new-password" : "current-password"}
            required
            minLength={isSignUp ? 8 : undefined}
            placeholder={isSignUp ? "At least 8 characters" : "Your password"}
          />
        </div>

        {state.error && (
          <p role="alert" className="text-sm text-destructive">
            {state.error}
          </p>
        )}
        {authError && !state.error && (
          <p role="alert" className="text-sm text-destructive">
            Could not complete sign-in. Please try again.
          </p>
        )}
        {state.success && (
          <p role="status" className="text-sm text-emerald-600">
            {state.success}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending
            ? isSignUp
              ? "Creating account…"
              : "Signing in…"
            : isSignUp
              ? "Create account"
              : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {isSignUp ? "Already have an account? " : "New to Revo OS? "}
        <Link
          href={isSignUp ? "/sign-in" : "/sign-up"}
          className="font-medium text-primary hover:underline"
        >
          {isSignUp ? "Sign in" : "Create an account"}
        </Link>
      </p>
    </div>
  );
}
