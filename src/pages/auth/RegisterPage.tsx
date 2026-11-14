import  {useState} from "react";
import type {FormEvent} from "react";
import {useNavigate,Link} from "react-router-dom";
import {registerUser} from "../../services/authSevices.ts";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        if(!fullName.trim() || !email.trim()||!password||!confirmPassword){
          setError("Vui lòng nhập thông tin");
          return;
        }
        const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
          setError("Email không hợp lệ");
          return;
        }
        if(password.length<6){
          setError("Vui lòng nhập đủ kí tự");
          return;
        }
        if(password!==confirmPassword){
          setError("Mật khẩu không khớp");
          return;
        }
        const result =registerUser(fullName.trim(),email.trim().toLowerCase(),password);
        if(!result.success){
          setError(result.message);
          return;
        }
        navigate("/login",{
          state:{
            message:result.message,
            email:email.trim().toLowerCase()
          }
        });
  };
  return (
      <div className="auth-card">
          <div className="auth-card">
              <h1>Tạo tài khoản</h1>
              <p>Đăng kí để bắt đầu trò chuyện</p>
          </div>
          <form onSubmit={handleSubmit}>
              {/* Họ tên*/}
              <div className="form-group">
                  <label htmlFor="fullName">
                      Họ và tên
                  </label>
                  <input type="text" id="fullName" placeholder="Nhập họ và tên" value={fullName} onChange={(e) => setFullName(e.target.value)}/>
              </div>
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
              {/*Xác nhận mật khẩu*/}
              <div className="form-group">
                  <label htmlFor="confirmPasswword">
                      Xác nhận mật khẩu
                  </label>
                  <input type="password" id="confirmPassword" value={confirmPassword}
                         onChange={(e) => setConfirmPassword(e.target.value)}
                         placeholder="Nhập lại mật khẩu"/>
              </div>
              {/*Hiển thị lỗi*/}
              {error &&(
                  <p className="error-message">
                      {error}
                  </p>
              )}
              <button type="submit" className="auth-button">
                    Đăng ký
              </button>
          </form>
          <div className="auth-footer">
              Đã có tài khoản?
              {" "}
              <Link to ="/login">
                  Đăng nhập
              </Link>
          </div>
      </div>
  );
};

export default RegisterPage;
