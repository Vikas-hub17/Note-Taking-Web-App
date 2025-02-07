import { useState, useEffect } from "react";

export const useSpeechRecognition = () => {
  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  let recognition = null;

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support speech recognition.");
    }
  }, []);

  const startRecording = () => {
    if (!("webkitSpeechRecognition" in window)) return;

    recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true; // Allow continuous speech recognition
    recognition.interimResults = true; // Show real-time results
    recognition.lang = "en-US";

    recognition.onstart = () => setIsRecording(true);

    recognition.onresult = (event) => {
      let transcriptText = "";
      for (let i = 0; i < event.results.length; i++) {
        transcriptText += event.results[i][0].transcript + " ";
      }
      setTranscript(transcriptText.trim());
    };

    recognition.onerror = (event) => console.error("Speech Recognition Error:", event);

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  const stopRecording = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  return { transcript, isRecording, startRecording, stopRecording };
};
