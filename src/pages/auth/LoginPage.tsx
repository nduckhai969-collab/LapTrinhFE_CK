import {useCallback, useRef, useState} from "react";
import type {FormEvent} from "react";
import {Link, useNavigate,useLocation} from "react-router-dom";
import {loginUser} from "../../services/authSevices.ts";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const registeredEmail = location.state?.email||"";
  const [email, setEmail] = useState(registeredEmail);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const successMessage = location.state?.message;
  const handleSubmit =(e: FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    setError("");
    if(!email.trim()||!password){
      setError("Vui lòng nhập mật khẩu");
      return;
    }
    const result=loginUser(email.trim.toLowerCase(), password);
    if(!result.success){
      setError(result.message);
      return;
    }
    navigate("/chat");
  };
  return (
      <div className="auth-card">
        <div className="auth-header">
          <h1>
            Chào mừng bạn quay tro lại
          </h1>
          <p>
            Đăng nhập để tiếp tục cuoc trò chuyện
          </p>
        </div>
        {successMessage && (
            <p className="success-message">{successMessage}</p>
        )}
        <form onSubmit={handleSubmit}>
          {/*Email*/}
          <div className="form-group">
            <label htmlFor="email">
              Email
            </label>
            <input type="email" id="email"value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   placeholder="example@gmail.com"/>
          </div>
          {/*mật khẩu*/}
          <div className="form-group">
            <label htmlFor="password">
              Mật khẩu
            </label>
            <input type="password" id="password" value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   placeholder="Ít nhất 6 kí tự"/>
          </div>
          {/*Quên mật khẩu*/}
          <div className="forgot-password">
            <Link to ="/forgot-password">
              Quên mật khẩu?
            </Link>
          </div>
          {error && (
              <p className="error-message">{error}</p>
          )}
          <button type="submit" className="auth-button"> Đăng nhập</button>
        </form>
        <div className="auth-footer">
          Chưa có tài khoản?
          {" "}
          <Link to ="/register">
            Đăng ký ngay
          </Link>
        </div>
      </div>
  );
};

export default LoginPage;
