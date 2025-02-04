import React, { useState, useEffect } from "react";
import axios from "axios";
import { styled } from "@mui/system";
import { IconButton, Button, TextField, List, ListItem, Typography, Card, CardContent } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import SearchIcon from "@mui/icons-material/Search";
import SortIcon from "@mui/icons-material/Sort";
import HomeIcon from "@mui/icons-material/Home";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import Avatar from "@mui/material/Avatar";

// Styled Components for better UI
const Container = styled("div")({
  display: "flex",
  height: "100vh",
  backgroundColor: "#F9F9F9",
});

const Sidebar = styled("div")({
  width: "250px",
  background: "#F6F1FC",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  boxShadow: "2px 0px 5px rgba(0,0,0,0.1)",
});

const SidebarItem = styled(Button)({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  textTransform: "none",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "10px",
  backgroundColor: "transparent",
  "&:hover": {
    backgroundColor: "#E4D9FC",
  },
});

const Content = styled("div")({
  flex: 1,
  padding: "20px",
  overflowY: "auto",
});

const NotesContainer = styled("div")({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gap: "20px",
});

const NoteCard = styled(Card)({
  background: "#fff",
  padding: "15px",
  borderRadius: "10px",
  boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "scale(1.02)",
  },
});

const RecordButton = styled(Button)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#FF3B30",
  color: "#fff",
  padding: "10px 20px",
  borderRadius: "30px",
  fontWeight: "bold",
  "&:hover": {
    backgroundColor: "#D32F2F",
  },
});

const FloatingActionBar = styled("div")({
  position: "fixed",
  bottom: "20px",
  right: "20px",
  display: "flex",
  alignItems: "center",
  gap: "10px",
});

const UserProfile = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "10px",
});

// Dashboard Component
const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");
  const [recognition, setRecognition] = useState(null);

  // Fetch notes from MongoDB
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/notes");
      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  // Create a new text note
  const handleCreateNote = async () => {
    if (!text.trim()) return;
    try {
      await axios.post("http://localhost:5000/api/notes", { content: text });
      fetchNotes(); // Refresh notes
      setText("");
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  // Start recording
  const startRecording = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }
    const recognitionInstance = new window.webkitSpeechRecognition();
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = false;
    recognitionInstance.lang = "en-US";

    recognitionInstance.onstart = () => setIsRecording(true);
    recognitionInstance.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      setText(transcript);
      handleCreateNote();
    };
    recognitionInstance.onend = () => setIsRecording(false);
    
    setRecognition(recognitionInstance);
    recognitionInstance.start();
  };

  // Stop recording
  const stopRecording = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  // Sort notes
  const handleSort = () => {
    const sortedNotes = [...notes].sort((a, b) => 
      sortOrder === "newest"
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt)
    );
    setNotes(sortedNotes);
    setSortOrder(sortOrder === "newest" ? "oldest" : "newest");
  };

  return (
    <Container>
      {/* Sidebar */}
      <Sidebar>
        <div>
          <Typography variant="h6" gutterBottom>
            AI Notes
          </Typography>
          <SidebarItem startIcon={<HomeIcon />}>Home</SidebarItem>
          <SidebarItem startIcon={<StarBorderIcon />}>Favourites</SidebarItem>
        </div>
        <UserProfile>
          <Avatar>A</Avatar>
          <Typography>Emmanual Vincent</Typography>
        </UserProfile>
      </Sidebar>

      {/* Main Content */}
      <Content>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
          <TextField
            variant="outlined"
            placeholder="Search"
            size="small"
            InputProps={{ startAdornment: <SearchIcon /> }}
          />
          <IconButton onClick={handleSort}><SortIcon /></IconButton>
        </div>

        {/* Notes List */}
        <NotesContainer>
          {notes.map((note) => (
            <NoteCard key={note._id}>
              <CardContent>
                <Typography variant="subtitle2">{new Date(note.createdAt).toLocaleString()}</Typography>
                <Typography variant="h6">{note.content}</Typography>
              </CardContent>
            </NoteCard>
          ))}
        </NotesContainer>

        {/* Floating Action Bar */}
        <FloatingActionBar>
          <TextField 
            variant="outlined" 
            size="small" 
            placeholder="Write a note..." 
            value={text} 
            onChange={(e) => setText(e.target.value)}
          />
          <RecordButton onClick={isRecording ? stopRecording : startRecording}>
            {isRecording ? <StopIcon /> : <MicIcon />} {isRecording ? "Stop" : "Start Recording"}
          </RecordButton>
        </FloatingActionBar>
      </Content>
    </Container>
  );
};

export default Dashboard;
