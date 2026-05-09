import { useState, useEffect } from 'react';
import './dashboard.css'; 
import CoachNavbar from "../../components/navbar/CoachNavbar"
import DateSelector from "../../components/DateSelector/DateSelector";

export default function CoachDashboard() {

  const [selectedDate, setSelectedDate] = useState(new Date); 

  function handleDateSelectorDateChange(date: Date) {
    setSelectedDate(date); 
  }

  return (
    <>
    <DateSelector selectedDate={null} onDateChange={handleDateSelectorDateChange}/>
      
      <div className="athlete-dashboard">
        <div className="athlete-dashboard-content">
          <div className="date-identifier">
            {selectedDate.toDateString()}
          </div>
        </div>
      </div>

      <CoachNavbar activePage="CoachDashboard"/>
    </>
  )
}