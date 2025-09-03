import { User, Chat, MessageStatus } from '../types';

const CURRENT_USER_ID = 'user-0'; // This will be replaced by dynamic user setup

export const users: User[] = [
  { id: CURRENT_USER_ID, name: 'You', avatar: 'https://picsum.photos/seed/you/200', isOnline: true, job: 'Product Manager' },
  { id: 'user-1', name: 'Alice', avatar: 'https://picsum.photos/seed/alice/200', isOnline: true, job: 'Frontend Developer' },
  { id: 'user-2', name: 'Bob', avatar: 'https://picsum.photos/seed/bob/200', isOnline: false, job: 'Backend Developer' },
  { id: 'user-3', name: 'Charlie', avatar: 'https://picsum.photos/seed/charlie/200', isOnline: true, job: 'UI/UX Designer' },
  { id: 'user-4', name: 'Diana', avatar: 'https://picsum.photos/seed/diana/200', isOnline: false, job: 'QA Engineer' },
];

const now = Date.now();

export const mockChats: Chat[] = [
  {
    id: 'chat-1',
    participant: users[1],
    messages: [
      { id: 'msg-1-1', text: 'Hey, how is the project going?', timestamp: now - 1000 * 60 * 5, senderId: 'user-1', status: MessageStatus.READ },
      { id: 'msg-1-2', text: 'It\'s going well! Almost done with the main feature.', timestamp: now - 1000 * 60 * 4, senderId: 'user-0', status: MessageStatus.READ },
      { id: 'msg-1-3', text: 'Great to hear! Let me know if you need any help.', timestamp: now - 1000 * 60 * 3, senderId: 'user-1', status: MessageStatus.READ },
    ],
    unreadCount: 1,
    lastMessageTimestamp: now - 1000 * 60 * 3,
  },
  {
    id: 'chat-2',
    participant: users[2],
    messages: [
      { id: 'msg-2-1', text: 'Can you review my PR?', timestamp: now - 1000 * 60 * 60 * 2, senderId: 'user-2', status: MessageStatus.DELIVERED },
      { id: 'msg-2-2', text: 'Sure, I\'ll take a look this afternoon.', timestamp: now - 1000 * 60 * 59, senderId: 'user-0', status: MessageStatus.DELIVERED },
    ],
    unreadCount: 0,
    lastMessageTimestamp: now - 1000 * 60 * 59,
  },
  {
    id: 'chat-3',
    participant: users[3],
    messages: [
      { id: 'msg-3-1', text: 'The new designs are ready for review.', timestamp: now - 1000 * 60 * 60 * 24, senderId: 'user-3', status: MessageStatus.READ },
    ],
    unreadCount: 0,
    lastMessageTimestamp: now - 1000 * 60 * 60 * 24,
  },
  {
    id: 'chat-4',
    participant: users[4],
    messages: [
        { id: 'msg-4-1', text: 'Found a bug in the staging environment.', timestamp: now - 1000 * 60 * 60 * 48, senderId: 'user-4', status: MessageStatus.DELIVERED },
    ],
    unreadCount: 1,
    lastMessageTimestamp: now - 1000 * 60 * 60 * 48,
  },
];
