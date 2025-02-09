import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaSearch, } from "react-icons/fa";
import { MdSort, } from "react-icons/md";
import { BsMicFill, BsMicMute } from "react-icons/bs";
import { AiFillHome,AiOutlineUser, AiOutlineStar, AiOutlineCopy, AiOutlineEdit, AiOutlineDelete, AiOutlinePicture } from "react-icons/ai";
import NoteModal from "../components/NoteModal";
import InputNoteModal from "../components/InputNoteModal";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition"; // Import speech recognition hook
import Profile from "../pages/Profile";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

const Dashboard = () => {
  const [isFloatingBarVisible, setIsFloatingBarVisible] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { transcript, isRecording, startRecording, stopRecording } = useSpeechRecognition(); // Use speech recognition
  const [selectedNote, setSelectedNote] = useState(null);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // "text", "audio", "image"
  const [searchQuery, setSearchQuery] = useState("");
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [inputType, setInputType] = useState("");
  const [activePage, setActivePage] = useState("home");
  const [username, setUsername] = useState("Vikas");
 
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

  const displayedNotes = notes.filter((note) => {
    if (activePage === "favorites") return note.favorite; // ✅ Show only favorited notes
    return true; // ✅ Show all notes for "Home" or "Profile"
  });

  const handleNavigation = (page) => {
    setActivePage(page); // ✅ Updates the active page
  };

  const handleSaveChanges = () => {
    alert("Profile updated successfully! (In real app, update MongoDB)");
  };

  useEffect(() => {
    if (!isRecording && transcript) {
      // Show prompt for title input after recording stops
      const title = prompt("Enter a title for your note:");
      if (title) {
        handleSaveNote(title, transcript);
      }
    }
  }, [isRecording, transcript]);
  
  const deleteNote = (noteId) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
  };
  
  const updateNote = (updatedNote) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) => (note.id === updatedNote.id ? updatedNote : note))
    );
  };

  const handleCopy = (e, content) => {
    e.stopPropagation(); // Prevent modal from opening
    navigator.clipboard.writeText(content);
    alert("Note copied!");
  };

  const handleEdit = (e, note) => {
    e.stopPropagation(); // Prevent modal from opening
    const newTitle = prompt("Edit note title:", note.title);
    if (newTitle) {
      setNotes((prevNotes) =>
        prevNotes.map((n) => (n.id === note.id ? { ...n, title: newTitle } : n))
      );
    }
  };

  const handleDelete = (e, noteId) => {
    e.stopPropagation(); // Prevent modal from opening
    const confirmDelete = window.confirm("Are you sure you want to delete this note?");
    if (confirmDelete) {
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
    }
  };

  const openInputModal = (type) => {
    setModalType(type);
    setInputType(type);
    setIsInputModalOpen(true);
  };

 // Toggle favorite status of a note
 const toggleFavorite = (noteId) => {
  setNotes((prevNotes) =>
    prevNotes.map((note) =>
      note.id === noteId ? { ...note, favorite: !note.favorite } : note
    )
  );
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
  
    const newNoteObj = {
      id: notes.length + 1,
      type: modalType,
      title: title,
      text: content,
      timestamp: new Date().toLocaleString(),
      duration: modalType === "audio" ? "00:00" : null,
    };
  
    setNotes(prevNotes => [...prevNotes, newNoteObj]);
    setNewNote({ title: "", content: "" });
    setIsInputModalOpen(false);
    console.log("Saving Note:", newNoteObj);
  };

return (
    <Container>
      {/* Sidebar */}
      <Sidebar>
        <Brand>AI Notes</Brand>
        <Menu>
          <MenuItem active={activePage === "home"} onClick={() => handleNavigation("home")}>
            <AiFillHome />
            Home
          </MenuItem>
          <MenuItem active={activePage === "favorites"} onClick={() => handleNavigation("favorites")}>
            <AiOutlineStar />
            Favorites
          </MenuItem>
          <MenuItem active={activePage === "profile"} onClick={() => setActivePage("profile")}>
            <AiOutlineUser />
            Profile
          </MenuItem>
        </Menu>
        <UserProfile>
          <ProfilePic>
            {username.charAt(0)}
          </ProfilePic>
          <Username>{username}</Username>
        </UserProfile>
      </Sidebar>

      {/* Main Content */}
      <MainContent>
      {activePage === "profile" ? (
            <Profile setUsername={setUsername} />  // ✅ Render Profile page when "Profile" is clicked
        ) : (
          <>
            {/* ✅ Notes & Favorites Page */}
            <Header>
              {activePage === "favorites" ? "Favorite Notes" : "All Notes"}
              <SearchBar focused={isSearchFocused}>
  <SearchIcon>
    <FaSearch />
  </SearchIcon>
  <SearchInput
    type="text"
    placeholder="Search notes..."
    onFocus={() => setIsSearchFocused(true)}
    onBlur={() => setIsSearchFocused(false)}
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
</SearchBar>
           <SortButton>
                <MdSort /> Sort
              </SortButton>
            </Header>

        {/* Notes Grid */}
        <NotesGrid>
  {displayedNotes
    .filter((note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      note.text.toLowerCase().includes(searchQuery.toLowerCase())
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
                  <ActionButton onClick={(e) => handleCopy(e, note.content)}>
                    <AiOutlineCopy />
                  </ActionButton>
                  <ActionButton onClick={(e) => handleEdit(e, note)}>
                    <AiOutlineEdit />
                  </ActionButton>
                  <ActionButton onClick={(e) => handleDelete(e, note.id)}>
                    <AiOutlineDelete />
                  </ActionButton>
                </Actions>
              </NoteCard>
            ))}
        </NotesGrid>
        </>
      )}  
        <FloatingBar visible={isFloatingBarVisible}>
          <LeftIcons>
            <FloatingIcon onClick={() => openInputModal("image")}>
              <AiOutlinePicture />
            </FloatingIcon>
            <FloatingIcon onClick={() => openInputModal("text")}>
              <AiOutlineEdit />
            </FloatingIcon>
          </LeftIcons>

          <RecordButton onClick={() => openInputModal("audio")}>
          {isRecording ? <BsMicMute /> : <BsMicFill />}
          {isRecording ? "Stop Recording" : "Start Recording"}
        </RecordButton>
        </FloatingBar>

        {/* Arrow Button to Toggle Floating Bar */}
      <ArrowButton onClick={() => setIsFloatingBarVisible(!isFloatingBarVisible)}>
        {isFloatingBarVisible ? <FaChevronDown /> : <FaChevronUp />}
      </ArrowButton>

        {/* Input Modal */}
{isInputModalOpen && (
  <InputNoteModal
    isOpen={isInputModalOpen}
    onClose={() => setIsInputModalOpen(false)}
    inputType={modalType}
    addNewNote={(note) => setNotes((prevNotes) => [...prevNotes, note])} // ✅ Updates Dashboard
    setNotes={setNotes}
    transcript={transcript}
    isRecording={isRecording}
    startRecording={startRecording}
    stopRecording={stopRecording}
  />
)}

{isNoteModalOpen && selectedNote && (
  <NoteModal
    updateNote={(updatedNote) => {
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === updatedNote.id ? updatedNote : note
        )
      );
    }}  // ✅ Updates the edited note in Dashboard

    deleteNote={(noteId) => {
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
      setIsNoteModalOpen(false);
    }}  // ✅ Removes deleted note from Dashboard

    isOpen={isNoteModalOpen}
    onClose={() => setIsNoteModalOpen(false)}
    note={selectedNote}
    toggleFavorite={(noteId) => {
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === noteId ? { ...note, favorite: !note.favorite } : note
        )
      );
    }}
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
  background: #f4f4f4;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const FloatingBar = styled.div`
  position: fixed;
  bottom: ${(props) => (props.visible ? "20px" : "-80px")}; /* Smooth slide up/down */
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 750px;
  background: rgba(255, 255, 255, 0.95);
  padding: 12px 20px;
  border-radius: 30px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  transition: bottom 0.4s ease-in-out, opacity 0.3s ease-in-out;
  opacity: ${(props) => (props.visible ? "1" : "0")};
  visibility: ${(props) => (props.visible ? "visible" : "hidden")};
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
  background: #f1f1f1;
  padding: 12px 16px;
  border-radius: 25px;
  width: ${(props) => (props.focused ? "350px" : "280px")};  /* Expand when focused */
  transition: all 0.3s ease-in-out;
  box-shadow: ${(props) => (props.focused ? "0 4px 10px rgba(0, 0, 0, 0.15)" : "none")};

  &:hover {
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  }
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

const Username = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-top: 20px;
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

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: auto;
`;

const ProfilePic = styled.div`
  width: 40px;
  height: 40px;
  background: #007bff;
  color: white;
  font-size: 20px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
`;

const ArrowButton = styled.button`
  position: fixed;
  bottom: ${(props) => (props.visible ? "110px" : "20px")}; /* Half Hidden Initially */
  left: 90%;
  transform: translateX(-50%);
  background: ${(props) => (props.visible ? "#6C63FF" : "#4CAF50")};
  color: white;
  border: none;
  padding: 12px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 15px;
  transition: bottom 0.4s ease-in-out, background 0.3s ease-in-out, transform 0.2s ease-in-out;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${(props) => (props.visible ? "#554CC8" : "#388E3C")};
    transform: translateX(-50%) scale(1.1);
  }

  &:active {
    transform: translateX(-50%) scale(0.95);
  }
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  font-size: 16px;
  color: #333;
  outline: none;
  padding-left: 8px;
  transition: width 0.3s ease-in-out;

  &::placeholder {
    color: #888;
  }
`;

const SearchIcon = styled.div`
  font-size: 18px;
  color: #555;
  transition: all 0.3s ease-in-out;
`;