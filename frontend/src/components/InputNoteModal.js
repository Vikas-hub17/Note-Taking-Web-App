import React, { useState } from "react";
import styled from "styled-components";
import { BsMicFill } from "react-icons/bs";
import { AiOutlinePicture, AiOutlineEdit } from "react-icons/ai";

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

const TextInput = styled.textarea`
  width: 100%;
  height: 120px;
  padding: 12px;
  border-radius: 8px;
  border: 2px solid #ddd;
  font-size: 16px;
  transition: all 0.3s ease;
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

const ImageUploadBox = styled.div`
  margin-top: 15px;
`;

const ImagePreview = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 10px;
  object-fit: cover;
  border: 2px solid #ddd;
`;

const UploadPlaceholder = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  border: 2px dashed #ccc;
  border-radius: 10px;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.3s ease;
  &:hover {
    border-color: #6C63FF;
    background: rgba(108, 99, 255, 0.1);
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

const InputNoteModal = ({ isOpen, onClose, inputType, addNewNote }) => {
  const [newNote, setNewNote] = useState({
    title: "",
    text: "",
    audioUrl: "",
    image: "",
  });

  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);

  if (!isOpen) return null;

  const handleTitleChange = (e) => {
    setNewNote({ ...newNote, title: e.target.value });
  };

  const handleTextChange = (e) => {
    setNewNote({ ...newNote, text: e.target.value });
  };

  const handleImageUpload = (e) => {
    if (e.target.files[0]) {
      setNewNote({ ...newNote, image: URL.createObjectURL(e.target.files[0]) });
    }
  };

  const handleAudioRecord = () => {
    setRecording(!recording);
    if (!recording) {
      const newBlob = new Blob(["dummy audio data"], { type: "audio/mp3" });
      setAudioBlob(newBlob);
      setNewNote({ ...newNote, audioUrl: URL.createObjectURL(newBlob) });
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
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(newNote),
      });

      const data = await response.json();
      console.log("Server Response:", data);

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
        <CloseButton onClick={onClose}>×</CloseButton>
        <Title>
          {inputType === "text"
            ? "Enter Your Note ✏️"
            : inputType === "audio"
            ? "Record Your Audio 🎙"
            : "Upload an Image 🖼"}
        </Title>

        {inputType === "text" && (
          <>
            <InputField type="text" placeholder="Enter title..." value={newNote.title} onChange={handleTitleChange} />
            <TextInput placeholder="Type your note..." value={newNote.text} onChange={handleTextChange} />
          </>
        )}

        {inputType === "audio" && (
          <RecordButton onClick={handleAudioRecord} recording={recording}>
            {recording ? "Stop Recording" : "Start Recording"} <BsMicFill />
          </RecordButton>
        )}

        {inputType === "image" && (
          <ImageUploadBox>
            {newNote.image ? <ImagePreview src={newNote.image} alt="Uploaded" /> : <UploadPlaceholder>+</UploadPlaceholder>}
          </ImageUploadBox>
        )}

        <SaveButton onClick={handleSaveNote}>Save Note</SaveButton>
      </ModalContent>
    </ModalOverlay>
  );
};

export default InputNoteModal;
