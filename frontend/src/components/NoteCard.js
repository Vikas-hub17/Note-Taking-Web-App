import React, { useState } from "react";
import NoteModal from "./NoteModal";

const NoteCard = ({ note }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div onClick={() => setIsModalOpen(true)}>
        <h3>{note.title}</h3>
        <p>{note.timestamp}</p>
      </div>

      <NoteModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        note={note} 
      />
    </>
  );
};

export default NoteCard;
