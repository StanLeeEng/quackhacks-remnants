"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import VoiceRecorder from "@/components/VoiceRecorder";
import { Navbar } from "@/components/navbar";

export default function RecordPage() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);

  const handleRecordingComplete = async (audioBlob: Blob) => {
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("audioFile", audioBlob, "voice-recording.webm");

      const response = await fetch("/api/voice/save", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        router.push("/dashboard");
      } else {
        console.error("Voice save failed:", data);
        alert(`Failed to save voice recording: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert(`An error occurred while saving: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <Navbar/>
      <div className="min-h-screen pt-24 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-800 mb-3">
              Record Your Voice
            </h1>
            <p className="text-xl text-gray-600">
              Record a voice sample to create your voice profile
            </p>
          </header>

          {isUploading ? (
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Saving Your Voice...
              </h3>
            </div>
          ) : (
            <VoiceRecorder onRecordingComplete={handleRecordingComplete} />
          )}
        </div>
      </div>
    </>
  );
}
