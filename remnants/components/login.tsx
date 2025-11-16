"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth-client";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleEmailLogin = async (e: FormEvent) => {
    e.preventDefault(); // Prevent default form submission (page reload)
    setError(null); // Clear previous errors on a new attempt

    // 1. Client-side validation for immediate feedback
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // 2. Call your authentication library
    await signIn.email(
      { email, password },
      {
        onRequest: () => setLoading(true),
        onResponse: () => setLoading(false),
        onSuccess: async () => router.push("/record"),
        // 3. Handle and display errors from the server
        onError: (ctx) => {
          setError(ctx.error.message || "An unknown error occurred.");
        },
      }
    );
  };

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Sign In</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Converted to a <form> with an onSubmit handler */}
        <form className="grid gap-4" onSubmit={handleEmailLogin}>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="BennyDaBeaver@example.com"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              onKeyDown={() => setError(null)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="password"
              autoComplete="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={() => setError(null)}
            />
          </div>

          {/* Conditionally render the error message */}
          {error && <p className="text-center text-red-500 text-sm">{error}</p>}

          <Button
            type="submit"
            className="w-full bg-indigo-600"
            disabled={loading}
          >
            Login
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
