import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaSearch, FaRegCopy, FaExpand, FaStar } from "react-icons/fa";
import { MdSort, MdDelete, MdEdit } from "react-icons/md";
import { BsMicFill, BsThreeDots } from "react-icons/bs";
import { AiFillHome, AiOutlineStar, AiOutlinePicture, AiOutlineEdit } from "react-icons/ai";
import NoteModal from "../components/NoteModal";
import InputNoteModal from "../components/InputNoteModal";

const Dashboard = () => {
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // "text", "audio", "image"
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
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

  const [newNote, setNewNote] = useState({
    title: "",
    transcript: "",
    audioUrl: "",
    image: "",
  });

  // Open input modal for text, image, or audio
  const openInputModal = (type) => {
    setModalType(type);
    setIsNoteModalOpen(false); // Close NoteModal if open
    setIsInputModalOpen(true);
  };

  // Open NoteModal when clicking a note card
  const openNoteModal = (note) => {
    setSelectedNote(note);
    setIsInputModalOpen(false); // Close InputModal if open
    setIsNoteModalOpen(true);
  };

  // Search filtering function
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Copy note content to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Note copied to clipboard!");
  };

  // Delete note function
  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  // Rename note function
  const renameNote = (id) => {
    const newTitle = prompt("Enter new title:");
    if (newTitle) {
      setNotes(notes.map((note) => (note.id === id ? { ...note, title: newTitle } : note)));
    }
  };

  // Add new note function
const addNewNote = (newNote) => {
  setNotes([...notes, { ...newNote, id: Date.now(), timestamp: new Date().toLocaleString() }]);
};

useEffect(() => {
  const fetchNotes = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const response = await fetch("http://localhost:5000/api/notes", {
      headers: { "Authorization": `Bearer ${token}` },
    });

    if (response.ok) {
      const data = await response.json();
      setNotes(data);
    } else {
      console.error("Failed to fetch notes");
    }
  };

  fetchNotes();
}, []);

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
        {/* Search & Sort Section */}
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
          {filteredNotes.map((note) => (
            <NoteCard key={note.id} onClick={() => openNoteModal(note)}>
              <NoteHeader>
                <NoteTimestamp>{note.timestamp}</NoteTimestamp>
                {note.type === "audio" ? <AudioTag><BsMicFill /> {note.duration}</AudioTag> : <TextTag>Text</TextTag>}
              </NoteHeader>

              <NoteTitle>{note.title}</NoteTitle>
              <NoteText>{note.text}</NoteText>

              {note.hasImage && <NoteFooter><AiOutlinePicture /> 1 Image</NoteFooter>}

              <Actions>
                <ActionButton onClick={() => copyToClipboard(note.text)}><FaRegCopy /></ActionButton>
                <ActionButton onClick={() => renameNote(note.id)}><MdEdit /></ActionButton>
                <ActionButton onClick={() => deleteNote(note.id)}><MdDelete /></ActionButton>
                <BsThreeDots />
              </Actions>
            </NoteCard>
          ))}
        </NotesGrid>

        {/* Note Modal (View/Edit Existing Notes) */}
        {isNoteModalOpen && (
  <NoteModal
    isOpen={isNoteModalOpen}
    onClose={() => setIsNoteModalOpen(false)}
    note={selectedNote}
    setNote={(updatedNote) => {
      setNotes(notes.map((n) => (n.id === selectedNote.id ? updatedNote : n)));
      setSelectedNote(updatedNote);
    }}
  />
)}
        <FloatingBar>
  {/* Left-aligned icons */}
  <LeftIcons>
    <FloatingIcon onClick={() => openInputModal("image")}>
      <AiOutlinePicture />
    </FloatingIcon>
    <FloatingIcon onClick={() => openInputModal("text")}>
      <AiOutlineEdit />
    </FloatingIcon>
  </LeftIcons>

  {/* Right-aligned record button */}
  <RecordButton onClick={() => openInputModal("audio")}>
    <BsMicFill />
    Record
  </RecordButton>
</FloatingBar>

{isInputModalOpen && (
  <InputNoteModal 
    isOpen={isInputModalOpen} 
    onClose={() => setIsInputModalOpen(false)} 
    inputType={modalType} 
    addNewNote={addNewNote} 
  />
)}
      </MainContent>
    </Container>
  );
};

export default Dashboard;


/* Styling */
const Container = styled.div`
  display: flex;
  height: 100vh;
  background: #f9f9f9;
`;

/* Sidebar */
const Sidebar = styled.div`
  width: 250px;
  background: #fff;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-shadow: 2px 0px 5px rgba(0, 0, 0, 0.1);
`;

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
  gap: 20px;
`;

const NoteCard = styled.div`
  background: white;
  padding: 15px;
  border-radius: 12px;
  width: 250px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
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
`;

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
`;

const FloatingBar = styled.div`
  position: fixed;
  bottom: 20px;
  left: 60%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 800px; /* Increased width for proper spacing */
  background: white;
  padding: 12px 20px;
  border-radius: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease-in-out;

  &:hover {
    transform: translateX(-50%) scale(1.05);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
  }
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
  transition: all 0.2s ease-in-out;

  &:hover {
    background: #e0e0e0;
    transform: scale(1.1);
  }
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
  transition: all 0.3s ease-in-out;

  &:hover {
    background: darkred;
    transform: scale(1.1);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: ${(props) => (props.isOpen ? "flex" : "none")};
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: ${(props) => (props.fullscreen ? "90%" : "50%")};
  height: ${(props) => (props.fullscreen ? "90vh" : "auto")};
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
`;

const FavoriteButton = styled.button`
  background: ${(props) => (props.favorited ? "#FFD700" : "#ccc")};
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
`;

const ImageUpload = styled.input`
  margin-top: 10px;
`;

