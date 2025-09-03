import React, { useState, useEffect, useRef } from 'react';
import { Chat, Message, Attachment, User } from '../types';
import { MessageBubble } from './MessageBubble';
import { MenuIcon, SearchIcon, SendIcon, ArrowLeftIcon, AttachmentIcon } from './Icons';

interface ChatWindowProps {
  chat: Chat | null;
  currentUser: User;
  onSendMessage: (text: string, attachment?: Attachment) => void;
  onBack: () => void;
  isMobileView: boolean;
}

const ChatHeader: React.FC<{ chat: Chat; onBack: () => void; isMobileView: boolean; }> = ({ chat, onBack, isMobileView }) => (
    <header className="flex items-center p-3 bg-gray-100 dark:bg-wa-dark-secondary border-b border-gray-200 dark:border-gray-700">
      {isMobileView && (
        <button onClick={onBack} className="mr-3 text-gray-600 dark:text-gray-300">
            <ArrowLeftIcon className="w-6 h-6" />
        </button>
      )}
      <img src={chat.participant.avatar} alt={chat.participant.name} className="w-10 h-10 rounded-full mr-3" />
      <div className="flex-1">
        <p className="font-semibold text-gray-800 dark:text-gray-100">{chat.participant.name}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{chat.participant.job} - {chat.participant.isOnline ? 'online' : 'offline'}</p>
      </div>
      <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-300">
        <SearchIcon className="w-6 h-6 cursor-pointer" />
        <MenuIcon className="w-6 h-6 cursor-pointer" />
      </div>
    </header>
);

const MessageArea: React.FC<{ messages: Message[], currentUserId: string }> = ({ messages, currentUserId }) => {
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="flex-1 p-4 overflow-y-auto bg-gray-200 dark:bg-wa-dark">
            <div className="flex flex-col space-y-4">
            {messages.map(msg => (
                <MessageBubble key={msg.id} message={msg} isSender={msg.senderId === currentUserId} />
            ))}
            <div ref={messagesEndRef} />
            </div>
        </div>
    );
};

const ChatInput: React.FC<{ onSendMessage: (text: string, attachment?: Attachment) => void }> = ({ onSendMessage }) => {
    const [text, setText] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim()) {
            onSendMessage(text.trim());
            setText('');
        }
    };

    const handleAttachClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onSendMessage('', { name: file.name, type: file.type });
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
         <footer className="p-3 bg-gray-100 dark:bg-wa-dark-secondary border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  aria-label="Attach file"
                  accept="image/*,application/pdf"
                />
                <button type="button" onClick={handleAttachClick} className="p-2 text-gray-600 dark:text-gray-300 hover:text-wa-teal rounded-full transition-colors" aria-label="Attach file">
                    <AttachmentIcon className="w-6 h-6" />
                </button>
                <form onSubmit={handleSubmit} className="flex-1 flex items-center ml-2">
                    <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type a message"
                    className="flex-1 bg-gray-200 dark:bg-wa-dark-secondary text-gray-800 dark:text-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-wa-teal"
                    />
                    <button type="submit" className="ml-3 text-wa-teal p-2 rounded-full hover:bg-wa-teal/20 transition-colors" aria-label="Send message">
                        <SendIcon className="w-6 h-6" />
                    </button>
                </form>
            </div>
        </footer>
    );
};


export const ChatWindow: React.FC<ChatWindowProps> = ({ chat, currentUser, onSendMessage, onBack, isMobileView }) => {
  if (!chat) {
    return (
      <div className="hidden md:flex flex-col items-center justify-center w-full h-full bg-gray-100 dark:bg-wa-dark text-center">
        <div className="w-64 h-64 opacity-20">
          <svg viewBox="0 0 24 24" fill="currentColor" className="text-gray-500">
            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6.5A1.5,1.5 0 0,0 10.5,8A1.5,1.5 0 0,0 12,9.5A1.5,1.5 0 0,0 13.5,8A1.5,1.5 0 0,0 12,6.5M7,10.5A1.5,1.5 0 0,0 5.5,12A1.5,1.5 0 0,0 7,13.5A1.5,1.5 0 0,0 8.5,12A1.5,1.5 0 0,0 7,10.5M17,10.5A1.5,1.5 0 0,0 15.5,12A1.5,1.5 0 0,0 17,13.5A1.5,1.5 0 0,0 18.5,12A1.5,1.5 0 0,0 17,10.5M12,15C14.21,15 16.14,16.24 17.1,18H6.9C7.86,16.24 9.79,15 12,15Z" />
          </svg>
        </div>
        <h2 className="mt-4 text-2xl text-gray-700 dark:text-gray-300">P2P Messenger</h2>
        <p className="text-gray-500 dark:text-gray-400">Select a chat to start messaging.</p>
        <p className="mt-4 text-xs text-gray-400 dark:text-gray-500 border-t border-gray-300 dark:border-gray-600 pt-2">
            Your personal messages are peer-to-peer connected.
        </p>
      </div>
    );
  }

  return (
    <main className="w-full h-full flex flex-col bg-white dark:bg-wa-dark-secondary">
      <ChatHeader chat={chat} onBack={onBack} isMobileView={isMobileView} />
      <MessageArea messages={chat.messages} currentUserId={currentUser.id} />
      <ChatInput onSendMessage={onSendMessage} />
    </main>
  );
};