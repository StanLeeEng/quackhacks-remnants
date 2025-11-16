"use client"
import { useSession } from "@/lib/auth-client";
import { Navbar } from "@/components/navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const user = session?.user;
  const email = user?.email ?? "";
  const fullName = user?.name ?? "";

  let firstName = "";
  let lastName = "";
  if (fullName) {
    const parts = fullName.trim().split(/\s+/);
    firstName = parts[0] ?? "";
    lastName = parts.slice(1).join(" ");
  }

  if (!user) {
    return (
      <div>
        <Navbar />
        <main className="min-h-screen pt-24 flex items-center justify-center">
          <div className="max-w-xl w-full px-6">
            <div className="rounded-lg border bg-white/60 p-8 shadow">
              <h1 className="text-2xl font-semibold mb-4">Profile</h1>
              <p className="text-sm text-muted-foreground">You must be signed in to view your profile.</p>
              <div className="mt-6 flex gap-3">
                <Link href="/sign-up" className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">
                  Sign Up
                </Link>
                <Link href="/login" className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <main className="min-h-screen pt-24 flex items-start justify-center pb-12">
        <div className="max-w-3xl w-full px-6">
          <div className="rounded-lg border bg-white/60 p-8 shadow">
            <h1 className="text-3xl font-bold mb-6">Profile</h1>

            <div className="grid grid-cols-3 gap-4 items-center py-2">
              <div className="text-sm font-medium text-gray-600">Email</div>
              <div className="col-span-2 text-sm text-gray-900">{email}</div>
            </div>

            <div className="grid grid-cols-3 gap-4 items-center py-2">
              <div className="text-sm font-medium text-gray-600">First name</div>
              <div className="col-span-2 text-sm text-gray-900">{firstName || <span className="text-gray-400">Not set</span>}</div>
            </div>

            <div className="grid grid-cols-3 gap-4 items-center py-2">
              <div className="text-sm font-medium text-gray-600">Last name</div>
              <div className="col-span-2 text-sm text-gray-900">{lastName || <span className="text-gray-400">Not set</span>}</div>
            </div>
            <div></div>
            <Button onClick={() => router.push("/record")}
                className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400">
                Update Voice
            </Button>

          </div>
        </div>
      </main>
    </div>
  );
}