"use client";
import { Navbar } from "@/components/navbar";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function JoinTeamPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [familyName, setFamilyName] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const joinTeam = async () => {
    if (!code.trim()) {
      alert("Please enter an invite code");
      return;
    }

    setIsLoading(true);
    try {
      // Find family by invite code
      const findRes = await fetch(`/api/families/invite?code=${encodeURIComponent(code)}`);
      const findData = await findRes.json();

      if (!findData.success) {
        alert(findData.error || "Invalid invite code");
        setIsLoading(false);
        return;
      }

      // Join the family
      const response = await fetch(`/api/families/${findData.family.id}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteCode: code }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Successfully joined family!");
        router.push("/dashboard");
      } else {
        alert(`Failed to join: ${data.error}`);
      }
    } catch (error) {
      console.error("Join error:", error);
      alert("An error occurred while joining");
    } finally {
      setIsLoading(false);
    }
  };

  const createTeam = async () => {
    if (!familyName.trim()) {
      alert("Please enter a family name");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/families", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: familyName,
          description: `${familyName} family group`,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push("/dashboard");
      } else {
        alert(`Failed to create family: ${data.error}`);
      }
    } catch (error) {
      console.error("Create family error:", error);
      alert("An error occurred while creating family");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-24 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4 flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold text-center">Welcome</h1>
          <p className="font-bold mb-4 text-center">
            Join or create your family!
          </p>

          {!showCreateForm ? (
            <>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Enter invite code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  disabled={isLoading}
                />
                <button
                  onClick={joinTeam}
                  disabled={isLoading}
                  className="px-5 py-2 rounded-md bg-indigo-600 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:bg-gray-400"
                >
                  {isLoading ? "Joining..." : "Join"}
                </button>
              </div>
              <p className="mb-2 text-center">or</p>
              <div className="flex justify-center">
                <button
                  onClick={() => setShowCreateForm(true)}
                  disabled={isLoading}
                  className="items-center rounded-md bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:bg-gray-400"
                >
                  Create Family
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Family Name
                </label>
                <input
                  type="text"
                  placeholder="Enter family name"
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  disabled={isLoading}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={createTeam}
                  disabled={isLoading}
                  className="flex-1 rounded-md bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:bg-gray-400"
                >
                  {isLoading ? "Creating..." : "Create"}
                </button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  disabled={isLoading}
                  className="px-5 py-3 rounded-md bg-gray-300 text-sm font-semibold text-gray-700 shadow hover:bg-gray-400 disabled:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
