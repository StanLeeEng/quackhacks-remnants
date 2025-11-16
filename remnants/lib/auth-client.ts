import { createAuthClient } from "better-auth/react";

// Create a single BetterAuth client instance and export its helpers.
const client = createAuthClient({
    baseURL:"http://localhost:3000",
});

export const authClient = client;
export const { signIn, signUp, signOut, useSession } = client;

export default client;