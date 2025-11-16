"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import MessageGenerator from "@/components/messageGenerator"

export default function GeneratePage() {
    const [userData, setUserData] = useState<{ voiceId: string; name: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch("/api/user/profile");
                const data = await response.json();
                
                if (data.success) {
                    setUserData({
                        voiceId: data.user.voiceId || "",
                        name: data.user.name || "User",
                    });
                }
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen pt-24 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading...</p>
                    </div>
                </div>
            </>
        );
    }

    if (!userData?.voiceId) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen pt-24 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4 flex items-center justify-center">
                    <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">No Voice Profile Found</h2>
                        <p className="text-gray-600 mb-6">
                            You need to record your voice first before generating messages.
                        </p>
                        <a
                            href="/record"
                            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
                        >
                            Record Your Voice
                        </a>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen pt-24 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    <MessageGenerator voiceId={userData.voiceId} userName={userData.name} />
                </div>
            </div>
        </>
    );
}