import SignUpForm from '@/components/sign-up'

export const metadata = {
  title: 'Sign up — Remnant',
}

export default function SignUpPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-rose-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-black">
      <div className="mx-auto px-6 py-12">
        <SignUpForm />
      </div>
    </main>
  )
}
