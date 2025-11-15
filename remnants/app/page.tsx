import Image from "next/image";
import globe from "../public/globe.svg";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-rose-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-black">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
        <div className="content-center">
          <section className="text-center mx-auto max-w-3xl">
            <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">
              Remnant
              <span className="block text-lg font-medium text-zinc-600 dark:text-zinc-400 mt-2">
                Reclaim, remix, and explore your memories
              </span>
            </h1>

            <p className="mt-6 mx-auto max-w-xl text-center text-lg text-zinc-700 dark:text-zinc-300">
              A lightweight web app for collecting audio and family moments. Secure, simple,
              and beautiful — built to help families store and share remnant memories.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center items-center">
              <a
                href="#get-started"
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

        <section id="features" className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: 'Audio Capture', desc: 'Record and store voice snippets with timestamps.' },
            { title: 'Family Groups', desc: 'Invite family members to contribute and listen.' },
            { title: 'Secure Access', desc: 'Simple permissions and safe sharing links.' },
          ].map((f) => (
            <div key={f.title} className="rounded-xl border border-zinc-100 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{f.title}</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{f.desc}</p>
            </div>
          ))}
        </section>

        <footer className="mt-20 border-t border-zinc-100 pt-8 text-center text-sm text-zinc-600 dark:border-neutral-800 dark:text-zinc-400">
          Remnant — made with care for families.
        </footer>
      </div>
    </main>
  );
}
