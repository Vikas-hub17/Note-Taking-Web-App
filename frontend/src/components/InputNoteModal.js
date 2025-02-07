import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { BsMicFill, BsMicMute } from "react-icons/bs";
import { AiOutlineClose, AiOutlineCloudUpload  } from "react-icons/ai";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";

const InputNoteModal = ({ isOpen, onClose, inputType, addNewNote, note }) => {
  const { transcript, isRecording, startRecording, stopRecording } = useSpeechRecognition();
  const [newNote, setNewNote] = useState({ title: "", text: "", audioUrl: "" });
  const [editableNote, setEditableNote] = useState({ ...note });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isRecording && transcript && inputType === "audio") {
      setNewNote((prev) => ({ ...prev, content: transcript }));
    }
  }, [isRecording, transcript, inputType]);

  useEffect(() => {
      if (transcript) {
        setEditableNote((prev) => ({ ...prev, transcription: transcript }));
      }
    }, [transcript]);

  if (!isOpen) return null;

  const handleTitleChange = (e) => setNewNote({ ...newNote, title: e.target.value });

  const handleChange = (e, field) => {
    setEditableNote({ ...editableNote, [field]: e.target.value });
  };
  
  const handleContentChange = (e) => setNewNote({ ...newNote, content: e.target.value });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewNote({ ...newNote, image: URL.createObjectURL(file) });
    }
  };

  const handleSaveNote = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to save a note.");
      return;
    }

    if (!newNote.title.trim()) {
      alert("Title is required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newNote),
      });

      const data = await response.json();
      if (response.ok) {
        addNewNote(data);
        onClose();
      } else {
        alert(`Failed to save note: ${data.message}`);
      }
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>
          <AiOutlineClose />
        </CloseButton>
        {/* Title Input */}
        <InputField type="text" placeholder="Enter title..." value={newNote.title} onChange={handleTitleChange} />

        {/* Image Upload Modal */}
        {inputType === "image" && (
          <ImageUploadSection>
            <label htmlFor="imageUpload">
              <UploadIcon />
              <span>Click to upload an image</span>
            </label>
            <input id="imageUpload" type="file" accept="image/*" onChange={handleImageUpload} hidden />
            {newNote.image && <UploadedImage src={newNote.image} alt="Uploaded preview" />}
          </ImageUploadSection>
        )}

        {/* Text Input Modal */}
        {inputType === "text" && <TextArea placeholder="Write your note here..." value={newNote.content} onChange={handleContentChange} />}

        {/* Audio Recording Modal */}
        {inputType === "audio" && (
          <>
            {isEditing ? (
              <TranscriptInput 
                placeholder="Transcribe your audio here..."
                value={editableNote.transcription} 
                onChange={(e) => handleChange(e, "transcription")}
              />
            ) : (
              <TranscriptText>{editableNote.transcription}</TranscriptText>
            )}
            <RecordButton onClick={isRecording ? stopRecording : startRecording} recording={isRecording}>
              {isRecording ? "Stop Recording" : "Start Recording"} {isRecording ? <BsMicMute /> : <BsMicFill />}
            </RecordButton>
          </>
        )}

        {/* Save Button */}
        <SaveButton onClick={handleSaveNote}>Save Note</SaveButton>
      </ModalContent>
    </ModalOverlay>
  );
};

export default InputNoteModal;

/* Styled Components */
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  width: 500px;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  text-align: center;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 15px;
  border: none;
  background: none;
  font-size: 22px;
  cursor: pointer;
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
`;

const InputField = styled.input`
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 2px solid #ddd;
  font-size: 16px;
  margin-bottom: 10px;
  transition: all 0.3s ease;
  &:focus {
    border-color: #6C63FF;
    box-shadow: 0 0 8px rgba(108, 99, 255, 0.3);
    outline: none;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 120px;
  padding: 12px;
  border-radius: 8px;
  border: 2px solid #ddd;
  font-size: 16px;
  transition: all 0.3s ease;
  background: #f9f9f9;
  &:focus {
    border-color: #6C63FF;
    box-shadow: 0 0 8px rgba(108, 99, 255, 0.3);
    outline: none;
  }
`;

const RecordButton = styled.button`
  background: ${({ recording }) => (recording ? "darkred" : "#4F46E5")};
  color: white;
  border: none;
  padding: 12px 18px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s ease;
  &:hover {
    background: ${({ recording }) => (recording ? "red" : "#3D37D1")};
    transform: scale(1.05);
  }
`;

const SaveButton = styled.button`
  width: 100%;
  margin-top: 20px;
  background: #6C63FF;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background: #554CC8;
    transform: scale(1.05);
  }
`;

const ImageUploadSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 10px;
  border: 2px dashed #ccc;
  border-radius: 8px;
  cursor: pointer;
`;

const UploadIcon = styled(AiOutlineCloudUpload)`
  font-size: 40px;
  color: #4F46E5;
  margin-bottom: 5px;
`;

const UploadedImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  margin-top: 10px;
`;

const TranscriptInput = styled.textarea`
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
  transition: all 0.3s ease;
  &:focus {
    border-color: #6C63FF;
    box-shadow: 0 0 8px rgba(108, 99, 255, 0.3);
    outline: none;
  }
`;

const TranscriptText = styled.p`
  font-size: 13px;
  color: #444;
  background: #f8f8f8;
  padding: 8px;
  border-radius: 6px;
`;