import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create your Revo OS account and start building your memory layer.",
};

export default function SignUpPage() {
  return (
    <Suspense fallback={null}>
      <AuthForm mode="sign-up" />
    </Suspense>
  );
}
