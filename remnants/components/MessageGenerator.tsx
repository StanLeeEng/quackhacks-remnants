"use client";

import { useState, useEffect } from "react";

interface MessageGeneratorProps {
  voiceId: string;
  userName: string;
}

interface PresetType {
  type: string;
  label: string;
  samples: string[];
}

export default function MessageGenerator({
  voiceId,
  userName,
}: MessageGeneratorProps) {
  const [presets, setPresets] = useState<PresetType[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<string>("");
  const [customMessage, setCustomMessage] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [generatedMessage, setGeneratedMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [familyId, setFamilyId] = useState<string>("");
  const [families, setFamilies] = useState<Array<{id: string; name: string}>>([]);

  useEffect(() => {
    fetchPresets();
    fetchFamilies();
  }, []);

  const fetchFamilies = async () => {
    try {
      const response = await fetch("/api/families");
      const data = await response.json();
      if (data.success && data.families.length > 0) {
        setFamilies(data.families);
        setFamilyId(data.families[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch families:", error);
    }
  };

  const fetchPresets = async () => {
    try {
      const response = await fetch("/api/voice/generate");
      const data = await response.json();
      if (data.success) {
        setPresets(data.presets);
      }
    } catch (error) {
      console.error("Failed to fetch presets:", error);
    }
  };

  const generateMessage = async (useCustom: boolean) => {
    setIsGenerating(true);
    setAudioUrl("");
    setGeneratedMessage("");

    try {
      const response = await fetch("/api/voice/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voiceId,
          messageType: useCustom ? undefined : selectedPreset,
          customMessage: useCustom ? customMessage : undefined,
          recipientName: recipientName || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Convert base64 to audio blob
        const audioBlob = new Blob(
          [Uint8Array.from(atob(data.audio), (c) => c.charCodeAt(0))],
          { type: data.contentType }
        );
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setGeneratedMessage(data.message);
      } else {
        alert("Failed to generate message");
      }
    } catch (error) {
      console.error("Generation error:", error);
      alert("An error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadAudio = () => {
    if (audioUrl) {
      const link = document.createElement("a");
      link.href = audioUrl;
      link.download = `${userName}-message-${Date.now()}.mp3`;
      link.click();
    }
  };

  const saveMemory = async () => {
    if (!audioUrl || !familyId) {
      alert("Please select a family to save this memory to");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/memories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: recipientName ? `Message for ${recipientName}` : "Voice Message",
          description: generatedMessage,
          audioUrl: audioUrl,
          familyId: familyId,
          usedVoiceId: voiceId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Memory saved and shared with family members!");
        setAudioUrl("");
        setGeneratedMessage("");
        setCustomMessage("");
        setRecipientName("");
        setSelectedPreset("");
      } else {
        alert(`Failed to save memory: ${data.error}`);
      }
    } catch (error) {
      console.error("Error saving memory:", error);
      alert("An error occurred while saving");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Generate Voice Messages
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Create personalized messages using {userName}&apos;s cloned voice
      </p>

      {/* Family Selector */}
      {families.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Send to Family
          </label>
          <select
            value={familyId}
            onChange={(e) => setFamilyId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
          >
            {families.map((family) => (
              <option key={family.id} value={family.id}>
                {family.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Recipient Name */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Recipient Name
        </label>
        <input
          type="text"
          value={recipientName}
          onChange={(e) => setRecipientName(e.target.value)}
          placeholder="e.g., John"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
        />
      </div>

      {/* Preset Messages */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Choose a Preset Message
        </label>
        <div className="grid grid-cols-2 gap-3">
          {presets.map((preset) => (
            <button
              key={preset.type}
              onClick={() => setSelectedPreset(preset.type)}
              className={`p-4 rounded-lg border-2 transition-colors text-left ${
                selectedPreset === preset.type
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              <div className="font-semibold text-gray-800">{preset.label}</div>
              <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                {preset.samples[0]}
              </div>
            </button>
          ))}
        </div>

        {selectedPreset && (
          <button
            onClick={() => generateMessage(false)}
            disabled={isGenerating}
            className="mt-4 w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-semibold transition-colors"
          >
            {isGenerating ? "Generating..." : "Generate Preset Message"}
          </button>
        )}
      </div>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">OR</span>
        </div>
      </div>

      {/* Custom Message */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Write a Custom Message
        </label>
        <textarea
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
          placeholder="Type your custom message here..."
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800"
        />

        <button
          onClick={() => generateMessage(true)}
          disabled={isGenerating || !customMessage.trim()}
          className="mt-4 w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 font-semibold transition-colors"
        >
          {isGenerating ? "Generating..." : "Generate Custom Message"}
        </button>
      </div>

      {/* Generated Audio */}
      {audioUrl && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <h3 className="font-semibold text-green-800 mb-2">
            ✓ Message Generated!
          </h3>
          <p className="text-sm text-gray-700 mb-3 italic">
            &quot;{generatedMessage}&quot;
          </p>
          <audio controls src={audioUrl} className="w-full mb-3" />
          <div className="flex space-x-3 mb-3">
            <button
              onClick={saveMemory}
              disabled={isSaving}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-semibold transition-colors"
            >
              {isSaving ? "Saving..." : "💾 Save to Memories"}
            </button>
            <button
              onClick={downloadAudio}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-colors"
            >
              Download
            </button>
          </div>
          <button
            onClick={() => {
              setAudioUrl("");
              setGeneratedMessage("");
            }}
            className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold transition-colors"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
