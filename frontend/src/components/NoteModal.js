// /client/src/components/NoteModal.js
import React from 'react';
import styled from 'styled-components';

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
`;
const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 5px;
  width: 400px;
`;
const Button = styled.button`
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const NoteModal = ({ isOpen, onClose, note }) => {
  if (!isOpen) return null;
  return (
    <ModalContainer>
      <ModalContent>
        <h2>{note?.title}</h2>
        <p>{note?.content}</p>
        <Button onClick={onClose}>Close</Button>
      </ModalContent>
    </ModalContainer>
  );
};

export default NoteModal;