'use client';

import { useState, useRef } from 'react';

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  onCancel?: () => void;
}

export default function VoiceRecorder({ onRecordingComplete, onCancel }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioURL, setAudioURL] = useState<string>('');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        setAudioBlob(blob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please grant permission.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const handleSubmit = () => {
    if (audioBlob) {
      onRecordingComplete(audioBlob);
    }
  };

  const handleReset = () => {
    setAudioURL('');
    setAudioBlob(null);
    setRecordingTime(0);
    chunksRef.current = [];
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Record Your Voice</h2>
      <p className="text-sm text-gray-600 mb-6">
        Record a 10-15 second sample of your voice speaking naturally. This will be used to clone your voice.
      </p>

      <div className="flex flex-col items-center space-y-4">
        {!audioURL ? (
          <>
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-lg">
              <div className={`w-24 h-24 rounded-full bg-white flex items-center justify-center ${isRecording ? 'animate-pulse' : ''}`}>
                {isRecording ? (
                  <div className="w-6 h-6 bg-red-500 rounded-full animate-pulse"></div>
                ) : (
                  <svg className="w-12 h-12 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>

            {isRecording && (
              <div className="text-2xl font-mono font-bold text-red-600">
                {formatTime(recordingTime)}
              </div>
            )}

            <div className="flex space-x-3">
              {!isRecording ? (
                <>
                  <button
                    onClick={startRecording}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
                  >
                    Start Recording
                  </button>
                  {onCancel && (
                    <button
                      onClick={onCancel}
                      className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </>
              ) : (
                <button
                  onClick={stopRecording}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition-colors"
                >
                    Stop Recording
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="w-full bg-gray-100 rounded-lg p-4">
              <audio controls src={audioURL} className="w-full" />
              <p className="text-sm text-gray-600 mt-2 text-center">
                Duration: {formatTime(recordingTime)}
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-colors"
              >
                Use This Recording
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold transition-colors"
              >
                Record Again
              </button>
            </div>
          </>
        )}
      </div>

      <div className="mt-6 bg-blue-50 rounded-lg p-4 text-sm text-blue-800">
        <strong>Tips for best results:</strong>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Speak naturally in your normal voice</li>
          <li>Record in a quiet environment</li>
          <li>Aim for 30-60 seconds of clear speech</li>
          <li>Avoid background noise or music</li>
        </ul>
      </div>
    </div>
  );
}
