import SearchInput from '../../components/common/SearchInput';
import './chat.css';

const ChatPage = () => {
  return (
    <div className="chat-page">
      <aside className="conversation-panel">
        <SearchInput
          className="conversation-search"
          placeholder="Tìm kiếm cuộc trò chuyện"
        />
      </aside>
    </div>
  );
};

export default ChatPage;
