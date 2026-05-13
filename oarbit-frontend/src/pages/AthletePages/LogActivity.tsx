import { useState, useEffect } from 'react'; 
import { useNavigate, useLocation } from 'react-router-dom'; 
import LogAssignedBuilder from '../../components/Builders/LogAssignedBuilder';
import AthleteNavbar from "../../components/navbar/AthleteNavbar";

export default function LogActivity() {

  const location = useLocation(); 
  const [isTemplate, setIsTemplate] = useState(false); 

  useEffect(() => {
    if (location.state) setIsTemplate(true)
  }, [])

  return (
    <>
      
      {isTemplate ? <LogAssignedBuilder workout={location.state.workout}/>: <p>Log Workout Manually</p>}
      
      <div className="navbar-padding"></div>
      <AthleteNavbar activePage="LogActivity" />
    </>
  )
}