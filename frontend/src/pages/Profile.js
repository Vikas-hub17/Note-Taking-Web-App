import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { AiOutlineEdit, AiOutlineLogout, AiOutlineCheck, AiOutlineCamera } from "react-icons/ai";

const Profile = ({ setUsername }) => {
  // Sample user data (Replace with backend integration)
  const [user, setUser] = useState({
    name: "Vikas",
    email: "johndoe@example.com",
    joined: "January 2024",
    profilePic: "",
  });

  const [password, setPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingField, setIsEditingField] = useState({ name: false, email: false });

  // Handle profile updates
  const handleSaveChanges = () => {
    alert("Profile updated successfully! (Integrate backend to save changes)");
    setIsEditing(false);
    setUsername(user.name);
  };

  // Handle Logout
  const handleLogout = () => {
    alert("Logged out successfully! (Redirect to login page)");
  };

  // Handle Profile Picture Upload
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUser((prev) => ({
        ...prev,
        profilePic: URL.createObjectURL(file),
      }));
    }
  };

  return (
    <ProfileContainer>
      <ProfileCard>
        {/* Profile Picture */}
        <ProfilePic>
          {user.profilePic ? (
            <img src={user.profilePic} alt="Profile" />
          ) : (
            user.name.charAt(0).toUpperCase()
          )}
          <CameraIcon>
            <input type="file" accept="image/*" onChange={handleProfilePicChange} hidden />
            <AiOutlineCamera />
          </CameraIcon>
        </ProfilePic>

        {/* Personal Information */}
        <UserInfo>
          <EditableField>
            {isEditingField.name ? (
              <ProfileInput
                type="text"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                autoFocus
              />
            ) : (
              <h2>{user.name}</h2>
            )}
            <EditIcon onClick={() => setIsEditingField({ ...isEditingField, name: !isEditingField.name })}>
              {isEditingField.name ? <AiOutlineCheck /> : <AiOutlineEdit />}
            </EditIcon>
          </EditableField>

          <EditableField>
            {isEditingField.email ? (
              <ProfileInput
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                autoFocus
              />
            ) : (
              <p>{user.email}</p>
            )}
            <EditIcon onClick={() => setIsEditingField({ ...isEditingField, email: !isEditingField.email })}>
              {isEditingField.email ? <AiOutlineCheck /> : <AiOutlineEdit />}
            </EditIcon>
          </EditableField>

          <span>Joined: {user.joined}</span>
        </UserInfo>
      </ProfileCard>

      {/* Password Change Section */}
      <EditSection>
        <InputLabel>New Password</InputLabel>
        <ProfileInput
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <SaveButton onClick={handleSaveChanges}>Save Changes</SaveButton>
      </EditSection>

      {/* Logout Button */}
      <LogoutButton onClick={handleLogout}>
        <AiOutlineLogout /> Logout
      </LogoutButton>
    </ProfileContainer>
  );
};

export default Profile;

/* Styled Components */
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ProfileContainer = styled.div`
  max-width: 500px;
  margin: 40px auto;
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  animation: ${fadeIn} 0.5s ease-in-out;
`;

const ProfileCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
`;

const ProfilePic = styled.div`
  width: 90px;
  height: 90px;
  background: #007bff;
  color: white;
  font-size: 36px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  animation: ${fadeIn} 0.5s ease-in-out;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CameraIcon = styled.label`
  position: absolute;
  bottom: 5px;
  right: 5px;
  background: white;
  padding: 5px;
  border-radius: 50%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  cursor: pointer;

  svg {
    font-size: 14px;
    color: #007bff;
  }
`;

const UserInfo = styled.div`
  text-align: center;

  h2 {
    font-size: 22px;
    margin: 5px 0;
  }

  p {
    font-size: 14px;
    color: gray;
  }

  span {
    font-size: 12px;
    color: #555;
  }
`;

const EditableField = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
`;

const EditIcon = styled.div`
  font-size: 18px;
  cursor: pointer;
  transition: 0.2s;
  color: #007bff;

  &:hover {
    transform: scale(1.1);
  }
`;

const ProfileInput = styled.input`
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
  transition: all 0.3s ease;

  &:focus {
    border-color: #6c63ff;
    box-shadow: 0 0 8px rgba(108, 99, 255, 0.3);
    outline: none;
  }
`;

const SaveButton = styled.button`
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border-radius: 6px;
  background: #28a745;
  color: white;
  border: none;
  cursor: pointer;
  transition: 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 16px;

  &:hover {
    background: #218838;
    transform: scale(1.05);
  }
`;

const LogoutButton = styled(SaveButton)`
  background: #dc3545;
  margin-top: 20px;

  &:hover {
    background: #c82333;
  }
`;

const EditSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const InputLabel = styled.label`
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
`;

