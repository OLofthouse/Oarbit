import { useState, useEffect } from 'react';
import DateSelector from "../../components/DateSelector/DateSelector";
import CoachNavbar from "../../components/navbar/CoachNavbar";
import { assignedWorkoutStatus, CoachOverviewWorkout, trainingTypeEnum, workoutTypeEnum } from '../../types/types';
import { formatSplitTime } from '../../utils/timeFormats';
import { secsToTimeString } from '../../utils/useTimeInput';
import './viewactivity.css';

const fakeWorkouts: CoachOverviewWorkout[] = [
  {
    title: "2k",
    date: new Date(),
    location: "Sport Bu",
    assignedCoach: "ID",
    status: assignedWorkoutStatus.Completed,
    trainingType: trainingTypeEnum.Land,
    workoutType: workoutTypeEnum.singleDistance,
    totalDistance: 2000,
    totalTimeSecs: 381,
    totalSplitSecs: 95.3,
    avgHeartRate: 200,
    avgStrokeRate: 34,
    intervals: [{
      intervalNumber: 1,
      targetDistance: 2000,
      targetTimeSecs: null,
      completedDistance: 2000,
      completedTimeSecs: 381,
      completedSplitSecs: 95.3,
      completedHeartRate: 200,
      completedStrokeRate: 34,
    }],
    athleteName: "Oscar Lofthouse",
  },
  {
    title: "2k",
    date: new Date(),
    location: "Sport Bu",
    assignedCoach: "ID",
    status: assignedWorkoutStatus.Completed,
    trainingType: trainingTypeEnum.Land,
    workoutType: workoutTypeEnum.singleDistance,
    totalDistance: 2000,
    totalTimeSecs: 480,
    totalSplitSecs: 120,
    avgHeartRate: 180,
    avgStrokeRate: 32,
    intervals: [{
      intervalNumber: 1,
      targetDistance: 2000,
      targetTimeSecs: null,
      completedDistance: 2000,
      completedTimeSecs: 480,
      completedSplitSecs: 120,
      completedHeartRate: 190,
      completedStrokeRate: 32,
    }],
    athleteName: "Naia Hill",
  },
  {
    title: "2x40'",
    date: new Date(),
    location: "Sport Bu",
    assignedCoach: "ID",
    status: assignedWorkoutStatus.Completed,
    trainingType: trainingTypeEnum.Land,
    workoutType: workoutTypeEnum.intervalTime,
    totalDistance: 20000,
    totalTimeSecs: 4800,
    totalSplitSecs: 120,
    avgHeartRate: 120,
    avgStrokeRate: 20,
    intervals: [{
      intervalNumber: 1,
      targetDistance: 0,
      targetTimeSecs: 2400,
      completedDistance: 10000,
      completedTimeSecs: 2400,
      completedSplitSecs: 120,
      completedHeartRate: 120,
      completedStrokeRate: 20,
    },
    {
      intervalNumber: 2,
      targetDistance: 0,
      targetTimeSecs: 2400,
      completedDistance: 10000,
      completedTimeSecs: 2400,
      completedSplitSecs: 120,
      completedHeartRate: 120,
      completedStrokeRate: 20,
    }
  ],
    athleteName: "Oscar Lofthouse",
  }
];

export default function ViewActivities() {

  const [selectedDate, setSelectedDate] = useState(new Date);
  const [workoutList, setWorkoutList] = useState<CoachOverviewWorkout[]>(fakeWorkouts);

  function handleOnDateChange(date: Date) {
    setSelectedDate(date);
  }

  const getWorkoutMetric = (workout: CoachOverviewWorkout) => {
    if (workout.workoutType == workoutTypeEnum.singleDistance) return "Distance";
    if (workout.workoutType == workoutTypeEnum.singleTime) return "Time";
    if (workout.workoutType == workoutTypeEnum.intervalDistance) return "Distance";
    if (workout.workoutType == workoutTypeEnum.intervalTime) return "Time";
  }

  return (
    <>
      <DateSelector selectedDate={null} onDateChange={handleOnDateChange} />

      <div className="view-activities-page">
        <div className="view-activities-content">

          <div className="date-identifier">
            {selectedDate.toDateString()}
          </div>

          <div className="card-list">
            <div className="card-list-content">
              {workoutList.map((workout) => (
                <div className="workout-card">
                  <details className='card-content'>
                    <summary>
                      <div className="card-row">
                        <p className="card-title">{workout.title}</p>
                        <div className="assigned-status">
                          <span className="athlete-name">{workout.athleteName}</span>
                        </div>
                      </div>
                      <div className="card-row">
                        <span className="time-location">
                          {workout.date.getHours()}:
                          {workout.date.getMinutes()} &#8226;
                          {" "}{workout.location}
                        </span>
                      </div>
                    </summary>

                    <div className="session-info">
                      <div className="breaker"></div>
                      <p>Session Info</p>
                      <div className="template-builder-component">
                        <form>
                          <div className="overview-information">
                            <p className="overview-title">Session Totals:</p>

                            <div className="session-totals">
                              <div className="session-totals-row">
                                {getWorkoutMetric(workout) == "Distance" ? (
                                  <>
                                    <div className="intervals-input-container">
                                      <div className="intervals-input-container-row">
                                        <div className="total-distance">
                                          <p>Total Distance</p>
                                          <input className="total-input" type="text" disabled value={workout.totalDistance} />
                                        </div>
                                        <div className="total-split">
                                          <p>Average Split</p>
                                          <input type="text" className="total-input" value={formatSplitTime(workout.totalSplitSecs)} disabled />
                                        </div>
                                      </div>
                                      <div className="intervals-input-container-row">
                                        <div className="total-time">
                                          <p>Total Time</p>
                                          <input className="total-input" type="text" value={secsToTimeString(workout.totalTimeSecs)} disabled />
                                        </div>
                                        <div className="total-bpm">
                                          <p>Average HR</p>
                                          <input type="number" className="total-input" value={workout.avgHeartRate ?? ""} disabled />
                                        </div>
                                        <div className="total-spm">
                                          <p>Average SPM</p>
                                          <input type="number" className="total-input" value={workout.avgStrokeRate ?? ""} disabled />
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div className="intervals-input-container">
                                      <div className="intervals-input-container-row">
                                        <div className="total-time">
                                          <p>Total Time</p>
                                          <input className="total-input" type="text" value={secsToTimeString(workout.totalTimeSecs)} disabled />
                                        </div>
                                        <div className="total-split">
                                          <p>Average Split</p>
                                          <input type="text" className="total-input" value={formatSplitTime(workout.totalSplitSecs)} disabled />
                                        </div>
                                      </div>
                                      <div className="intervals-input-container-row">
                                        <div className="total-distance">
                                          <p>Total Distance</p>
                                          <input className="total-input" type="text" disabled value={workout.totalDistance} />
                                        </div>
                                        <div className="total-bpm">
                                          <p>Average HR</p>
                                          <input type="number" className="total-input" value={workout.avgHeartRate ?? ""} disabled />
                                        </div>
                                        <div className="total-spm">
                                          <p>Average SPM</p>
                                          <input type="number" className="total-input" value={workout.avgStrokeRate ?? ""} disabled />
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="interval-information">
                            <div className="title-container">
                              <p>Intervals - {workout.workoutType}</p>
                            </div>

                            <table>
                              <thead>
                                <th style={{ width: "10%" }}>#</th>
                                <th>Dist.</th>
                                <th>Time</th>
                                <th>Split</th>
                                <th>SPM</th>
                                <th>HR</th>
                              </thead>
                              <tbody>
                                {workout.intervals.map((interval) => (
                                  <tr>
                                    <td>{interval.intervalNumber}</td>
                                    <td>{interval.completedDistance}</td>
                                    <td>{secsToTimeString(interval.completedTimeSecs!)}</td>
                                    <td>{formatSplitTime(interval.completedSplitSecs!)}</td>
                                    <td>{interval.completedStrokeRate ?? "-"}</td>
                                    <td>{interval.completedHeartRate ?? "-"}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </form>
                      </div>
                    </div>

                  </details>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <div className="navbar-padding"></div>
      <CoachNavbar activePage="ViewActivities" />
    </>
  )
}