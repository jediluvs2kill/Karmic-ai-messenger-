import React from 'react';
import { Chat, User } from '../types';
import { SearchIcon, PlusIcon } from './Icons';

interface ChatListItemProps {
  chat: Chat;
  isActive: boolean;
  onSelect: () => void;
}

const ChatListItem: React.FC<ChatListItemProps> = ({ chat, isActive, onSelect }) => {
  const lastMessage = chat.messages[chat.messages.length - 1];
  const lastMessageTime = new Date(chat.lastMessageTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  let lastMessagePreview = 'No messages yet';
  if (lastMessage) {
    if (lastMessage.text) {
        lastMessagePreview = lastMessage.text;
    } else if (lastMessage.attachment) {
        lastMessagePreview = `📎 File: ${lastMessage.attachment.name}`;
    }
  }

  return (
    <li
      onClick={onSelect}
      className={`flex items-center p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-wa-dark-secondary transition-colors duration-200 ${isActive ? 'bg-gray-200 dark:bg-wa-dark-secondary' : ''}`}
    >
      <img src={chat.participant.avatar} alt={chat.participant.name} className="w-12 h-12 rounded-full mr-4" />
      <div className="flex-1 overflow-hidden">
        <div className="flex justify-between items-center">
          <p className="font-semibold text-gray-800 dark:text-gray-100 truncate">{chat.participant.name}</p>
          <p className={`text-xs ${chat.unreadCount > 0 ? 'text-wa-teal' : 'text-gray-500 dark:text-gray-400'}`}>{lastMessageTime}</p>
        </div>
        <div className="flex justify-between items-start">
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate pr-2">{lastMessagePreview}</p>
          {chat.unreadCount > 0 && (
            <span className="bg-wa-teal text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {chat.unreadCount}
            </span>
          )}
        </div>
      </div>
    </li>
  );
};

interface SidebarProps {
  currentUser: User;
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onStartNewChat: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentUser, chats, activeChatId, onSelectChat, onStartNewChat }) => {
  const sortedChats = [...chats].sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);

  return (
    <aside className="w-full h-full flex flex-col bg-gray-50 dark:bg-wa-dark border-r border-gray-200 dark:border-gray-700">
      {/* Header */}
      <header className="flex items-center justify-between p-3 bg-gray-100 dark:bg-wa-dark-secondary border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
            <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-full" />
            <div className="ml-3">
                <h2 className="font-semibold text-gray-800 dark:text-gray-100">{currentUser.name}</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">{currentUser.job}</p>
            </div>
        </div>
        <div>
            <button onClick={onStartNewChat} className="text-gray-600 dark:text-gray-300 p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10" aria-label="Start new chat">
                <PlusIcon className="w-6 h-6" />
            </button>
        </div>
      </header>
      
      {/* Search */}
      <div className="p-3 bg-gray-100 dark:bg-wa-dark border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="w-5 h-5 text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search or start new chat"
            className="w-full bg-gray-200 dark:bg-wa-dark-secondary text-gray-800 dark:text-gray-300 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-wa-teal"
          />
        </div>
      </div>

      {/* Chat List */}
      <ul className="flex-1 overflow-y-auto">
        {sortedChats.map((chat) => (
          <ChatListItem
            key={chat.id}
            chat={chat}
            isActive={chat.id === activeChatId}
            onSelect={() => onSelectChat(chat.id)}
          />
        ))}
      </ul>
    </aside>
  );
};