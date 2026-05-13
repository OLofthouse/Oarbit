import { useState, useEffect } from 'react';
import './dashboard.css';
import DateSelector from "../../components/DateSelector/DateSelector";
import AthleteNavbar from "../../components/navbar/AthleteNavbar";
import ViewBuilder from '../../components/Builders/ViewBuilder';
import { AssignedWorkout, assignedWorkoutStatus, trainingTypeEnum, WorkoutTemplate, workoutTypeEnum } from '../../types/types';

const fakeWorkouts: AssignedWorkout[] = [
  {
    title: "2k",
    date: new Date(),
    location: "Sport BU",
    assignedCoach: "ID",
    trainingType: trainingTypeEnum.Land,
    workoutType: workoutTypeEnum.singleDistance,
    intervals: [{
      intervalNumber: 1,
      targetDistance: 2000,
      targetTimeSecs: null,
    }],
    status: assignedWorkoutStatus.Assigned
  },
  {
    title: "2x40'",
    date: new Date(),
    location: "Sport BU",
    assignedCoach: "ID",
    trainingType: trainingTypeEnum.Land,
    workoutType: workoutTypeEnum.intervalTime,
    intervals: [{
      intervalNumber: 1,
      targetDistance: null,
      targetTimeSecs: 2400,
    },
    {
      intervalNumber: 2,
      targetDistance: null,
      targetTimeSecs: 2400,
    }
    ],
    status: assignedWorkoutStatus.Assigned
  },
  {
    title: "Water Session",
    date: new Date(),
    location: "Canford",
    assignedCoach: "ID",
    trainingType: trainingTypeEnum.Water,
    workoutType: workoutTypeEnum.singleDistance,
    intervals: [{
      intervalNumber: 1,
      targetDistance: 2000,
      targetTimeSecs: null,
    }],
    status: assignedWorkoutStatus.Assigned
  },
  {
    title: "3x5k",
    date: new Date(),
    location: "Sport Bu",
    assignedCoach: "OL",
    trainingType: trainingTypeEnum.Land,
    workoutType: workoutTypeEnum.intervalDistance,
    intervals: [
      {
        intervalNumber: 1, 
        targetDistance: 5000, 
        targetTimeSecs: null,
      },
      {
        intervalNumber: 2, 
        targetDistance: 5000, 
        targetTimeSecs: null,
      },
      {
        intervalNumber: 3, 
        targetDistance: 5000, 
        targetTimeSecs: null,
      }
    ],
    status: assignedWorkoutStatus.Assigned
  }
];

export default function AthleteDashboard() {

  const [selectedDate, setSelectedDate] = useState(new Date);
  const [workoutList, setWorkoutList] = useState<AssignedWorkout[]>(fakeWorkouts);

  function handleDateSelectorDateChange(date: Date) {
    setSelectedDate(date);
  }

  return (
    <>
      <DateSelector selectedDate={null} onDateChange={handleDateSelectorDateChange} />

      <div className="athlete-dashboard">
        <div className="athlete-dashboard-content">
          <div className="date-identifier">
            {selectedDate.toDateString()}
          </div>

          <div className="card-list">
            <div className="card-list-content">
              {workoutList.map((workout) => (
                <div className="workout-card">
                  <details className="card-content">
                    <summary>
                      <div className="card-row">
                        <p className="card-title">{workout.title}</p>
                        <div className="assigned-status">
                          <span>{workout.status}</span>
                        </div>
                      </div>
                      <div className="card-row">
                        <span className="time-location">
                          {workout.date.getHours()}:
                          {workout.date.getMinutes()} &#8226;
                          {" "}{workout.location}

                        </span>
                        <div className="assigned-status">
                          <span>{workout.trainingType}</span>
                        </div>
                      </div>
                    </summary>

                    <div className="session-info">
                      <div className="breaker"></div>
                      <p>Session Info</p>
                      <ViewBuilder workout={workout} />
                    </div>

                  </details>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="navbar-padding"></div>
      <AthleteNavbar activePage="AthleteDashboard" />
    </>
  )
}