import axios from "axios";

const API_URL = "http://localhost:5000/api/notes"; // Change based on your backend

export const fetchNotes = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching notes:", error);
    return [];
  }
};

export const saveNote = async (note) => {
  try {
    await axios.post(API_URL, note);
  } catch (error) {
    console.error("Error saving note:", error);
  }
};
