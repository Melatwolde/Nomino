'use client';

import { useState, useEffect } from 'react';
import Hero from "../componants/hero";
import ChatInput from "../componants/chat";

const MainPage = () => {
  const [showHero, setShowHero] = useState(true); // State to control the visibility of the Hero component
  const [messages, setMessages] = useState([]); // State to track messages

  // Check localStorage to determine if there are existing messages
  useEffect(() => {
    const storedMessages = localStorage.getItem('messages');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
      setShowHero(false); // Hide Hero if there are existing messages
    }
  }, []);

  const handleApiResponse = () => {
    setShowHero(false); // Hide the Hero component when the API response is received
  };

  const handleMessagesUpdate = (newMessages: any) => {
    setMessages(newMessages);
    localStorage.setItem('messages', JSON.stringify(newMessages)); // Persist messages in localStorage
  };

  return (
    <div className="flex flex-col h-screen ">
    {showHero && (
        <div className="flex-grow mt-20">
        <Hero />
        </div>
    )}
    <ChatInput onApiResponse={handleApiResponse} onMessagesUpdate={handleMessagesUpdate} />
    </div>

  );
};

export default MainPage;