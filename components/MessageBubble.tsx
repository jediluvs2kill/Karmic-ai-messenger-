import React from 'react';
import { Message, MessageStatus, Attachment } from '../types';
import { CheckIcon, DoubleCheckIcon, DocumentIcon, PdfIcon } from './Icons';

interface MessageBubbleProps {
  message: Message;
  isSender: boolean;
}

const MessageStatusIndicator: React.FC<{ status: MessageStatus }> = ({ status }) => {
  const isRead = status === MessageStatus.READ;
  const iconColor = isRead ? 'text-blue-400' : 'text-gray-400';

  if (status === MessageStatus.SENT) {
    return <CheckIcon className={`w-4 h-4 ml-1 ${iconColor}`} />;
  }
  if (status === MessageStatus.DELIVERED || status === MessageStatus.READ) {
    return <DoubleCheckIcon className={`w-4 h-4 ml-1 ${iconColor}`} />;
  }
  return null;
};

const AttachmentPreview: React.FC<{ attachment: Attachment }> = ({ attachment }) => {
    const isPdf = attachment.type === 'application/pdf';
    const fileTypeLabel = isPdf ? 'PDF Document' : attachment.type;
    
    return (
        <div className="mt-1 p-2 bg-black/5 dark:bg-black/20 rounded-lg flex items-center max-w-xs">
            {isPdf ? (
                 <PdfIcon className="w-10 h-10 text-red-500 flex-shrink-0" />
            ) : (
                <DocumentIcon className="w-10 h-10 text-gray-500 dark:text-gray-400 flex-shrink-0" />
            )}
            <div className="ml-2 overflow-hidden">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{attachment.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{fileTypeLabel}</p>
            </div>
        </div>
    );
};


export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isSender }) => {
  const bubbleClasses = isSender
    ? 'bg-wa-message-sent-light dark:bg-wa-message-sent self-end'
    : 'bg-wa-message-received-light dark:bg-wa-message-received self-start';

  const time = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`rounded-lg px-3 py-2 max-w-sm md:max-w-md shadow-md flex flex-col ${bubbleClasses}`}>
      {message.attachment && <AttachmentPreview attachment={message.attachment} />}
      {message.text && <p className={`text-gray-800 dark:text-gray-200 text-sm leading-snug ${message.attachment ? 'mt-1' : ''}`}>{message.text}</p>}
      <div className="flex justify-end items-center mt-1 self-end">
        <span className="text-xs text-gray-500 dark:text-gray-400 mr-1">{time}</span>
        {isSender && <MessageStatusIndicator status={message.status} />}
      </div>
    </div>
  );
};