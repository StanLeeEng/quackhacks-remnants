"use client";

import { useState } from "react";
import VoiceRecorder from "@/components/VoiceRecorder";
import MessageGenerator from "@/components/MessageGenerator";
import Link from "next/link";

export default function RecordPage() {
  const [step, setStep] = useState<"name" | "record" | "generate">("name");
  const [voiceId, setVoiceId] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      setStep("record");
    }
  };

  const handleRecordingComplete = async (audioBlob: Blob) => {
    // setIsUploading(true);

    // try {
    //   const formData = new FormData();
    //   formData.append("audioFile", audioBlob, "voice-recording.webm");
    //   formData.append("name", userName);

    //   const response = await fetch("/api/voice/upload", {
    //     method: "POST",
    //     body: formData,
    //   });

    //   const data = await response.json();

    //   if (data.success) {
    //     setVoiceId(data.voiceId);
    //     setStep("generate");
    //   } else {
    //     alert("Failed to process voice recording");
    //   }
    // } catch (error) {
    //   console.error("Upload error:", error);
    //   alert("An error occurred while uploading");
    // } finally {
    //   setIsUploading(false);
    // }
    setStep("generate")
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-8"
        >
          ← Back to Home
        </Link>

        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-3">
             Voice Cloning Studio
          </h1>
          <p className="text-xl text-gray-600">
            Create personalized voice messages with AI
          </p>
        </header>

        {/* Progress Steps */}
        <div className="flex justify-center items-center mb-12">
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center ${
                step === "name"
                  ? "text-blue-600"
                  : step === "record"
                  ? "text-blue-600"
                  : "text-green-600"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step === "name"
                    ? "bg-blue-600 text-white"
                    : "bg-green-600 text-white"
                }`}
              >
                {step !== "name" ? "✓" : "1"}
              </div>
              <span className="ml-2 font-semibold">Your Name</span>
            </div>
            <div className="w-16 h-1 bg-gray-300"></div>
            <div
              className={`flex items-center ${
                step === "record"
                  ? "text-blue-600"
                  : step === "generate"
                  ? "text-green-600"
                  : "text-gray-400"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step === "record"
                    ? "bg-blue-600 text-white"
                    : step === "generate"
                    ? "bg-green-600 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {step === "generate" ? "✓" : "2"}
              </div>
              <span className="ml-2 font-semibold">Record Voice</span>
            </div>
            <div className="w-16 h-1 bg-gray-300"></div>
            <div
              className={`flex items-center ${
                step === "generate" ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step === "generate"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                3
              </div>
              <span className="ml-2 font-semibold">Generate</span>
            </div>
          </div>
        </div>

        {/* Content */}
        {step === "name" && (
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome!</h2>
            <p className="text-gray-600 mb-6">
              Let&apos;s start by getting your name.
            </p>
            <form onSubmit={handleNameSubmit}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4 text-gray-800"
                required
              />
              <button
                type="submit"
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
              >
                Continue
              </button>
            </form>
          </div>
        )}

        {step === "record" && (
          <>
            {isUploading ? (
              <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Processing Your Voice...
                </h3>
                <p className="text-gray-600">
                  Creating your voice clone with ElevenLabs AI
                </p>
              </div>
            ) : (
              <VoiceRecorder
                onRecordingComplete={handleRecordingComplete}
                onCancel={() => setStep("name")}
              />
            )}
          </>
        )}

        {step === "generate" && (
          <MessageGenerator voiceId={voiceId} userName={userName} />
        )}
      </div>
    </div>
  );
}
