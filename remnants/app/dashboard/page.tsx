"use client";

import { useRouter } from "next/navigation";
import Memory from "@/components/memory";
import { Button } from "@/components/ui/button";


export default function Dashboard() {
    const router = useRouter();

    return (
        <div className="flex justify-between items-start gap-6 min-h-screen p-6 relative">
            <div className="border rounded-lg p-12 flex-1 max-h-[calc(100vh-3rem)]">
                <h1 className="text-3xl font-bold mb-6">Memories</h1>
                <div className="grid grid-cols-3 gap-4 overflow-y-auto max-h-[calc(100vh-12rem)] pr-2">
                    <Memory 
                        personName="Grandma"
                        message="Happy Birthday! I love you so much! bruh bruh bruh bruh bruh"
                        audioUrl="/api/audio/123"
                    />
                    <Memory 
                        personName="Grandpa"
                        message="Sweet dreams, my dear. Here's a bedtime story for you."
                        audioUrl="/api/audio/124"
                    />
                    <Memory 
                        personName="Mom"
                        message="Just wanted to remind you how proud I am of you!"
                        audioUrl="/api/audio/125"
                    />
                    <Memory 
                        personName="Dad"
                        message="Just wanted to remind you how proud I am of you!"
                        audioUrl="/api/audio/125"
                    />
                </div>
            </div>
            <div className="border rounded-lg p-12 w-full max-w-sm max-h-[calc(100vh-3rem)]">
                <h1 className="text-3xl font-bold mb-6">Family Members:</h1>
                <div className="flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-12rem)] pr-2">
                    <div className="p-2 border rounded-lg">
                        <h3 className="font-semibold text-lg">Grandma</h3>
                    </div>
                    <div className="p-2 border rounded-lg">
                        <h3 className="font-semibold text-lg">Grandpa</h3>
                    </div>
                    <div className="p-2 border rounded-lg">
                        <h3 className="font-semibold text-lg">Mom</h3>
                    </div>
                    <div className="p-2 border rounded-lg">
                        <h3 className="font-semibold text-lg">Dad</h3>
                    </div>
                </div>
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
    )
}