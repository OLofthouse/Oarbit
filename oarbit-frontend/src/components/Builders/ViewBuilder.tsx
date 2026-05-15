import { AssignedWorkout, assignedWorkoutStatus, CoachOverviewWorkout, IntervalTemplate, trainingTypeEnum, workoutTypeEnum } from '../../types/types';
import { useNavigate } from 'react-router-dom';
import './builders.css';
import { secsToTimeString } from '../../utils/useTimeInput';
import { useState, useEffect } from 'react';
import { formatSplitTime } from '../../utils/timeFormats';

interface ViewBuilerProps {
  workout: AssignedWorkout
}

export default function ViewBuilder(props: ViewBuilerProps) {

  const navigate = useNavigate();
  const [viewMatched, setViewMatched] = useState(false);
  const [matchingWorkouts, setMatchingWorkouts] = useState<CoachOverviewWorkout[]>([]);

  useEffect(() => {
    // Load Matching Workouts
    setMatchingWorkouts([{
      title: "2k",
      date: new Date(),
      location: "Sport Bu",
      assignedCoach: "",
      status: assignedWorkoutStatus.Completed,
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
      athleteName: "Oscar Lofthouse"
    },
    {
      title: "2k",
      date: new Date(),
      location: "Sport Bu",
      assignedCoach: "",
      status: assignedWorkoutStatus.Completed,
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
      athleteName: "Oscar Lofthouse"
    }
    ])
  }, [])

  function getTargetPlaceholderValue(interval: IntervalTemplate) {
    if (props.workout.workoutType == workoutTypeEnum.singleDistance ||
      props.workout.workoutType == workoutTypeEnum.intervalDistance) {
      if (interval.targetDistance) return interval.targetDistance.toString()
    }

    if (props.workout.workoutType == workoutTypeEnum.singleTime ||
      props.workout.workoutType == workoutTypeEnum.intervalTime) {
      if (interval.targetTimeSecs) return secsToTimeString(interval.targetTimeSecs);
    }

    return "";
  }

  function handleLogSessionClick(workout: AssignedWorkout) {
    navigate('/LogActivity', { state: { prefillWorkout: true, workout: workout } });
  }

  return (
    <>
      <div className="builder-component">
        <div id="view-builder-component" className="template-builder-component">
          <form>
            <div className="overview-information">
              <div className="form-row">
                <div className="template-input-container">
                  <p id="view-builder-title">Title</p>
                  <input type="text" value={props.workout.title} disabled />
                </div>
              </div>

              <div className="form-row">
                <div className="template-input-container">
                  <p>Date</p>
                  <input type="date" value={props.workout.date.toISOString().substr(0, 10)} disabled />
                </div>

                <div className="template-input-container">
                  <p>Location:</p>
                  <input type="text" value={props.workout.location} disabled />
                </div>
              </div>

              <div className="template-input-container">
                <p>Coach:</p>
                <input id="template-coach-input" type="text" disabled value={props.workout.assignedCoach} />
              </div>
            </div>

            <div className="interval-information">
              <div className="title-container">
                <p>Intervals - {props.workout.workoutType}</p>
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <th style={{ width: "10%" }}>#</th>
                    <th>{((
                      props.workout.workoutType == workoutTypeEnum.singleDistance ||
                      props.workout.workoutType == workoutTypeEnum.intervalDistance)
                      ? "Distance (m)" : "Time (mins)")}
                    </th>
                  </thead>
                  <tbody>
                    {props.workout.intervals.map((interval) => (
                      <tr>
                        <td className="table-iv-num">{interval.intervalNumber}</td>
                        <td className="cell-input"><input disabled type="text" value={getTargetPlaceholderValue(interval)} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="matched-past-container">
                {viewMatched == false ?
                  <>
                    <div className="button-container">
                      <button type="button" className="discard-btn" onClick={() => { setViewMatched(true) }}>View Past Matching Workouts</button>
                    </div>
                  </> : <>
                    <div className="matched-past-content">
                      <div className="title-container">
                        <p>Matching Past Workouts</p>
                      </div>
                      <div className="table-wrap">
                        <table>
                          <thead>
                            <th style={{ width: "10%" }}>Date</th>
                            <th>{((
                              props.workout.workoutType == workoutTypeEnum.singleDistance ||
                              props.workout.workoutType == workoutTypeEnum.intervalDistance)
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
                                    props.workout.workoutType == workoutTypeEnum.singleDistance ||
                                    props.workout.workoutType == workoutTypeEnum.intervalDistance) ?
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
                  </>}
              </div>

              <div className="log-button-container">
                <button type="button" className="view-builder-log-btn" onClick={() => { handleLogSessionClick(props.workout) }}>Log Session</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}