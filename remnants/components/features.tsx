export default function Features() {
    return (
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
    )
}