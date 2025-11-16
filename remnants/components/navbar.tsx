"use client"
import { signOut, useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export const Navbar = () => {
    const { data: session } = useSession();
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await signOut();
        } finally {
            router.refresh();
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur sm:bg-white dark:bg-neutral-900/80 dark:sm:bg-neutral-900 shadow">
            <div className="mx-auto px-6">
                <div className="h-16 flex items-center justify-between">
                    <Link href="/" className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400">
                        Home
                    </Link>

                    {session?.user ? (
                        <div>
                            <Button onClick={handleSignOut} className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400">
                                Sign Out
                            </Button>
                        </div>
                    ) : (
                        <div className="flex gap-3 items-center">
                            <Link href="/sign-up" className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400">
                                Sign Up
                            </Link>
                            <Link href="/login" className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400">
                                Login
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}