import './navbar.css';
import { useNavigate } from 'react-router'; 
import {ReactComponent as CalendarActiveIcon} from '../../assets/navbar/Calendar-active.svg'; 
import {ReactComponent as CalendarIcon} from '../../assets/navbar/Calendar.svg';
import {ReactComponent as PlusActiveIcon} from '../../assets/navbar/Plussquare-active.svg'; 
import {ReactComponent as PlusIcon} from '../../assets/navbar/Plussquare.svg'; 
import {ReactComponent as UsersActiveIcon} from '../../assets/navbar/Users-active.svg'; 
import {ReactComponent as UsersIcon} from '../../assets/navbar/Users.svg'; 

interface CoachNavbarProps {
  activePage: string
}

export default function CoachNavbar(props: CoachNavbarProps) {
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
          <div className="nav-icon" onClick={() => handleButtonNavigate("CoachDashboard")}>
            <div className="icon-img">
              {props.activePage == "CoachDashboard" ? 
              <CalendarActiveIcon /> : <CalendarIcon />}
            </div>
            <p className={props.activePage == "CoachDashboard" ? "active" : ""}>Schedule</p>
          </div>

          <div className="nav-icon" onClick={() => handleButtonNavigate("ViewActivities")}>
            <div className="icon-img">
              {props.activePage == "ViewActivities" ?
              <UsersActiveIcon /> : <UsersIcon />}
            </div>
            <p className={props.activePage == "ViewActivities" ? "active" : ""}>View</p>
          </div>

          <div className="nav-icon" onClick={() => {handleButtonNavigate("CreateActivity")}}>
            <div className="icon-img">
              {props.activePage == "CreateActivity" ?
              <PlusActiveIcon /> : <PlusIcon />}
            </div>
            <p className={props.activePage == "CreateActivity" ? "active" : ""}>Session</p>
          </div>
        </div>
      </div>
    </>
  );
}