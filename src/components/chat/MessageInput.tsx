import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Send } from 'lucide-react';

export interface MessageInputProps {
  onSendMessage?: (content: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const MessageInput = ({
  onSendMessage,
  disabled,
  placeholder = 'Nhập tin nhắn...',
}: MessageInputProps) => {
  const [value, setValue] = useState('');
  const isDisabled = disabled === true;

  const handleSend = () => {
    const content = value.trim();
    if (content === '' || isDisabled) {
      return;
    }
    if (onSendMessage !== undefined) {
      onSendMessage(content);
    }
    setValue('');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="message-input">
      <textarea
        className="message-input-field"
        value={value}
        rows={1}
        placeholder={placeholder}
        disabled={isDisabled}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        type="button"
        className="message-send-button"
        onClick={handleSend}
        disabled={isDisabled || value.trim() === ''}
      >
        <Send size={18} />
      </button>
    </div>
  );
};

export default MessageInput;
