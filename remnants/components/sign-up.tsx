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
import { signUp } from "@/lib/auth-client";

export default function SignUpForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailSignUp = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !passwordConfirmation
    ) {
      setError("All fields are required.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== passwordConfirmation) {
      setError("Passwords do not match.");
      return;
    }

    await signUp.email({
      email,
      password,
      name: `${firstName} ${lastName}`,
      image: "",
      callbackURL: "/",
      fetchOptions: {
        onResponse: () => setLoading(false),
        onRequest: () => setLoading(true),
        onError: (ctx) => {
          setError(ctx.error.message || "An unknown error occurred.");
        },
        onSuccess: async () => {
          router.push("/login");
        },
      },
    });
  };

  return (
    <Card className="z-50 max-w-md rounded-md">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Sign Up</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleEmailSignUp}>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                placeholder="Benny"
                required
                onChange={(e) => setFirstName(e.target.value)}
                onKeyDown={() => setError(null)}
                value={firstName}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                placeholder="Beaver"
                required
                onChange={(e) => setLastName(e.target.value)}
                onKeyDown={() => setError(null)}
                value={lastName}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="BennyDaBeaver@example.com"
              required
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={() => setError(null)}
              value={email}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={() => setError(null)}
              autoComplete="new-password"
              placeholder="Password"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              onKeyDown={() => setError(null)}
              autoComplete="new-password"
              placeholder="Confirm Password"
            />
          </div>

          {error && <p className="text-center text-red-500 text-sm">{error}</p>}

          <Button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-300"
            disabled={loading}
          >
            Create an account
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
