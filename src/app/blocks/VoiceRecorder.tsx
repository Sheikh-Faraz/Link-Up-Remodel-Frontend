"use client";
import { useEffect, useRef, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Mic, Square, Pause, SendHorizontal, X} from 'lucide-react';
import { useChat } from "@/app/store/Chatinfo";



type Props = {
  onSend: (audioBlob: Blob) => void | Promise<void>;
  autoSend?: boolean; // if true, calls onSend automatically on stop
};

export default function VoiceRecorder({ onSend, autoSend = true }: Props) {
  const { previewingToggle } = useChat();
  

  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<number | null>(null);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    return () => {
      // cleanup on unmount
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (audioURL) URL.revokeObjectURL(audioURL);
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startRecording = async () => {
    previewingToggle(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];

      // choose mime if supported
      const options: MediaRecorderOptions = {};
      if (MediaRecorder.isTypeSupported("audio/webm")) options.mimeType = "audio/webm";
      else if (MediaRecorder.isTypeSupported("audio/ogg")) options.mimeType = "audio/ogg";

      const recorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e: BlobEvent) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        if (audioURL) {
          URL.revokeObjectURL(audioURL);
        }
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        setSeconds(0);

        // stop mic tracks
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;

        if (autoSend) {
          await onSend(blob);
          // if parent wants to clear preview it can handle
        }
      };

      recorder.start();
      setIsRecording(true);

      // timer
      let s = 0;
      setSeconds(0);
      timerRef.current = window.setInterval(() => {
        s += 1;
        setSeconds(s);
        // optional auto-stop limit
        // if (s >= 180) stopRecording();
      }, 1000);
    } catch (err) {
      console.error("Mic error:", err);
      alert("Microphone access denied or not available.");
    }
  };

  const stopRecording = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  // manual send (if autoSend=false)
  const manualSend = async () => {
    if (!audioURL) return;
    // fetch blob back from objectURL
    const resp = await fetch(audioURL);
    const blob = await resp.blob();
    await onSend(blob);
    // cleanup UI preview
    URL.revokeObjectURL(audioURL);
    setAudioURL(null);
  };

  return (
    <div className="flex items-center gap-2 mr-2 justify-between">
      {!isRecording ? (
        <Tooltip>
      <TooltipTrigger asChild>
        {/* <Button variant="outline">Hover</Button> */}
        <button onClick={startRecording} className="hover:text-[#6FD5AA] cursor-pointer">
            <Mic className="w-5 h-5" />
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Record</p>
      </TooltipContent>
    </Tooltip>
      ) : (
      <Tooltip>
        <TooltipTrigger asChild>
          {/* <Button variant="outline">Hover</Button> */}
          <button onClick={stopRecording} className="hover:text-blue-500 cursor-pointer">
              {/* ⏹ Stop */}
              <Pause />
          </button> 
        </TooltipTrigger>
        <TooltipContent>
          <p>Stop Recording</p>
        </TooltipContent>
      </Tooltip>
      )}

      {isRecording && 
        <div className="text-sm flex space-x-2 items-center text-red-600">

          <span className="relative flex h-5 w-5">
            {/* <!-- The pinging effect --> */}
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
            {/* <!-- The base dot --> */}
            <Square className="text-red-600 relative inline-flex h-5 w-5"/>
          </span>

          <p>{seconds}s</p>
        </div>
      }

      {audioURL && !isRecording && (
        <>
          <audio controls src={audioURL} className="ml-2" />
        </>
      )}

      {!isRecording && audioURL &&
        <div className="flex items-center space-x-2">

        <Tooltip>
        <TooltipTrigger asChild>

        <button
          onClick={() => {
            previewingToggle(false);
            // cancel recording preview
            if (audioURL) URL.revokeObjectURL(audioURL);
            setAudioURL(null);
          }}
          className="p-2 text-red-600 hover:text-red-700 cursor-pointer border border-red-600"
        >
          <X className="w-5 h-5" />
        </button>
          
        </TooltipTrigger>
        <TooltipContent>
          <p>Delete recording</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>

          <button
          onClick={manualSend}
          className="bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 disabled:opacity-60 transition"
          >
           <SendHorizontal className="w-5 h-5"/>
        </button>
          
        </TooltipTrigger>
        <TooltipContent>
          <p>Send Voice</p>
        </TooltipContent>
      </Tooltip>

        </div>
      }
    </div>
  );
}
