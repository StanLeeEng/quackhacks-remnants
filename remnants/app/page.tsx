"use client"
import Features from '@/components/features';
import Footer  from '@/components/footer'
import Title from '@/components/title'
import { Navbar } from '@/components/navbar'

export default function Home() {
  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-rose-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-black">
        <Navbar/>
        <div className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
          <div className="content-center">
            <section className="text-center mx-auto max-w-3xl">
              <Title />

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center items-center">
                <a
                  href={"/sign-up"}
                  className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                >
                  Get Started
                </a>
              </div>

              <div className="mt-10 flex gap-6 text-sm text-zinc-600 dark:text-zinc-400 justify-center">
                <div>
                  <strong className="block font-semibold text-zinc-900 dark:text-zinc-100">Private by design</strong>
                  Small, focused storage for family moments.
                </div>
                <div>
                  <strong className="block font-semibold text-zinc-900 dark:text-zinc-100">Fast uploads</strong>
                  Save audio clips instantly.
                </div>
              </div>
            </section>
          </div>
          <Features />

          <Footer />
        </div>
      </main>
    </>
  );
}
