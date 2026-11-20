import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/authSevices';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const normalizedUsername = username.trim();
    if (!normalizedUsername || !password || !confirmPassword) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    if (!/^[A-Za-z0-9_]+$/.test(normalizedUsername)) {
      setError('Tên đăng nhập chỉ được chứa chữ cái, chữ số và dấu gạch dưới.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await registerUser(normalizedUsername, password);
      navigate('/login', {
        state: {
          message: result.message,
          username: normalizedUsername,
        },
      });
    } catch (registerError) {
      setError(registerError instanceof Error ? registerError.message : 'Đăng ký thất bại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h1>Tạo tài khoản</h1>
        <p>Đăng ký để bắt đầu trò chuyện</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Tên đăng nhập</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Chỉ dùng chữ, số và dấu gạch dưới"
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
            autoComplete="new-password"
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Nhập lại mật khẩu"
            autoComplete="new-password"
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="auth-button" disabled={isSubmitting}>
          {isSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}
        </button>
      </form>
      <div className="auth-footer">
        Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
      </div>
    </div>
  );
};

export default RegisterPage;
