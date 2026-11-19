import type { User,AuthAccount} from "../types/user.types.ts";
const users_key = "chatapp_users";
const current_user_key = "chatapp_current_user";
export const getUsers = (): AuthAccount[] => {
    const data = localStorage.getItem(users_key);

    return data ? JSON.parse(data) as AuthAccount[] : [];
};
export const registerUser = (
    fullName: string,
    email: string,
    password: string
): { success: boolean; message: string } => {

    const users = getUsers();
    const existingUser = users.find(
        user => user.email === email
    );

    if (existingUser) {
        return {
            success: false,
            message: "Email đã được đăng ký!"
        };
    }

    // Tạo tài khoản mới
    const newUser: AuthAccount = {
        id: crypto.randomUUID(),
        fullName: fullName,
        email: email,
        password: password,
        avatar: "",
        status: "offline",
        createdAt: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem(
        users_key,
        JSON.stringify(users)
    );

    return {
        success: true,
        message: "Đăng ký thành công!"
    };
};
export const loginUser = (
    email: string,
    password: string
): { success: boolean; message: string; user?: User } => {

    const users = getUsers();
    const account = users.find(
        user =>
            user.email === email &&
            user.password === password
    );

    if (!account) {
        return {
            success: false,
            message: "Email hoặc mật khẩu không chính xác!"
        };
    }
    const currentUser: User = {
        id: account.id,
        fullName: account.fullName,
        email: account.email,
        avatar: account.avatar,
        status: "online",
        createdAt: account.createdAt
    };

    // Lưu người dùng hiện tại
    localStorage.setItem(
        current_user_key,
        JSON.stringify(currentUser)
    );

    return {
        success: true,
        message: "Đăng nhập thành công!",
        user: currentUser
    };
};
export const getCurrentUser = (): User | null => {

    const data = localStorage.getItem(current_user_key);

    return data ? JSON.parse(data) as User : null;
};
export const logoutUser = (): void => {

    localStorage.removeItem(current_user_key);
};