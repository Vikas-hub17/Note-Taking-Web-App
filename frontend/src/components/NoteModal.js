import React, { useState } from "react";
import styled from "styled-components";
import { FiX, FiMaximize2, FiStar, FiDownload, FiTrash2, FiSettings } from "react-icons/fi";
import { BsShare, BsMic, BsMicMute, BsPlus } from "react-icons/bs";

const NoteModal = ({ note, onClose }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  return (
    <ModalOverlay>
      <ModalContainer isFullScreen={isFullScreen}>
        {/* Header */}
        <ModalHeader>
          <IconButton onClick={() => setIsFullScreen(!isFullScreen)}>
            <FiMaximize2 />
          </IconButton>
          <Title>{note.title}</Title>
          <Date>{note.date}</Date>
          <HeaderRight>
            <IconButton onClick={() => setIsFavorite(!isFavorite)}>
              <FiStar color={isFavorite ? "#FFD700" : "#999"} />
            </IconButton>
            <IconButton>
              <FiSettings />
            </IconButton>
            <ShareButton>
              <BsShare />
              Share
            </ShareButton>
            <DeleteButton>
              <FiTrash2 />
            </DeleteButton>
            <CloseButton onClick={onClose}>
              <FiX />
            </CloseButton>
          </HeaderRight>
        </ModalHeader>

        {/* Audio Player */}
        {note.audio && (
          <AudioPlayer>
            <PlayButton>▶</PlayButton>
            <ProgressBar>
              <Progress />
            </ProgressBar>
            <AudioTime>00:00 / {note.duration}</AudioTime>
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
            <TranscriptText>{note.transcription}</TranscriptText>
            <CopyButton>📋 Copy</CopyButton>
          </TranscriptSection>
        </Content>

        {/* Image Upload Section */}
        <ImageUploadSection>
          {note.image ? (
            <UploadedImage src={note.image} alt="Uploaded" />
          ) : (
            <ImageUploadBox>
              <BsPlus />
              Image
            </ImageUploadBox>
          )}
        </ImageUploadSection>

        {/* Recording Button */}
        <RecordingSection>
          <RecordButton onClick={() => setIsRecording(!isRecording)}>
            {isRecording ? <BsMicMute /> : <BsMic />}
            {isRecording ? "Stop Recording" : "Start Recording"}
          </RecordButton>
        </RecordingSection>
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
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: bold;
`;

const Date = styled.p`
  font-size: 12px;
  color: #888;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
`;

const ShareButton = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  border: none;
  padding: 6px 10px;
  background: #f1f1f1;
  border-radius: 6px;
  cursor: pointer;
`;

const DeleteButton = styled(ShareButton)`
  background: #ffdddd;
`;

const CloseButton = styled(IconButton)`
  font-size: 20px;
`;

const AudioPlayer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f9f9f9;
  padding: 12px;
  border-radius: 8px;
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

const DownloadButton = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  border: none;
  padding: 6px 10px;
  background: #f1f1f1;
  border-radius: 6px;
  cursor: pointer;
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
  font-size: 14px;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TranscriptSection = styled.div`
  background: #f8f8f8;
  padding: 12px;
  border-radius: 8px;
`;

const TranscriptTitle = styled.h3`
  font-size: 14px;
  font-weight: bold;
`;

const TranscriptText = styled.p`
  font-size: 13px;
  color: #444;
`;

const CopyButton = styled.button`
  border: none;
  padding: 4px 8px;
  background: #e1e1e1;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
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

const ImageUploadBox = styled.div`
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
  display: flex;
  align-items: center;
  gap: 6px;
  background: #ff6b6b;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
`;

