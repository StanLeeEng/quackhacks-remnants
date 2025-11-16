"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Memory from "@/components/memory";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";

interface FamilyMember {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    voiceId: string | null;
  };
}

interface Family {
  id: string;
  name: string;
  inviteCode: string;
  members: FamilyMember[];
}

interface MemoryType {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  uploadedBy: {
    id: string;
    name: string;
    email: string;
  };
  family: {
    id: string;
    name: string;
  };
}

export default function Dashboard() {
    const router = useRouter();
    const [families, setFamilies] = useState<Family[]>([]);
    const [selectedFamily, setSelectedFamily] = useState<Family | null>(null);
    const [memories, setMemories] = useState<MemoryType[]>([]);
    const [loading, setLoading] = useState(true);
    const [memoriesLoading, setMemoriesLoading] = useState(true);
    const [showInviteCode, setShowInviteCode] = useState(false);

    useEffect(() => {
      fetchFamilies();
      fetchMemories();
    }, []);

    const fetchFamilies = async () => {
      try {
        const response = await fetch('/api/families');
        const data = await response.json();
        if (data.success && data.families.length > 0) {
          setFamilies(data.families);
          setSelectedFamily(data.families[0]); // Select first family by default
        }
      } catch (error) {
        console.error('Failed to fetch families:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchMemories = async () => {
      try {
        const response = await fetch('/api/memories');
        const data = await response.json();
        if (data.success) {
          setMemories(data.memories);
        }
      } catch (error) {
        console.error('Failed to fetch memories:', error);
      } finally {
        setMemoriesLoading(false);
      }
    };

    const copyInviteCode = () => {
      if (selectedFamily?.inviteCode) {
        navigator.clipboard.writeText(selectedFamily.inviteCode);
        alert('Invite code copied to clipboard!');
      }
    };

    return (
        <>
        <Navbar/>
        <div className="min-h-screen pt-24 flex justify-between items-start gap-6 min-h-screen p-6 relative">
            <div className="border rounded-lg p-12 flex-1 max-h-[calc(100vh-3rem)]">
                <h1 className="text-3xl font-bold mb-6">Memories</h1>
                {memoriesLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600"></div>
                  </div>
                ) : memories.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <p className="text-gray-600 mb-4">No memories yet</p>
                    <p className="text-sm text-gray-500 mb-4">
                      When family members send you remnants, they&apos;ll appear here
                    </p>
                    <Button onClick={() => router.push('/generate')}>
                      Send Your First Remnant
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4 overflow-y-auto max-h-[calc(100vh-12rem)] pr-2">
                    {memories.map((memory) => (
                      <Memory
                        key={memory.id}
                        personName={memory.uploadedBy.name}
                        message={memory.description || memory.title}
                        audioUrl={memory.audioUrl}
                      />
                    ))}
                  </div>
                )}
            </div>
            <div className="border rounded-lg p-12 w-full max-w-sm max-h-[calc(100vh-3rem)]">
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <h1 className="text-3xl font-bold">Family Members</h1>
                        {selectedFamily && (
                            <button
                                onClick={() => setShowInviteCode(!showInviteCode)}
                                className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold"
                            >
                                {showInviteCode ? 'Hide Code' : 'Invite'}
                            </button>
                        )}
                    </div>
                    {families.length > 1 && (
                        <select
                            value={selectedFamily?.id || ''}
                            onChange={(e) => setSelectedFamily(families.find(f => f.id === e.target.value) || null)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        >
                            {families.map((family) => (
                                <option key={family.id} value={family.id}>
                                    {family.name}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                {showInviteCode && selectedFamily && (
                    <div className="mb-4 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                        <p className="text-xs text-gray-600 mb-1">Invite Code:</p>
                        <div className="flex items-center gap-2">
                            <code className="flex-1 text-sm font-mono bg-white px-2 py-1 rounded border">
                                {selectedFamily.inviteCode}
                            </code>
                            <button
                                onClick={copyInviteCode}
                                className="px-3 py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700"
                            >
                                Copy
                            </button>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="flex items-center justify-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                ) : !selectedFamily ? (
                    <div className="text-center py-8">
                        <p className="text-gray-600 mb-4">No family yet</p>
                        <Button onClick={() => router.push('/family')}>Create or Join Family</Button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-12rem)] pr-2">
                        {selectedFamily.members.map((member) => (
                            <div key={member.id} className="p-3 border rounded-lg hover:bg-gray-50">
                                <h3 className="font-semibold text-lg">{member.user.name}</h3>
                                <p className="text-xs text-gray-500">{member.user.email}</p>
                                {member.user.voiceId && (
                                    <span className="inline-block mt-1 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                                        Voice Recorded
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Send Remnant Button - Fixed to bottom right */}
            <Button
                onClick={() => router.push("/generate")}
                className="fixed bottom-8 right-8 px-6 py-6 text-lg shadow-lg"
                size="lg"
            >
                Send Remnant
            </Button>
        </div>
        </>
    )
}