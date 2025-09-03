import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import { mockChats } from './data/mockData';
import { Chat as ChatType, MessageStatus, User, Attachment } from './types';
import { Onboarding } from './components/Onboarding';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [chats, setChats] = useState<ChatType[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load data from localStorage on initial render
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('p2p_messenger_user');
      const savedChats = localStorage.getItem('p2p_messenger_chats');

      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
        setChats(savedChats ? JSON.parse(savedChats) : []);
      } else {
        // Pre-populate with mock chats for a new user experience
        // The senderId 'user-0' in mock data is just a placeholder and will not match the new dynamic user ID
        setChats(mockChats);
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      setChats(mockChats); // Fallback to mock data
    } finally {
      setIsLoading(false);
    }
    
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      if (currentUser) {
        localStorage.setItem('p2p_messenger_user', JSON.stringify(currentUser));
      }
      localStorage.setItem('p2p_messenger_chats', JSON.stringify(chats));
    }
  }, [currentUser, chats, isLoading]);

  const handleUserSetup = (name: string, job: string) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      job,
      avatar: `https://picsum.photos/seed/${name.replace(/\s/g, '')}/200`,
      isOnline: true,
    };
    setCurrentUser(newUser);
  };

  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
    setChats(prevChats =>
      prevChats.map(chat => {
        if (chat.id === chatId && chat.unreadCount > 0) {
          const updatedMessages = chat.messages.map(msg => ({...msg, status: MessageStatus.READ}));
          return { ...chat, unreadCount: 0, messages: updatedMessages };
        }
        return chat;
      })
    );
  };
  
  const handleSendMessage = (text: string, attachment?: Attachment) => {
    if (!activeChatId || !currentUser) return;

    const newMessage = {
      id: `msg-${Date.now()}`,
      text,
      timestamp: Date.now(),
      senderId: currentUser.id,
      status: MessageStatus.SENT,
      attachment,
    };

    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === activeChatId
          ? { ...chat, messages: [...chat.messages, newMessage], lastMessageTimestamp: newMessage.timestamp }
          : chat
      )
    );
    
    setTimeout(() => simulateReply(activeChatId), 1500 + Math.random() * 1000);
  };
  
  const simulateReply = (chatId: string) => {
    setChats(prevChats => {
      const chat = prevChats.find(c => c.id === chatId);
      if (!chat) return prevChats;

      const lastMessage = chat.messages[chat.messages.length - 1];
      let replyText = `This is an automated reply to your message.`;
      if (lastMessage) {
        if(lastMessage.attachment) {
            replyText = `Received your file: "${lastMessage.attachment.name}".`;
        } else if (lastMessage.text) {
            replyText = `This is an automated reply to "${lastMessage.text}".`;
        }
      }

      const replyMessage = {
        id: `msg-reply-${Date.now()}`,
        text: replyText,
        timestamp: Date.now(),
        senderId: chat.participant.id,
        status: MessageStatus.DELIVERED,
      };
      
      return prevChats.map(c => {
        if (c.id === chatId) {
          const isChatActive = activeChatId === chatId;
          if (isChatActive) {
            replyMessage.status = MessageStatus.READ;
          }
          return {
            ...c,
            messages: [...c.messages, replyMessage],
            unreadCount: isChatActive ? 0 : c.unreadCount + 1,
            lastMessageTimestamp: replyMessage.timestamp,
          };
        }
        return c;
      });
    });
  };
  
  const handleStartNewChat = () => {
    const name = window.prompt("Enter the new contact's name:");
    if (name && name.trim()) {
      const newUserId = `user-${Date.now()}`;
      const newUser: User = {
        id: newUserId,
        name: name.trim(),
        avatar: `https://picsum.photos/seed/${newUserId}/200`,
        isOnline: Math.random() > 0.5,
        job: 'Colleague', // Assign a default job title
      };
      const newChatId = `chat-${Date.now()}`;
      const newChat: ChatType = {
        id: newChatId,
        participant: newUser,
        messages: [],
        unreadCount: 0,
        lastMessageTimestamp: Date.now(),
      };
      setChats(prevChats => [newChat, ...prevChats]);
      setActiveChatId(newChatId);
    }
  };

  if (isLoading) {
    return (
        <div className="flex items-center justify-center h-screen bg-wa-dark-secondary">
            <p className="text-white">Loading Messenger...</p>
        </div>
    );
  }

  if (!currentUser) {
    return <Onboarding onUserSetup={handleUserSetup} />;
  }

  const activeChat = chats.find(chat => chat.id === activeChatId) || null;
  const showChatWindowOnMobile = isMobileView && activeChatId !== null;

  return (
    <div className="w-full h-screen max-w-[1600px] mx-auto flex overflow-hidden shadow-2xl">
      <div className={`
        ${showChatWindowOnMobile ? 'hidden' : 'flex'}
        md:flex flex-col w-full md:w-1/3 lg:w-1/4 flex-shrink-0
      `}>
          <Sidebar
              currentUser={currentUser}
              chats={chats}
              activeChatId={activeChatId}
              onSelectChat={handleSelectChat}
              onStartNewChat={handleStartNewChat}
          />
      </div>
      <div className={`
        ${showChatWindowOnMobile ? 'flex' : 'hidden'}
        md:flex flex-col flex-1
      `}>
          <ChatWindow
              chat={activeChat}
              currentUser={currentUser}
              onSendMessage={handleSendMessage}
              onBack={() => setActiveChatId(null)}
              isMobileView={isMobileView}
          />
      </div>
    </div>
  );
};

export default App;