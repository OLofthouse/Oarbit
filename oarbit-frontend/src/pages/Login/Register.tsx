import './login.css'; 
import OarbitIcon from "../../assets/OarbitIcon.png"; 

export default function Register () {
  return (
    <>
      <div className="register-page">
        <div className="register-content">
          <div className="app-icon">
            <img src={OarbitIcon} alt="App Icon" className='app-icon' />
          </div>
          <div className="title-container">
            <p className="title">Register Account</p>
          </div>

          <div className="register-form-container">
            <form>
              <div className="input-container">
                <p>Email</p>
                <input type="text" name="email"/>
              </div>

              <div className="input-container">
                <p>Name</p>
                <input type="text" name="name"/>
              </div>

              <div className="input-container">
                <p>Password</p>
                <input type="text" name="password" />
              </div>

              <div className="input-container">
                <p>Confirm Password</p>
                <input type="text" name="passwordconfirm" />
              </div>

              <div className="input-container">
                <button type="submit" className="button-register">Register</button>
                <button className='button-back-register'>Back</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}