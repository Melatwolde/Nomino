'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import SendIcon from '@mui/icons-material/Send';

export default function ChatInput({
  onApiResponse,
  onMessagesUpdate,
}: {
  onApiResponse: () => void;
  onMessagesUpdate: (messages: any) => void;
}) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ type: 'user' | 'ai', content: { name: string; meaning: string }[] }[]>([]);
  const [loading, setLoading] = useState(false); 
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null); 

  useEffect(() => {
    const storedMessages = localStorage.getItem('messages');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = message; 
    setLoading(true);

    try {
      const response = await fetch('/api/generate_names', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description: userMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch names');
      }

      const data = await response.json();
      console.log('Response from backend:', data);
      const namesAndMeanings = data.namesAndMeanings || [];

      const updatedMessages = [
        ...messages,
        { type: 'user' as const, content: [{ name: userMessage, meaning: '' }] },
        { type: 'ai' as const, content: namesAndMeanings },
      ];
      setMessages(updatedMessages);
      onMessagesUpdate(updatedMessages); 

      setMessage('');
      onApiResponse(); 
    } catch (error) {
      console.error('Error:', error);
      const updatedMessages = [
        ...messages,
        { type: 'user' as const, content: [{ name: userMessage, meaning: '' }] },
        { type: 'ai' as const, content: [{ name: 'Error', meaning: 'Sorry, something went wrong.' }] },
      ];
      setMessages(updatedMessages);
      onMessagesUpdate(updatedMessages); 
    } finally {
      setLoading(false); 
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen">
      {/* Scrollable Messages Section */}
      <div className="flex-grow overflow-y-auto px-4 pb-20 pt-16">
        <div className="w-full max-w-[900px] mx-auto space-y-6">
          {messages.map((msg, index) => (
            <div key={index}>
              {msg.type === 'user' ? (
                <p className="text-gray-700">You: {msg.content[0].name}</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {msg.content.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col p-5 bg-white rounded-2xl shadow-md hover:shadow-lg transition h-auto"
                    >
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {item.name}
                      </h3>
                      <div className="w-6 h-1 bg-gray-300 rounded mb-3"></div>
                 
                      <p className="text-sm text-gray-600 leading-relaxed italic">
                        {item.meaning}
                      </p>
                    </div>
                  ))}
                </div>
              )}

            </div>
          ))}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex justify-center items-center mt-4">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-400"></div>
              </div>
            </div>
          )}

          {/* Scroll to Bottom Anchor */}
          <div ref={messagesEndRef}></div>
        </div>
      </div>

      <div
        className={`${
          messages.length > 0 ? 'fixed bottom-0' : 'absolute mt-20 transform -translate-y-1/2'
        } left-0 w-full bg-white p-4 transition-all`}
      >
        <div className="flex items-end gap-2 max-w-[900px] mx-auto">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            rows={1}
            className="flex-grow bg-gray-100 custom-textarea resize-none text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
          />
          <Button
            onClick={handleSend}
            size="icon"
            className="rounded-full w-[40px] h-[40px] bg-neutral-300 hover:bg-neutral-500 p-2"
          >
            <SendIcon className="h-5 w-5 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
}