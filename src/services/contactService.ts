import { SOCKET_EVENTS } from '../constants/socket.constants';
import { ensureAuthenticated } from './authSevices';
import { sendSocket } from './websocket.service';

interface UserStatusResponse {
    status: boolean;
}

const sendUserStatusRequest = async (
    username: string,
    event: typeof SOCKET_EVENTS.CHECK_USER_EXIST | typeof SOCKET_EVENTS.CHECK_USER_ONLINE,
    legacyEvent: typeof SOCKET_EVENTS.CHECK_USER_EXIST_LEGACY
        | typeof SOCKET_EVENTS.CHECK_USER_ONLINE_LEGACY,
): Promise<boolean> => {
    try {
        const response = await sendSocket<UserStatusResponse>(event, { user: username });
        return response.status;
    } catch (error) {
        const expectedTimeout = `Máy chủ không phản hồi yêu cầu ${event}.`;
        if (!(error instanceof Error) || error.message !== expectedTimeout) {
            throw error;
        }

        // Some deployed server versions use the unprefixed request event.
        const response = await sendSocket<UserStatusResponse>(legacyEvent, { user: username });
        return response.status;
    }
};

export const checkUserExists = async (username: string): Promise<boolean> => {
    const normalizedUsername = username.trim();

    if (!normalizedUsername) {
        throw new Error('Vui lòng nhập tên đăng nhập.');
    }

    await ensureAuthenticated();
    return sendUserStatusRequest(
        normalizedUsername,
        SOCKET_EVENTS.CHECK_USER_EXIST,
        SOCKET_EVENTS.CHECK_USER_EXIST_LEGACY,
    );
};

export const checkUserOnline = async (username: string): Promise<boolean> => {
    const normalizedUsername = username.trim();

    if (!normalizedUsername) {
        throw new Error('Tên đăng nhập không hợp lệ.');
    }

    await ensureAuthenticated();
    return sendUserStatusRequest(
        normalizedUsername,
        SOCKET_EVENTS.CHECK_USER_ONLINE,
        SOCKET_EVENTS.CHECK_USER_ONLINE_LEGACY,
    );
};
