import { useState, useEffect } from 'react';
import DateSelector from "../../components/DateSelector/DateSelector";
import { assignedWorkoutStatus, AthleteOverviewWorkout, CoachOverviewWorkout, trainingTypeEnum, workoutTypeEnum } from '../../types/types';
import { formatSplitTime } from '../../utils/timeFormats';
import { secsToTimeString } from '../../utils/useTimeInput';
import AthleteNavbar from "../../components/navbar/AthleteNavbar";
import './progressview.css';

const fakeWorkouts: AthleteOverviewWorkout[] = [
  {
    title: "2k",
    date: new Date(),
    location: "Sport Bu",
    assignedCoach: "ID",
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
  },
  {
    title: "2k",
    date: new Date(),
    location: "Sport Bu",
    assignedCoach: "ID",
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
  },
  {
    title: "2x40'",
    date: new Date(),
    location: "Sport Bu",
    assignedCoach: "ID",
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
  }
];

export default function ProgressView() {

  const [workoutList, setWorkoutList] = useState<AthleteOverviewWorkout[]>(fakeWorkouts);
  const [matchingWorkouts, setMatchingWorkouts] = useState<AthleteOverviewWorkout[]>([]);
  const [viewIntervals, setViewIntervals] = useState(false);
  const [viewMatching, setViewMatching] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    // Load Matching Workouts
    setMatchingWorkouts([{
      title: "2k",
      date: new Date(),
      location: "Sport Bu",
      assignedCoach: "",
      trainingType: trainingTypeEnum.Land,
      workoutType: workoutTypeEnum.singleDistance,
      totalDistance: 2000,
      totalTimeSecs: 381,
      totalSplitSecs: 95.4,
      avgHeartRate: 190,
      avgStrokeRate: 33,
      intervals: [{
        intervalNumber: 1,
        targetDistance: 2000,
        targetTimeSecs: null,
        completedDistance: 2000,
        completedTimeSecs: 381,
        completedSplitSecs: 95.4,
        completedHeartRate: 190,
        completedStrokeRate: 33,
      }],
    },
    {
      title: "2k",
      date: new Date(),
      location: "Sport Bu",
      assignedCoach: "",
      trainingType: trainingTypeEnum.Land,
      workoutType: workoutTypeEnum.singleDistance,
      totalDistance: 2000,
      totalTimeSecs: 420,
      totalSplitSecs: 120,
      avgHeartRate: 190,
      avgStrokeRate: 33,
      intervals: [{
        intervalNumber: 1,
        targetDistance: 2000,
        targetTimeSecs: null,
        completedDistance: 2000,
        completedTimeSecs: 420,
        completedSplitSecs: 120,
        completedHeartRate: 190,
        completedStrokeRate: 33,
      }],
    }
    ])
  }, [])

  const handleToggle = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  }

  const getWorkoutMetric = (workout: AthleteOverviewWorkout) => {
    if (workout.workoutType === workoutTypeEnum.singleDistance) return "Distance";
    if (workout.workoutType === workoutTypeEnum.singleTime) return "Time";
    if (workout.workoutType === workoutTypeEnum.intervalDistance) return "Distance";
    if (workout.workoutType === workoutTypeEnum.intervalTime) return "Time";
  }

  return (
    <>

      <div id="progress-view-page" className="progress-view-page">
        <div className="progress-view-content">
          <div className="title-container">
            <p className="title">Past Sessions</p>
          </div>

          <div className="card-list">
            <div className="card-list-content">
              {workoutList.map((workout, index) => (
                <div className="workout-card">
                  <details
                    key={index}
                    open={openIndex === index}
                    onToggle={(e) => { e.preventDefault(); setViewIntervals(false); setViewMatching(false) }}
                  >
                    <summary onClick={(e) => { e.preventDefault(); handleToggle(index) }}>
                      <div className="card-row">
                        <p className='card-title'>{workout.title}</p>
                        <div className="assigned-status">
                          <span className="athlete-name">{workout.trainingType}</span>
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
                            <p className='overview-title'>Session Totals:</p>
                            <div className="session-totals">
                              <div className="session-totals-row">
                                {getWorkoutMetric(workout) === "Distance" ?
                                  (
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
                                            <input type="text" className="total-input" value={secsToTimeString(workout.totalTimeSecs)} disabled />
                                          </div>
                                          <div className="total-bpm">
                                            <p>Average HR</p>
                                            <input type="number" className="total-input" value={workout.avgHeartRate ?? "-"} disabled />
                                          </div>
                                          <div className="total-spm">
                                            <p>Average SPM</p>
                                            <input type="number" className="total-input" value={workout.avgStrokeRate ?? "-"} disabled />
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
                          <div className="breaker"></div>
                          <div className="interval-information">
                            {viewIntervals === false ?
                              <>
                                <div className="button-container progress-page">
                                  <button id="progress-view-intervals" type="button" className="discard-btn" onClick={() => setViewIntervals(true)}>View Intervals</button>
                                </div>
                              </> :
                              <>
                                <div className="title-container">
                                  <p>Intervals - {workout.workoutType}</p>
                                </div>

                                <table className="progress-page-table">
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
                              </>
                            }
                          </div>
                          <div className="breaker"></div>
                          <div className="interval-information matched-past-container progress">
                            {viewMatching === false ?
                              <>
                                <div id="matching-past-progress-container" className="button-container">
                                  <button type="button" className="discard-btn" onClick={() => { setViewMatching(true) }}>View Past Matching Workouts</button>
                                </div>
                              </> : <>
                                <div className="matched-past-content">
                                  <div className="title-container">
                                    <p>Past Matching Workouts</p>
                                  </div>
                                  <div className="table-wrap">
                                    <table>
                                      <thead>
                                        <th style={{ width: "10%" }}>Date</th>
                                        <th>{((
                                          workout.workoutType == workoutTypeEnum.singleDistance ||
                                          workout.workoutType == workoutTypeEnum.intervalDistance)
                                          ? "Time (mins)" : "Distance (m)")}
                                        </th>
                                        <th>Split</th>
                                        <th>SPM</th>
                                        <th>HR</th>
                                      </thead>
                                      <tbody>
                                        {matchingWorkouts.map((matched) => (
                                          <tr>
                                            <td>{matched.date.getDate()}/{matched.date.getMonth()}</td>
                                            {/* Determine Main Metric here */
                                              (
                                                workout.workoutType == workoutTypeEnum.singleDistance ||
                                                workout.workoutType == workoutTypeEnum.intervalDistance) ?
                                                <td>{secsToTimeString(matched.totalTimeSecs)}</td> :
                                                <td>{matched.totalDistance}</td>
                                            }
                                            <td>{formatSplitTime(matched.totalSplitSecs)}</td>
                                            <td>{matched.avgStrokeRate ?? "-"}</td>
                                            <td>{matched.avgHeartRate ?? "-"}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </>
                            }
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
      <AthleteNavbar activePage="ProgressView" />
    </>
  )
}