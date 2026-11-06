import type { Metadata } from "next";
import { requireUser } from "@/features/auth/session";
import { ExtensionTokensClient } from "@/components/settings/extension-tokens-client";

export const metadata: Metadata = { title: "Browser extension" };

export default async function ExtensionSettingsPage() {
  await requireUser("/settings/extension");
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">Settings</p>
        <h1 className="text-2xl font-semibold tracking-tight">Browser extension</h1>
        <p className="text-sm text-muted-foreground">
          Save pages to Revo OS with screenshots and selected text. Available on Plus and Pro.
        </p>
      </header>
      <ExtensionTokensClient />
    </div>
  );
}
