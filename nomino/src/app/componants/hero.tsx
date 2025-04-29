'use client'
import React, { useState, useEffect } from 'react';

const Hero = () => {
    const [messageIndex, setMessageIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [typingSpeed, setTypingSpeed] = useState(150);
    const [showCursor, setShowCursor] = useState(true);

    const messages = [
        { text: "Got an idea? Let's name it together!", emoji: "💡" },
        { text: "Describe your channel or project below.", emoji: "📝" },
        { text: "Our AI will generate catchy, relevant names.", emoji: "🤖" },
        { text: "We'll also check if your name is available!", emoji: "🔍" },
        { text: "Smart suggestions based on your description.", emoji: "✨" },
        { text: "Make your first impression unforgettable.", emoji: "🚀" },
        { text: "Ready to find the perfect name?", emoji: "🎯" }
    ]

    useEffect(() => {
        const handleTyping = () => {
            const currentMessage = messages[messageIndex].text;
            if (isDeleting) {
                setDisplayedText(currentMessage.substring(0, displayedText.length - 1));
                setTypingSpeed(50);
            } else {
                setDisplayedText(currentMessage.substring(0, displayedText.length + 1));
                setTypingSpeed(150);
            }

            if (!isDeleting && displayedText === currentMessage) {
                setTimeout(() => setIsDeleting(true), 2000);
            } else if (isDeleting && displayedText === '') {
                setIsDeleting(false);
                setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
            }
        };

        const typingInterval = setInterval(handleTyping, typingSpeed);
        const cursorInterval = setInterval(() => {
            setShowCursor((prev) => !prev);
        }, 500);

        return () => {
            clearInterval(typingInterval);
            clearInterval(cursorInterval);
        };
    }, [displayedText, isDeleting, messageIndex, typingSpeed, messages]);

    return (
        <div className="flex flex-col items-center justify-center ">
            <div className="flex flex-row w-auto gap-3 rounded-xl px-4 py-2 border border-neutral-800">
                <div className="w-auto py-1 px-[6px] rounded-full bg-neutral-800">{messages[messageIndex].emoji}</div>
                <h1 className="mt-1">{displayedText}{showCursor && '|'}</h1>
            </div>
            <h1 className="w-[800px] text-[40px] text-center">Find the Perfect Name with AI – Instantly</h1>
            <h3 className="w-[900px] text-[18px] text-center text-neutral-500">Naming your project or channel can be tough — but it doesn't have to be. Just tell us what it’s about, and our AI will generate unique, catchy, and relevant names for you. Plus, we’ll check if they’re available online. Perfect for startups, content creators, and makers of all kinds.</h3>
            <div className='flex flex-row gap-4 mt-7'>
                <div className='w-auto px-4 py-2 border border-neutral-600 rounded-xl bg-neutral-600 text-white'>
                    Try a Sample Idea
                </div>
            <div className='w-auto px-4 py-2 border border-neutral-800 rounded-xl bg-neutral-800 text-white'> Describe Your Idea</div>
            </div>

        </div>
    );
};

export default Hero;