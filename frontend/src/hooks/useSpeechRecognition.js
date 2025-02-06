import { useState } from "react";

export const useSpeechRecognition = () => {
  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
    console.warn("SpeechRecognition is not supported in this browser.");
    return { transcript, isRecording, startListening: () => {}, stopListening: () => {} };
  }

  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "en-US";

  recognition.onstart = () => setIsRecording(true);
  recognition.onend = () => setIsRecording(false);
  recognition.onresult = (event) => setTranscript(event.results[0][0].transcript);

  return {
    transcript,
    isRecording,
    startListening: () => recognition.start(),
    stopListening: () => recognition.stop(),
  };
};
