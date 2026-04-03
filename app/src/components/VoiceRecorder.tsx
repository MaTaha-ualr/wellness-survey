import { useCallback, useEffect, useRef, useState } from 'react';

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob, audioUrl: string) => void;
  onClear: () => void;
  existingRecording?: { blob: Blob; url: string } | null;
}

function VisualizerBars() {
  return (
    <div className="flex h-8 items-center gap-1">
      {Array.from({ length: 12 }).map((_, index) => (
        <div
          key={index}
          className="w-1.5 animate-pulse rounded-full bg-coral"
          style={{
            height: `${12 + ((index % 4) + 1) * 6}px`,
            animationDelay: `${index * 0.08}s`,
            animationDuration: '0.6s',
          }}
        />
      ))}
    </div>
  );
}

export function VoiceRecorder({
  onRecordingComplete,
  onClear,
  existingRecording,
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [localAudioUrl, setLocalAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const stopRecording = useCallback(() => {
    clearTimer();
    setIsRecording(false);

    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      recorder.stop();
      return;
    }

    stopStream();
  }, [clearTimer, stopStream]);

  useEffect(() => {
    return () => {
      clearTimer();
      stopStream();
    };
  }, [clearTimer, stopStream]);

  const audioUrl = existingRecording?.url || localAudioUrl;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const startRecording = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Audio recording is not supported in this browser.');
      return;
    }

    try {
      setError(null);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      streamRef.current = stream;
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      setRecordingTime(0);
      setIsRecording(true);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType || 'audio/webm' });
        const nextAudioUrl = URL.createObjectURL(blob);

        setLocalAudioUrl(nextAudioUrl);
        onRecordingComplete(blob, nextAudioUrl);
        stopStream();
      };

      mediaRecorder.start();

      timerRef.current = setInterval(() => {
        setRecordingTime((previous) => {
          if (previous >= 179) {
            stopRecording();
            return 180;
          }

          return previous + 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      stopStream();
      clearTimer();
      setIsRecording(false);
      setError('Could not access the microphone. Please check browser permissions.');
    }
  }, [clearTimer, onRecordingComplete, stopRecording, stopStream]);

  const handleReRecord = () => {
    if (localAudioUrl) {
      URL.revokeObjectURL(localAudioUrl);
    }

    setLocalAudioUrl(null);
    setRecordingTime(0);
    setError(null);
    onClear();
  };

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/20 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="relative rounded-2xl border border-white/10 bg-white/5 p-6">
        {!audioUrl && !isRecording && (
          <div className="flex flex-col items-center gap-4">
            <div className="text-center text-sm text-white/60">
              Tap the button below to record your voice
              <br />
              <span className="text-white/40">(Max 3 minutes)</span>
            </div>
            <button
              onClick={startRecording}
              className="group relative flex h-20 w-20 items-center justify-center rounded-full bg-coral transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-coral/30"
            >
              <div className="absolute inset-0 rounded-full bg-coral opacity-30 animate-ping" />
              <svg className="h-8 w-8 text-navy" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
              </svg>
            </button>
            <span className="text-sm text-white/50">Tap to record</span>
          </div>
        )}

        {isRecording && (
          <div className="flex flex-col items-center gap-4">
            <div className="text-2xl font-bold text-coral">{formatTime(recordingTime)}</div>
            <VisualizerBars />
            <div className="flex items-center gap-2 text-sm text-white/60">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              Recording...
            </div>
            <button
              onClick={stopRecording}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500 transition-all duration-300 hover:scale-110 hover:bg-red-600"
            >
              <div className="h-6 w-6 rounded-sm bg-white" />
            </button>
            <span className="text-sm text-white/50">Tap to stop</span>
          </div>
        )}

        {audioUrl && !isRecording && (
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 font-semibold text-coral">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
              </svg>
              Recording saved
            </div>
            <audio
              src={audioUrl}
              controls
              className="w-full max-w-xs [&::-webkit-media-controls-current-time-display]:text-white [&::-webkit-media-controls-panel]:bg-white/20 [&::-webkit-media-controls-time-remaining-display]:text-white"
            />
            <div className="flex gap-3">
              <button
                onClick={handleReRecord}
                className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-white transition-all hover:bg-white/20"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Re-record
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="text-center text-xs text-white/40">
        Speak clearly and take your time. You can re-record as many times as you like.
      </div>
    </div>
  );
}
