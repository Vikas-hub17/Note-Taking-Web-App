import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaSearch, FaRegCopy } from "react-icons/fa";
import { MdSort, MdDelete, MdEdit } from "react-icons/md";
import { BsMicFill, BsThreeDots, BsMicMute } from "react-icons/bs";
import { AiFillHome, AiOutlineStar, AiOutlinePicture, AiOutlineEdit } from "react-icons/ai";
import NoteModal from "../components/NoteModal";
import InputNoteModal from "../components/InputNoteModal";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition"; // Import speech recognition hook

const Dashboard = () => {
  const { transcript, isRecording, startRecording, stopRecording } = useSpeechRecognition(); // Use speech recognition
  const [selectedNote, setSelectedNote] = useState(null);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // "text", "audio", "image"
  const [searchQuery, setSearchQuery] = useState("");
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [inputType, setInputType] = useState("");
  
  const [notes, setNotes] = useState([
    {
      id: 1,
      type: "audio",
      title: "Engineering Assignment Audio",
      text: "I'm recording an audio to transcribe into text for the assignment of engineering in terms of actors.",
      timestamp: "Jan 30, 2025 • 5:26 PM",
      duration: "00:09",
      hasImage: true,
    },
    {
      id: 2,
      type: "text",
      title: "Random Sequence",
      text: "ssxscscscsc",
      timestamp: "Jan 30, 2025 • 5:21 PM",
    },
  ]);

  useEffect(() => {
    if (!isRecording && transcript) {
      // Show prompt for title input after recording stops
      const title = prompt("Enter a title for your note:");
      if (title) {
        handleSaveNote(title, transcript);
      }
    }
  }, [isRecording, transcript]); // Triggered when recording stops

  const openInputModal = (type) => {
    setInputType(type);
    setIsInputModalOpen(true);
  };

  const openNoteModal = (note) => {
    setSelectedNote(note);
    setIsNoteModalOpen(true);
  };

  const handleSaveNote = (title, content) => {
    if (!title.trim()) {
      alert("Please enter a title for your note.");
      return;
    }

    const savedNote = {
      title,
      content,
      timestamp: new Date().toLocaleString(),
    };

    console.log("Saving Note:", savedNote);
    setNewNote({ title: "", content: "" });
    setIsInputModalOpen(false);
  };


  return (
    <Container>
      {/* Sidebar */}
      <Sidebar>
        <Brand>AI Notes</Brand>
        <Menu>
          <MenuItem active>
            <AiFillHome />
            Home
          </MenuItem>
          <MenuItem>
            <AiOutlineStar />
            Favourites
          </MenuItem>
        </Menu>
        <UserSection>
          <UserIcon>E</UserIcon>
          <UserName>Emmanual Vincent</UserName>
        </UserSection>
      </Sidebar>

      {/* Main Content */}
      <MainContent>
        <Header>
          <SearchBar>
            <FaSearch />
            <input type="text" placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </SearchBar>
          <SortButton>
            <MdSort /> Sort
          </SortButton>
        </Header>

        {/* Notes Grid */}
        <NotesGrid>
          {notes
            .filter((note) =>
              note.title.toLowerCase().includes(searchQuery.toLowerCase()) || note.text.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((note) => (
              <NoteCard key={note.id} onClick={() => openNoteModal(note)}>
                <NoteHeader>
                  <NoteTimestamp>{note.timestamp}</NoteTimestamp>
                  {note.type === "audio" ? <AudioTag><BsMicFill /> {note.duration}</AudioTag> : <TextTag>Text</TextTag>}
                </NoteHeader>

                <NoteTitle>{note.title}</NoteTitle>
                <NoteText>{note.text}</NoteText>

                {note.hasImage && <NoteFooter><AiOutlinePicture /> 1 Image</NoteFooter>}

                <Actions>
                  <ActionButton><FaRegCopy /></ActionButton>
                  <ActionButton><MdEdit /></ActionButton>
                  <ActionButton><MdDelete /></ActionButton>
                  <BsThreeDots />
                </Actions>
              </NoteCard>
            ))}
        </NotesGrid>

        {/* Floating Bottom Bar */}
        <FloatingBar>
          <LeftIcons>
            <FloatingIcon onClick={() => openInputModal("image")}>
              <AiOutlinePicture />
            </FloatingIcon>
            <FloatingIcon onClick={() => openInputModal("text")}>
              <AiOutlineEdit />
            </FloatingIcon>
          </LeftIcons>

          <RecordButton onClick={isRecording ? stopRecording : startRecording}>
            {isRecording ? <BsMicMute /> : <BsMicFill />}
            {isRecording ? "Stop Recording" : "Start Recording"}
          </RecordButton>
        </FloatingBar>

        {/* Input Modal */}
        {isInputModalOpen && (
          <InputNoteModal
            isOpen={isInputModalOpen}
            onClose={() => setIsInputModalOpen(false)}
            inputType={modalType}
            note={newNote}
            setNote={setNewNote}
            handleSaveNote={handleSaveNote}
          />
        )}

        {/* Note Modal */}
        {isNoteModalOpen && (
          <NoteModal
            isOpen={isNoteModalOpen}
            onClose={() => setIsNoteModalOpen(false)}
            note={selectedNote}
          />
        )}
      </MainContent>
    </Container>
  );
};

export default Dashboard;

/* Styled Components */
const Container = styled.div`
  display: flex;
  height: 100vh;
  background: #f9f9f9;
`;

const Sidebar = styled.div`
  width: 250px;
  background: #fff;
  padding: 20px;
  box-shadow: 2px 0px 5px rgba(0, 0, 0, 0.1);
`;

const FloatingBar = styled.div`
  position: fixed;
  bottom: 20px;
  left: 60%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 800px;
  background: white;
  padding: 12px 20px;
  border-radius: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
`;

const LeftIcons = styled.div`
  display: flex;
  gap: 10px;
`;

const FloatingIcon = styled.div`
  font-size: 16px;
  background: #f1f1f1;
  border-radius: 50%;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const RecordButton = styled.div`
  display: flex;
  align-items: center;
  background: red;
  color: white;
  border: none;
  padding: 10px 12px;
  border-radius: 20px;
  cursor: pointer;
`;

/* Sidebar Components */
const Brand = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Menu = styled.div`
  flex: 1;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  background: ${(props) => (props.active ? "#E7D7FF" : "transparent")};
`;

/* User Section */
const UserSection = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 0;
`;

const UserIcon = styled.div`
  background: black;
  color: white;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;

const UserName = styled.span`
  margin-left: 10px;
`;

/* Main Content */
const MainContent = styled.div`
  flex: 1;
  padding: 20px;
`;

/* Header */
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 10px;
  background: #f1f1f1;
  width: 60%;
`;

const SortButton = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 16px;
`;

/* Notes Grid */
const NotesGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

/* Note Card */
const NoteCard = styled.div`
  background: white;
  padding: 15px;
  border-radius: 12px;
  width: 250px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: 0.3s ease-in-out;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transform: scale(1.02);
  }
`;

const NoteHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NoteTimestamp = styled.span`
  font-size: 12px;
  color: gray;
`;

const AudioTag = styled.div`
  font-size: 12px;
  background: #f1f1f1;
  padding: 4px 8px;
  border-radius: 8px;
`;

const TextTag = styled.div`
  font-size: 12px;
  background: #f1f1f1;
  padding: 4px 8px;
  border-radius: 8px;
`;

const NoteTitle = styled.h3`
  font-size: 16px;
  margin-top: 10px;
`;

const NoteText = styled.p`
  font-size: 14px;
  color: gray;
`;

const NoteFooter = styled.div`
  font-size: 12px;
  margin-top: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
  color: #555;
`;

/* Actions */
const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #777;

  &:hover {
    color: black;
    transform: scale(1.1);
  }
`;
