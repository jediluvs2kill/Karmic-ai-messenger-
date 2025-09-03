
export interface User {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  job: string;
}

export enum MessageStatus {
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
}

export interface Attachment {
  name: string;
  type: string;
}

export interface Message {
  id: string;
  text: string;
  timestamp: number;
  senderId: string;
  status: MessageStatus;
  attachment?: Attachment;
}

export interface Chat {
  id: string;
  participant: User;
  messages: Message[];
  unreadCount: number;
  lastMessageTimestamp: number;
}
