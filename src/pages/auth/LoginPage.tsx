import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/authSevices';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const registeredUsername = location.state?.username ?? '';
  const [username, setUsername] = useState<string>(registeredUsername);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const successMessage = location.state?.message;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    if (!username.trim() || !password) {
      setError('Vui lòng nhập tên đăng nhập và mật khẩu.');
      return;
    }

    setIsSubmitting(true);
    try {
      await loginUser(username.trim(), password);
      navigate('/chat');
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Đăng nhập thất bại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h1>Chào mừng bạn trở lại</h1>
        <p>Đăng nhập để tiếp tục trò chuyện</p>
      </div>
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Tên đăng nhập</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Ví dụ: ten_dang_nhap"
            autoComplete="username"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mật khẩu</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Nhập mật khẩu"
            autoComplete="current-password"
          />
        </div>
        <div className="forgot-password">
          <Link to="/forgot-password">Quên mật khẩu?</Link>
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="auth-button" disabled={isSubmitting}>
          {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>
      <div className="auth-footer">
        Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
      </div>
    </div>
  );
};

export default LoginPage;
