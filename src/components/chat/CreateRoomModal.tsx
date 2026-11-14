import { useState } from 'react';
import { X } from 'lucide-react';
import type { ConversationType, CreateConversationPayload } from '../../types/conversation.types';
import type { User } from '../../types/user.types';

export interface CreateRoomModalProps {
  isOpen: boolean;
  users: User[];
  onClose: () => void;
  onCreate?: (payload: CreateConversationPayload) => void;
}

const CreateRoomModal = ({ isOpen, users, onClose, onCreate }: CreateRoomModalProps) => {
  const [roomType, setRoomType] = useState<ConversationType>('group');
  const [roomName, setRoomName] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [error, setError] = useState('');

  if (!isOpen) {
    return null;
  }

  const resetAndClose = () => {
    setRoomType('group');
    setRoomName('');
    setSelectedIds([]);
    setError('');
    onClose();
  };

  const handleTypeChange = (type: ConversationType) => {
    setRoomType(type);
    setSelectedIds([]);
    setError('');
  };

  const toggleMember = (userId: string) => {
    setError('');
    setSelectedIds((prevIds) => {
      if (roomType === 'direct') {
        if (prevIds.includes(userId)) {
          return [];
        }
        return [userId];
      }
      if (prevIds.includes(userId)) {
        return prevIds.filter((id) => id !== userId);
      }
      return [...prevIds, userId];
    });
  };

  const handleSubmit = () => {
    const trimmedName = roomName.trim();

    if (selectedIds.length === 0) {
      setError('Vui lòng chọn ít nhất một thành viên');
      return;
    }
    if (roomType === 'group' && trimmedName === '') {
      setError('Vui lòng nhập tên phòng');
      return;
    }

    if (onCreate !== undefined) {
      if (roomType === 'group') {
        onCreate({ type: 'group', name: trimmedName, participantIds: selectedIds });
      } else {
        onCreate({ type: 'direct', participantIds: selectedIds });
      }
    }
    resetAndClose();
  };

  return (
    <div className="modal-overlay" onClick={resetAndClose}>
      <div className="modal-card" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Tạo phòng chat</h2>
          <button
            type="button"
            className="modal-close-button"
            onClick={resetAndClose}
            title="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-field">
            <span className="form-label">Loại phòng</span>
            <div className="room-type-group">
              <button
                type="button"
                className={roomType === 'group' ? 'room-type-item active' : 'room-type-item'}
                onClick={() => handleTypeChange('group')}
              >
                Nhóm
              </button>
              <button
                type="button"
                className={roomType === 'direct' ? 'room-type-item active' : 'room-type-item'}
                onClick={() => handleTypeChange('direct')}
              >
                Trực tiếp
              </button>
            </div>
          </div>

          {roomType === 'group' && (
            <div className="form-field">
              <label className="form-label" htmlFor="room-name">
                Tên phòng
              </label>
              <input
                id="room-name"
                className="form-input"
                value={roomName}
                placeholder="Nhập tên phòng..."
                onChange={(event) => setRoomName(event.target.value)}
              />
            </div>
          )}

          <div className="form-field">
            <span className="form-label">
              Thành viên
              {selectedIds.length > 0 && ` (${selectedIds.length})`}
            </span>
            <div className="member-list">
              {users.map((user) => {
                const isSelected = selectedIds.includes(user.id);
                return (
                  <div
                    key={user.id}
                    className={isSelected ? 'member-item selected' : 'member-item'}
                    onClick={() => toggleMember(user.id)}
                  >
                    <span className="member-avatar">{user.fullName.charAt(0)}</span>
                    <span className="member-name">{user.fullName}</span>
                    <input type="checkbox" checked={isSelected} readOnly />
                  </div>
                );
              })}
            </div>
          </div>

          {error !== '' && <p className="form-error">{error}</p>}
        </div>

        <div className="modal-footer">
          <button type="button" className="modal-button modal-button-secondary" onClick={resetAndClose}>
            Hủy
          </button>
          <button type="button" className="modal-button modal-button-primary" onClick={handleSubmit}>
            Tạo phòng
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRoomModal;
