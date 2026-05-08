import './login.css';
import OarbitIcon from "../../assets/OarbitIcon.png"; 

export default function Login() {
  return (
    <>
      <div className="login-page">
        <div className="content">
          <div className="app-icon">
            <img src={OarbitIcon} alt="App Icon" className="app-icon" />
          </div>
          <div className="title-container">
            <p className="title">Oarbit</p>
            <p className="sign-in-prompt">Please sign in to continue</p>
          </div>
          <div className="form-container">
            <form>
              <div className="input-container">
                <input type="text" placeholder="Email" required />
              </div>

              <div className="input-container">
                <input type="password" placeholder="Password" required />
              </div>

              <div className="forgot-password-container">
                <p>Forgot Password?</p>
              </div>

              <div className="input-container">
                <button type="submit">Sign in</button>
              </div>
            </form>

            <div className="register-container">
              <p>Don't have an account? <span className="register-link">Register</span></p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}