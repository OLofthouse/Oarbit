import { AssignedWorkout, IntervalTemplate, workoutTypeEnum } from '../../types/types';
import { useNavigate } from 'react-router-dom'; 
import './builders.css';

interface ViewBuilerProps {
  workout: AssignedWorkout
}

export default function ViewBuilder(props: ViewBuilerProps) {

  const navigate = useNavigate();

  function getTargetPlaceholderValue(interval: IntervalTemplate) {
    if (props.workout.workoutType == workoutTypeEnum.singleDistance ||
      props.workout.workoutType == workoutTypeEnum.intervalDistance) {
      if (interval.targetDistance) return interval.targetDistance
    }

    if (props.workout.workoutType == workoutTypeEnum.singleTime || 
      props.workout.workoutType == workoutTypeEnum.intervalTime) {
        if (interval.targetTime) return interval.targetTime
      }

    return "";
  }

  function handleLogSessionClick(workout: AssignedWorkout) {
    navigate('/LogActivity', {state: {prefillWorkout: true, workout: workout}}); 
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
                        <td className="cell-input"><input disabled type="number" value={getTargetPlaceholderValue(interval)} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="log-button-container">
                <button type="button" className="view-builder-log-btn" onClick={() => {handleLogSessionClick(props.workout)}}>Log Session</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}