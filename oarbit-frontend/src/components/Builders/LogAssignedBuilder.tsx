import { AssignedWorkout, CompleteWorkoutFromTemplate, IntervalComplete, IntervalTemplate, workoutTypeEnum } from '../../types/types';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { formatDisplay, formatSplitTime, parseTimeToSeconds } from '../../utils/timeFormats';
import './builders.css';
import { FormIntervalTimeInputCell, liveTimeStringValidation, secsToTimeString } from '../../utils/useTimeInput';
// import { TimeInput } from '../TimeInput';

interface LogAssignedBuilderProps {
  workout: AssignedWorkout
}

export default function LogAssignedBuilder(props: LogAssignedBuilderProps) {

  const navigate = useNavigate();
  const [completeWorkout, setCompleteWorkout] = useState<CompleteWorkoutFromTemplate>({
    ...props.workout,
    totalDistance: null,
    totalTimeSecs: null,
    totalSplitSecs: null,
    avgHeartRate: null,
    avgStrokeRate: null,
    intervals: [],
  });
  const [mainMetric, setMainMetric] = useState("");

  useEffect(() => {
    let totalIntervalDistance: any = null;
    let totalIntervalTime: any = null;

    if (props.workout.workoutType == workoutTypeEnum.singleDistance || props.workout.workoutType == workoutTypeEnum.intervalDistance) {
      setMainMetric("Distance");
      // totalIntervalDistance = props.workout.intervals.reduce(function (acc, obj) { return acc + obj.targetDistance! }, 0);
      props.workout.intervals.forEach((interval) => totalIntervalDistance = totalIntervalDistance + interval.targetDistance);
      console.log("Total Interval Distance", totalIntervalDistance);
    }

    if (props.workout.workoutType == workoutTypeEnum.singleTime || props.workout.workoutType == workoutTypeEnum.intervalTime) {
      setMainMetric("Time");
    }

    const workoutIntervals: IntervalComplete[] = [];
    props.workout.intervals.forEach((interval) => {
      workoutIntervals.push({
        intervalNumber: interval.intervalNumber,
        targetDistance: interval.targetDistance,
        targetTimeSecs: interval.targetTimeSecs,
        completedDistance: totalIntervalDistance,
        completedTimeSecs: totalIntervalTime,
        completedSplitSecs: null,
        completedHeartRate: null,
        completedStrokeRate: null,
      })
    });

    console.log("Workout Intervals", workoutIntervals);
    setCompleteWorkout((prev) => ({ ...prev, intervals: workoutIntervals }))
  }, [])

  function handleReturnClick() {
    navigate('/AthleteDashboard');
  }

  function calculateDistanceValue(interval: IntervalTemplate) {
    if (mainMetric == "Distance") return interval.targetDistance?.toString();

    if (completeWorkout.totalTimeSecs && completeWorkout.totalSplitSecs) {
      return ((completeWorkout.totalTimeSecs / completeWorkout.totalSplitSecs) * 500).toString();
    }
  }

  function calculateTimeValue(interval: IntervalTemplate) {
    if (mainMetric == "Time") return interval.targetTimeSecs ? secsToTimeString(interval.targetTimeSecs) : "";
  }

  function calculateSplitValue(interval: IntervalComplete, updatedTimeDist: number) {
    if (mainMetric == "Distance") {
      return 500 * (Number(updatedTimeDist) / interval.targetDistance!)
    }

    if (mainMetric == "Time") {
      return 500 * (interval.targetTimeSecs! / updatedTimeDist);
    }

    return 0;
  }

  function updateIntervalDistanceValue(interval: IntervalComplete, updatedValue: number) {
    const updatedInterval: IntervalComplete = { ...interval, completedDistance: updatedValue, completedSplitSecs: calculateSplitValue(interval, updatedValue) };

    setCompleteWorkout((prev) => ({
      ...prev, intervals: prev.intervals.map((itv) => {
        if (itv.intervalNumber == interval.intervalNumber) return updatedInterval;
        return itv;
      })
    }));
  }

  function updateIntervalTimeValue(interval: IntervalComplete, updatedValue: number) {
    const updatedInterval = { ...interval, completedTimeSecs: updatedValue, completedSplitSecs: calculateSplitValue(interval, updatedValue) };

    setCompleteWorkout((prev) => ({
      ...prev, intervals: prev.intervals.map((itv) => {
        if (itv.intervalNumber == interval.intervalNumber) return updatedInterval;
        return itv;
      })
    }));
  }

  function updateIntervalHRValue(interval: IntervalComplete, updatedValue: number) {
    const updatedInterval = { ...interval, completedHeartRate: updatedValue };

    if (!completeWorkout.avgHeartRate) {
      setCompleteWorkout((prev) => ({ ...prev, avgHeartRate: updatedValue }));
    }

    setCompleteWorkout((prev) => ({
      ...prev, intervals: prev.intervals.map((itv) => {
        if (itv.intervalNumber == interval.intervalNumber) return updatedInterval;
        return itv;
      })
    }))
  }

  function updateIntervalSPMValue(interval: IntervalComplete, updatedValue: number) {
    const updatedInterval = { ...interval, completedStrokeRate: updatedValue };

    if (!completeWorkout.avgStrokeRate) {
      setCompleteWorkout((prev) => ({ ...prev, avgStrokeRate: updatedValue }));
    }

    setCompleteWorkout((prev) => ({
      ...prev, intervals: prev.intervals.map((itv) => {
        if (itv.intervalNumber == interval.intervalNumber) return updatedInterval;
        return itv;
      })
    }))
  }

  function calculateTotalDistance() {
    let totalDistance = 0;
    completeWorkout.intervals.forEach((interval) => totalDistance = totalDistance + (interval.targetDistance ? interval.targetDistance : 0));

    return totalDistance;
  }

  function calculateTotalTimeSecs() {
    let totalTimeSecs = 0;
    completeWorkout.intervals.forEach((interval) => totalTimeSecs = totalTimeSecs + (interval.targetTimeSecs ? interval.targetTimeSecs : 0));

    return totalTimeSecs;
  }

  useEffect(() => {
    //console.log("An interval has been updated!", completeWorkout.intervals);
    //get all values not null and find the average; 
    let newTotalDistance: any = null;
    let newTotalTimeSecs: any = null;
    let newTotalSplitSecs: any = null;
    let intervalsSplitted: number = 0;
    let newAvgHeartRate: any = null;
    let intervalsHearted: number = 0;
    let newAvgStrokeRate: any = null;
    let intervalsStroked: number = 0;

    completeWorkout.intervals.forEach((interval) => {
      if (interval.completedDistance) newTotalDistance += interval.completedDistance;
      if (interval.completedTimeSecs) newTotalTimeSecs += interval.completedTimeSecs;
      if (interval.completedSplitSecs) { newTotalSplitSecs += interval.completedSplitSecs; intervalsSplitted += 1 }
      if (interval.completedHeartRate) { newAvgHeartRate += interval.completedHeartRate; intervalsHearted += 1 }
      if (interval.completedStrokeRate) { newAvgStrokeRate += interval.completedStrokeRate; intervalsStroked += 1 }
    });

    //console.log("New Completed Time: ", newTotalTimeSecs);

    setCompleteWorkout((prev) => ({
      ...prev, totalDistance: newTotalDistance, totalTimeSecs: newTotalTimeSecs,
      totalSplitSecs: (newTotalSplitSecs ? (newTotalSplitSecs / intervalsSplitted) : null),
      avgHeartRate: (newAvgHeartRate ? (newAvgHeartRate / intervalsHearted) : null),
      avgStrokeRate: (newAvgStrokeRate ? (newAvgStrokeRate / intervalsStroked) : null)
    }))

  }, [completeWorkout.intervals])

  useEffect(() => {
    //("Updated Complete Workout", completeWorkout); 
  }, [completeWorkout])

  return (
    <>
      <div className="builder-component">
        <div className="header">
          <div className="log-assigned-back" onClick={handleReturnClick}>&#11013; Back</div>
          <div className="title">Log Assigned Session</div>
        </div>
        <div className="template-builder-component">
          <form>
            <div className="overview-information">

              <p className="overview-title">Session Overview</p>

              <div className="form-row">
                <div className="template-input-container">
                  <p>Title</p>
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

              <div className="breaker"></div>

              <p className='overview-title'>Session Totals:</p>
              <div className="session-totals">
                <div className="session-totals-row">
                  {mainMetric == "Distance" ? (
                    <>
                      <div className="total-distance">
                        <p>Total Distance</p>
                        <input className="total-input" type="text" disabled value={calculateTotalDistance()} />
                      </div>
                      <div className="total-time">
                        <p>Total Time</p>
                        <input type="text" className="total-input" disabled value={completeWorkout.totalTimeSecs ? secsToTimeString(completeWorkout.totalTimeSecs) : ""} />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="total-time">
                        <p>Total Time</p>
                        <input type="text" className="total-input" disabled value={secsToTimeString(calculateTotalTimeSecs())} />
                      </div>
                      <div className="total-distance">
                        <p>Total Distance</p>
                        <input className="total-input" type="text" disabled value={completeWorkout.totalDistance ? completeWorkout.totalDistance : ""} />
                      </div>
                    </>
                  )}
                  <div className="total-split">
                    <p>Average Split</p>
                    <input type="text" className="total-input" disabled
                      value={completeWorkout.totalSplitSecs ? formatSplitTime(completeWorkout.totalSplitSecs) : ""}
                    />
                  </div>
                </div>
                <div id="session-totals-row-2" className="session-totals-row">
                  <div className="total-bpm">
                    <p>Average HR</p>
                    <input type="number" className="total-input"
                      placeholder={completeWorkout.avgHeartRate?.toString()}
                      onBlur={(e) => {
                        setCompleteWorkout((prev) => (
                          {
                            ...prev,
                            avgHeartRate: Number(e.target.value),
                            intervals: prev.intervals.map((interval) => ({ ...interval, completedHeartRate: Number(e.target.value) }))
                          }))
                      }}
                      disabled
                    />
                  </div>
                  <div className="total-spm">
                    <p>Average SPM</p>
                    <input type="number" className="total-input "
                      placeholder={completeWorkout.avgStrokeRate?.toString()}
                      onBlur={(e) => {
                        setCompleteWorkout((prev) => (
                          {
                            ...prev,
                            avgStrokeRate: Number(e.target.value)
                          }))
                      }}
                      disabled
                    />
                  </div>
                </div>
              </div>

              <div className="breaker"></div>

              <div className="interval-information">
                <div className="title-container">
                  <p>Intervals - {props.workout.workoutType}</p>
                </div>

                <div className="table-wrap">
                  <table>
                    <thead>
                      <th style={{ width: "10%", maxWidth: "10%", minWidth: "10%" }}>#</th>
                      <th>Interval Details</th>
                    </thead>
                    <tbody>
                      {completeWorkout.intervals.map((interval, index) => (
                        <tr>
                          <td className="table-iv-num">{interval.intervalNumber}</td>
                          <td className="cell-input">
                            <details>
                              <summary>Log Stats +</summary>
                              {mainMetric == "Distance" ? (
                                <>
                                  <div className="intervals-input-container">
                                    <div className="intervals-input-container-row">
                                      <div className="total-distance">
                                        <p>Total Distance</p>
                                        <input className="total-input" type="text" value={calculateDistanceValue(interval)} disabled />
                                      </div>
                                      <div className="total-split">
                                        <p>Average Split</p>
                                        <input type="text" className="total-input" value={formatSplitTime(interval.completedSplitSecs ?? 0)} disabled />
                                      </div>
                                    </div>
                                    <div className="intervals-input-container-row">
                                      <div className="total-time">
                                        <p>Total Time</p>
                                        <FormIntervalTimeInputCell interval={interval} onUpdate={updateIntervalTimeValue} />
                                      </div>
                                      <div className="total-bpm">
                                        <p>Average HR</p>
                                        <input
                                          type="number" inputMode="numeric" className="total-input small"
                                          placeholder={interval.completedHeartRate ? interval.completedHeartRate.toString() : ""}
                                          onBlur={(e) => updateIntervalHRValue(interval, Number(e.target.value))}
                                        />
                                      </div>
                                      <div className="total-spm">
                                        <p>Average SPM</p>
                                        <input type="number" inputMode="numeric" className="total-input small" onBlur={(e) => updateIntervalSPMValue(interval, Number(e.target.value))} />
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
                                        <input className="total-input" type="text" value={calculateTimeValue(interval)} disabled />
                                      </div>
                                      <div className="total-split">
                                        <p>Average Split</p>
                                        <input type="text" className="total-input" value={formatSplitTime(interval.completedSplitSecs ?? 0)} disabled />
                                      </div>
                                    </div>
                                    <div className="intervals-input-container-row">
                                      <div className="total-distance">
                                        <p>Total Distance</p>
                                        <input type="number" inputMode="numeric" className="total-input small" onBlur={(e) => updateIntervalDistanceValue(interval, Number(e.target.value))} />
                                      </div>
                                      <div className="total-bpm">
                                        <p>Average HR</p>
                                        <input type="number" inputMode="numeric" className="total-input small"
                                          placeholder={interval.completedHeartRate ? interval.completedHeartRate.toString() : ""}
                                          onBlur={(e) => updateIntervalHRValue(interval, Number(e.target.value))}
                                        />
                                      </div>
                                      <div className="total-spm">
                                        <p>Average SPM</p>
                                        <input type="number" inputMode="numeric" className="total-input small" onBlur={(e) => updateIntervalSPMValue(interval, Number(e.target.value))} />
                                      </div>
                                    </div>
                                  </div>
                                </>)}


                            </details>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            <div className="submit-buttons">
              <button type="button" className="discard-btn" onClick={handleReturnClick}>Discard</button>
              <button type="button" className="save-btn" onClick={() => { }}>Log Session</button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}