import type { Metadata } from "next";
import { accountFromUser, requireUser } from "@/features/auth/session";
import { SettingsView } from "@/components/settings/settings-view";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const user = await requireUser("/settings");
  const account = accountFromUser(user);
  return <SettingsView account={account} />;
}
