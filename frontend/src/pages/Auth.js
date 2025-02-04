// /client/src/pages/Auth.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #1e3c72, #2a5298);
  color: white;
  font-family: 'Inter', sans-serif;
`;
const Card = styled(motion.div)`
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  color: black;
  width: 400px;
  text-align: center;
`;
const Input = styled.input`
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  width: 100%;
  margin-bottom: 15px;
  font-size: 16px;
`;
const Button = styled(motion.button)`
  padding: 12px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  width: 100%;
  font-size: 16px;
  font-weight: bold;
`;
const SwitchText = styled.p`
  margin-top: 15px;
  color: #007bff;
  cursor: pointer;
  text-align: center;
  font-size: 14px;
  font-weight: bold;
`;
const Title = styled.h1`
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
`;

const Auth = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('John Doe');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Dummy data authentication
    navigate('/dashboard');
  };

  return (
    <Container initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
      <Card initial={{ y: -50 }} animate={{ y: 0 }} transition={{ duration: 0.5 }}>
        <Title>{isSignup ? 'Create an Account' : 'Welcome Back'}</Title>
        <form onSubmit={handleSubmit}>
          {isSignup && <Input type='text' placeholder='Full Name' value={name} onChange={(e) => setName(e.target.value)} />}
          <Input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type='submit'>
            {isSignup ? 'Sign Up' : 'Login'}
          </Button>
        </form>
        <SwitchText onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? 'Already have an account? Login' : 'New user? Create an account'}
        </SwitchText>
      </Card>
    </Container>
  );
};

export default Auth;
