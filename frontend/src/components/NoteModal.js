import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { FiX, FiMaximize2, FiStar, FiDownload, FiTrash2, FiSettings, FiEdit } from "react-icons/fi";
import { BsShare, BsMic, BsMicMute, BsPlus } from "react-icons/bs";

const NoteModal = ({ note, onClose, updateNote, deleteNote, toggleFavorite }) => {
  const [isFavorite, setIsFavorite] = useState(note.favorite || false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [editableNote, setEditableNote] = useState({ ...note });
  const [isEditing, setIsEditing] = useState(false);
  const { transcript, isRecording, startRecording, stopRecording } = useSpeechRecognition();
  const [image, setImage] = useState(note.image || null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  const handleChange = (e, field) => {
    setEditableNote({ ...editableNote, [field]: e.target.value });
  };

  useEffect(() => {
    if (!isRecording && transcript) {
      setEditableNote((prev) => ({
        ...prev,
        transcription: prev.transcription ? prev.transcription + " " + transcript : transcript,
      }));
    }
  }, [isRecording, transcript]);

  useEffect(() => {
    if (transcript) {
      setEditableNote((prev) => ({ ...prev, transcription: transcript }));
    }
  }, [transcript]);

  // Handle saving note updates
  const handleSave = () => {
    if (!editableNote.title.trim()) {
      alert("Title is required.");
      return;
    }
    updateNote(editableNote);
    setIsEditing(false);
  };

  // Handle image upload (allows multiple images)
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setEditableNote((prev) => ({
      ...prev,
      images: [...(prev.images || []), ...newImages],
    }));
  };

  // Handle deleting a specific image
  const handleImageRemove = (index) => {
    setEditableNote((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Handle favorite toggle
  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    toggleFavorite(note.id);
  };

  // Handle delete note
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this note?");
    if (confirmDelete) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/api/notes/${editableNote.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.ok) {
          deleteNote(editableNote.id);
          setMessage("Note deleted successfully.");
          setMessageType("success");
          onClose();
        } else {
          const data = await response.json();
          setMessage(`Failed to delete note: ${data.message}`);
          setMessageType("error");
        }
      } catch (error) {
        console.error("Error deleting note:", error);
        setMessage("An error occurred while deleting the note.");
        setMessageType("error");
      }
    }
  };

  return (
    <ModalOverlay>
      <ModalContainer isFullScreen={isFullScreen}>
        {/* Header */}
        <ModalHeader>
          <IconButton onClick={() => setIsFullScreen(!isFullScreen)}>
            <FiMaximize2 />
          </IconButton>
          {isEditing ? (
            <TitleInput
              type="text"
              value={editableNote.title}
              onChange={(e) => setEditableNote({ ...editableNote, title: e.target.value })}
            />
          ) : (
            <Title>{editableNote.title}</Title>
          )}
          <Date>{editableNote.date}</Date>
          <HeaderRight>
            <IconButton onClick={handleFavorite}>
              <FiStar color={isFavorite ? "#FFD700" : "#999"} />
            </IconButton>
            <IconButton>
              <FiSettings />
            </IconButton>
            <ShareButton>
              <BsShare />
              Share
            </ShareButton>
            <DeleteButton onClick={handleDelete}>
              <FiTrash2 />
            </DeleteButton>
            <CloseButton onClick={onClose}>
              <FiX />
            </CloseButton>
          </HeaderRight>
        </ModalHeader>

        {/* Display message */}
        {message && (
          <Message type={messageType}>
            {message}
          </Message>
        )}

        {/* Audio Player */}
        {editableNote.audio && (
          <AudioPlayer>
            <PlayButton>▶</PlayButton>
            <ProgressBar>
              <Progress />
            </ProgressBar>
            <AudioTime>00:00 / {editableNote.duration}</AudioTime>
            <DownloadButton>
              <FiDownload />
              Download Audio
            </DownloadButton>
          </AudioPlayer>
        )}

        {/* Note Content */}
        <Content>
          <Tabs>
            <Tab active>📝 Notes</Tab>
            <Tab>🗣 Transcript</Tab>
            <Tab>➕ Create</Tab>
            <Tab disabled>🎙 Speaker Transcript</Tab>
          </Tabs>
          <TranscriptSection>
            <TranscriptTitle>Transcript</TranscriptTitle>
            {isEditing ? (
              <TranscriptInput
                value={editableNote.transcription}
                onChange={(e) => handleChange(e, "transcription")}
              />
            ) : (
              <TranscriptText>{editableNote.transcription}</TranscriptText>
            )}
            <CopyButton>📋 Copy</CopyButton>
          </TranscriptSection>
        </Content>

        {/* Image Upload Section */}
        <ImageUploadSection>
          <label htmlFor="imageUpload">
            <UploadBox>
              <BsPlus />
              Upload Images
            </UploadBox>
          </label>
          <input id="imageUpload" type="file" accept="image/*" multiple onChange={handleImageUpload} hidden />

          {/* Show Uploaded Images */}
          <ImageGrid>
            {editableNote.images?.map((image, index) => (
              <ImageWrapper key={index}>
                <UploadedImage src={image} alt="Uploaded" />
                <RemoveImageButton onClick={() => handleImageRemove(index)}>✖</RemoveImageButton>
              </ImageWrapper>
            ))}
          </ImageGrid>
        </ImageUploadSection>

        <RecordingSection>
          <RecordButton onClick={isRecording ? stopRecording : startRecording}>
            {isRecording ? <BsMicMute /> : <BsMic />}
            {isRecording ? "Stop Recording" : "Start Recording"}
          </RecordButton>
        </RecordingSection>

        {/* Footer Actions */}
        <FooterActions>
          <EditButton onClick={() => setIsEditing(!isEditing)}>
            <FiEdit />
            {isEditing ? "Save" : "Edit"}
          </EditButton>
          {isEditing && <SaveButton onClick={handleSave}>Save Changes</SaveButton>}
        </FooterActions>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default NoteModal;

/* Styled Components */
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  background: white;
  width: ${(props) => (props.isFullScreen ? "90vw" : "50vw")};
  height: ${(props) => (props.isFullScreen ? "90vh" : "auto")};
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: bold;
  text-align: center;
`;

const TitleInput = styled.input`
  font-size: 18px;
  font-weight: bold;
  border: 1px solid #ccc;
  padding: 5px;
  text-align: center;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Tabs = styled.div`
  display: flex;
  gap: 8px;
`;

const Tab = styled.button`
  padding: 6px 12px;
  border: none;
  background: ${(props) => (props.active ? "#ddd" : "transparent")};
  cursor: pointer;
  border-radius: 6px;
`;

const TranscriptSection = styled.div`
  background: #f8f8f8;
  padding: 12px;
  border-radius: 8px;
`;

const ImageUploadSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const UploadedImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
`;

const ImageUploadBox = styled.label`
  width: 60px;
  height: 60px;
  background: #f1f1f1;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  cursor: pointer;
`;

const RecordingSection = styled.div`
  display: flex;
  justify-content: center;
`;

const RecordButton = styled.button`
  background: #ff6b6b;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  color: white;
  cursor: pointer;
`;

const SaveButton = styled.button`
  background: #4CAF50;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  color: white;
  cursor: pointer;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  &:hover {
    transform: scale(1.1);
  }
`;

const Date = styled.p`
  font-size: 12px;
  color: #888;
`;

const ShareButton = styled(IconButton)`
  background: #f1f1f1;
  padding: 6px 10px;
  border-radius: 6px;
`;

const DeleteButton = styled(IconButton)`
  background: #ffdddd;
  padding: 6px 10px;
  border-radius: 6px;
`;

const CloseButton = styled(IconButton)`
  font-size: 20px;
  color: #666;
  &:hover {
    color: black;
  }
`;

const AudioPlayer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f9f9f9;
  padding: 12px;
  border-radius: 8px;
  justify-content: space-between;
`;

const PlayButton = styled.button`
  border: none;
  background: none;
  font-size: 16px;
  cursor: pointer;
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 4px;
  background: #ddd;
  border-radius: 2px;
  position: relative;
`;

const Progress = styled.div`
  width: 30%;
  height: 100%;
  background: #666;
  border-radius: 2px;
`;

const AudioTime = styled.span`
  font-size: 12px;
  color: #555;
`;

const DownloadButton = styled(IconButton)`
  display: flex;
  align-items: center;
  gap: 5px;
  background: #e1e1e1;
  padding: 6px 10px;
  border-radius: 6px;
`;

const TranscriptTitle = styled.h3`
  font-size: 14px;
  font-weight: bold;
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

const CopyButton = styled(IconButton)`
  border: 1px solid #ddd;
  padding: 4px 8px;
  background: #e1e1e1;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
`;

const FooterActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

const EditButton = styled.button`
  background: #f1c40f;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s ease;
  &:hover {
    background: #e0b00d;
  }
`;

const UploadBox = styled.div`
  padding: 10px;
  background: #f1f1f1;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ImageGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
`;

const ImageWrapper = styled.div`
  position: relative;
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const Message = styled.div`
  padding: 10px;
  margin: 10px 0;
  border-radius: 6px;
  color: white;
  background-color: ${(props) => (props.type === "success" ? "#4CAF50" : "#f44336")};
  text-align: center;
`;