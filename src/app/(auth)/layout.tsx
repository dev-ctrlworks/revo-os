import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/env";
import { BackendSetupNotice } from "@/components/setup/backend-setup-notice";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-6 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-lg font-semibold text-[var(--plum,#21164C)]"
        >
          Revo OS
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-6 pb-16">
        {isSupabaseConfigured() ? children : <BackendSetupNotice />}
      </main>
    </div>
  );
}
