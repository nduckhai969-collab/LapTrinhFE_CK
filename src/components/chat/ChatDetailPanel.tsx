import { useState } from 'react';
import { Trash2, Users, X } from 'lucide-react';
import type { Conversation } from '../../types/conversation.types';

export interface ChatDetailPanelProps {
  conversation?: Conversation;
  isOpen?: boolean;
  onClose?: () => void;
  onRename?: (id: string, name: string) => void;
  onDelete?: (id: string) => void;
}

const ChatDetailPanel = ({
  conversation,
  isOpen,
  onClose,
  onRename,
  onDelete,
}: ChatDetailPanelProps) => {
  const [nameValue, setNameValue] = useState(
    conversation === undefined ? '' : conversation.name ?? '',
  );

  if (isOpen !== true || conversation === undefined) {
    return null;
  }

  const isRoom = conversation.type === 'group';
  const memberCount = conversation.participants.length;

  let displayName = conversation.name;
  if (displayName === undefined) {
    displayName = isRoom ? 'Phòng chat' : 'Cuộc hội thoại';
  }

  const avatarClassName = isRoom ? 'chat-avatar room-avatar' : 'chat-avatar';
  const avatarText = isRoom ? '#' : displayName.charAt(0);

  const handleClose = () => {
    setNameValue(conversation.name ?? '');
    if (onClose !== undefined) {
      onClose();
    }
  };

  const handleSaveName = () => {
    const trimmedName = nameValue.trim();
    if (trimmedName === '' || onRename === undefined) {
      return;
    }
    onRename(conversation.id, trimmedName);
  };

  const handleDelete = () => {
    if (onDelete !== undefined) {
      onDelete(conversation.id);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-card" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Quản lý đoạn chat</h2>
          <button type="button" className="modal-close-button" onClick={handleClose} title="Đóng">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div className="detail-summary">
            <span className={avatarClassName}>{avatarText}</span>
            <div className="chat-title">
              <span className="chat-name">{displayName}</span>
              <span className="chat-members">
                <Users size={12} />
                {isRoom ? `${memberCount} thành viên` : 'Trò chuyện trực tiếp'}
              </span>
            </div>
          </div>

          {isRoom && (
            <div className="form-field">
              <label className="form-label" htmlFor="detail-name">
                Tên phòng
              </label>
              <div className="detail-name-row">
                <input
                  id="detail-name"
                  className="form-input"
                  value={nameValue}
                  placeholder="Nhập tên phòng..."
                  onChange={(event) => setNameValue(event.target.value)}
                />
                <button
                  type="button"
                  className="modal-button modal-button-primary"
                  onClick={handleSaveName}
                >
                  Lưu
                </button>
              </div>
            </div>
          )}

          <div className="form-field">
            <span className="form-label">Thành viên ({memberCount})</span>
            <div className="member-list">
              {conversation.participants.map((user) => (
                <div key={user.id} className="member-item">
                  <span className="member-avatar">{user.fullName.charAt(0)}</span>
                  <span className="member-name">{user.fullName}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="modal-button modal-button-danger" onClick={handleDelete}>
            <Trash2 size={16} />
            Xóa đoạn chat
          </button>
          <button type="button" className="modal-button modal-button-secondary" onClick={handleClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatDetailPanel;
