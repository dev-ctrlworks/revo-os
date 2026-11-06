import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Revo OS memory layer.",
};

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <AuthForm mode="sign-in" />
    </Suspense>
  );
}
