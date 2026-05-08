import './navbar.css'; 
import {useNavigate} from 'react-router'; 
import {ReactComponent as ActivityActiveIcon} from '../../assets/navbar/Activity-active.svg'; 
import {ReactComponent as ActivityIcon} from '../../assets/navbar/Activity.svg';
import {ReactComponent as CalendarActiveIcon} from '../../assets/navbar/Calendar-active.svg'; 
import {ReactComponent as CalendarIcon} from '../../assets/navbar/Calendar.svg';
import {ReactComponent as ClockActiveIcon} from '../../assets/navbar/Clock-active.svg'; 
import {ReactComponent as ClockIcon} from '../../assets/navbar/Clock.svg';

interface AthleteNavbarProps {
  activePage: string
}

export default function AthleteNavbar(props: AthleteNavbarProps) {

  let navigate = useNavigate();

  const handleButtonNavigate = (iconClicked: string) => {
    if (iconClicked != props.activePage) {
      const navURL = "/" + iconClicked; 
      navigate(navURL); 
    }
  }

  return (
    <>
      <div className="navbar-container">
        <div className="navbar-icons">
          <div className="nav-icon" onClick={() => handleButtonNavigate("AthleteDashboard")}>
            <div className="icon-img">
              {props.activePage == "AthleteDashboard" ? 
              <CalendarActiveIcon /> : <CalendarIcon />}
            </div>
            <p className={props.activePage == "AthleteDashboard" ? "active" : ""}>Schedule</p>
          </div>

          <div className="nav-icon" onClick={() => handleButtonNavigate("LogActivity")}>
            <div className="icon-img">
              {props.activePage == "LogActivity" ?
              <ClockActiveIcon /> : <ClockIcon />}
            </div>
            <p className={props.activePage == "LogActivity" ? "active" : ""}>Log</p>
          </div>

          <div className="nav-icon" onClick={() => {handleButtonNavigate("ProgressView")}}>
            <div className="icon-img">
              {props.activePage == "ProgressView" ?
              <ActivityActiveIcon /> : <ActivityIcon />}
            </div>
            <p className={props.activePage == "ProgressView" ? "active" : ""}>Progress</p>
          </div>
        </div>
      </div>
    </>
  );
}
