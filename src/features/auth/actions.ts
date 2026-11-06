"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { logError } from "@/lib/log";
import {
  deleteAccountSchema,
  signInSchema,
  signUpSchema,
  updateProfileSchema,
} from "./schema";
import { safeRedirectTarget, type ActionState } from "./constants";

const FALLBACK_URL = "http://localhost:3000";

function appUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? FALLBACK_URL;
}

export async function signInAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    return { error: "Incorrect email or password." };
  }

  const next = safeRedirectTarget(formData.get("next"));
  revalidatePath("/", "layout");
  redirect(next);
}

export async function signUpAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = signUpSchema.safeParse({
    displayName: formData.get("displayName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${appUrl()}/auth/callback`,
      data: parsed.data.displayName
        ? { display_name: parsed.data.displayName }
        : undefined,
    },
  });

  if (error) {
    return { error: error.message };
  }

  // When email confirmation is enabled Supabase returns no session.
  if (!data.session) {
    return {
      success: "Check your email to confirm your account, then sign in.",
    };
  }

  const next = safeRedirectTarget(formData.get("next"));
  revalidatePath("/", "layout");
  redirect(next);
}

export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/sign-in");
}

export async function updateProfileAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = updateProfileSchema.safeParse({
    displayName: formData.get("displayName"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const displayName = parsed.data.displayName;
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ display_name: displayName || null })
    .eq("id", user.id);
  if (profileError) {
    logError("auth.updateProfile", "profile update failed", profileError);
    return { error: "Could not update your profile." };
  }

  const { error: authError } = await supabase.auth.updateUser({
    data: { display_name: displayName || null },
  });
  if (authError) {
    logError("auth.updateProfile", "auth metadata update failed", authError);
  }

  revalidatePath("/settings");
  return { success: "Profile updated." };
}

export async function deleteAccountAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = deleteAccountSchema.safeParse({
    confirmation: formData.get("confirmation"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  // Remove stored files first (service role), then the auth user. Deleting the
  // user cascades to all owned rows via foreign keys.
  const admin = createAdminClient();
  try {
    const { data: files } = await admin
      .from("memory_files")
      .select("storage_path")
      .eq("user_id", user.id);
    if (files && files.length > 0) {
      await admin.storage.from("memories").remove(files.map((f) => f.storage_path));
    }
  } catch (error) {
    logError("auth.deleteAccount", "storage cleanup failed", error);
  }

  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) {
    logError("auth.deleteAccount", "user deletion failed", error);
    return { error: "Could not delete your account. Please try again." };
  }

  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
