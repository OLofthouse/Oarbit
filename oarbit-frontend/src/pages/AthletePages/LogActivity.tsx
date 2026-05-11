import { useState, useEffect } from 'react'; 
import { useNavigate, useLocation } from 'react-router-dom'; 
import AthleteNavbar from "../../components/navbar/AthleteNavbar";

export default function LogActivity() {

  const location = useLocation(); 
  const [isTemplate, setIsTemplate] = useState(false); 

  useEffect(() => {
    if (location.state) setIsTemplate(true)
  }, [])

  return (
    <>
      
      {isTemplate ? <p>Log Assigned Workout</p>: <p>Log Workout Manually</p>}

      <AthleteNavbar activePage="LogActivity" />
    </>
  )
}