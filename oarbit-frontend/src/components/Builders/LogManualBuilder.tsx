import { AssignedWorkout, CompleteWorkoutFromTemplate, IntervalComplete, IntervalTemplate, workoutTypeEnum, CompleteWorkoutFromManual, assignedWorkoutStatus, trainingTypeEnum } from '../../types/types';
import { Form, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { formatDisplay, formatSplitTime, parseTimeToSeconds } from '../../utils/timeFormats';
import './builders.css';
import { FormIntervalTimeInputCell, liveTimeStringValidation, secsToTimeString } from '../../utils/useTimeInput';

const baseCompleteWorkout: CompleteWorkoutFromManual = {
  title: "",
  date: new Date(),
  location: "",
  status: assignedWorkoutStatus.Completed,
  trainingType: trainingTypeEnum.Land,
  workoutType: workoutTypeEnum.singleDistance,
  totalDistance: null,
  totalTimeSecs: null,
  totalSplitSecs: null,
  avgHeartRate: null,
  avgStrokeRate: null,
  intervals: [{
    intervalNumber: 1,
    targetDistance: null,
    targetTimeSecs: null,
    completedDistance: null,
    completedTimeSecs: null,
    completedSplitSecs: null,
    completedHeartRate: null,
    completedStrokeRate: null,
  }]
}

export default function LogManualBuilder() {

  const [completeWorkout, setCompleteWorkout] = useState<CompleteWorkoutFromManual>(baseCompleteWorkout);
  const [workoutType, setWorkoutType] = useState("None");
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Complete workout updated: ", completeWorkout);
  }, [completeWorkout])

  function handleReturnClick() {
    navigate('/AthleteDashboard');
  }

  function handleSelectWorkoutType(option: any) {
    if (option == "Default") return;
    setCompleteWorkout((prev) => ({
      ...prev, workoutType: option
    }))
    setWorkoutType(option);
  }

  function handleSelectTrainingType(option: any) {
    if (option == "Default") return;
    setCompleteWorkout((prev) => ({
      ...prev, trainingType: option
    }))
  }

  function calculateSplitValue(distance: number, time: number) {
    return 500 * (time / distance);
  }

  function handleSingleUpdateDistance(newDistance: number) {
    if (completeWorkout.totalTimeSecs == null) {
      setCompleteWorkout((prev) => ({ ...prev, totalDistance: newDistance, intervals: prev.intervals.map((int) => ({ ...int, completedDistance: newDistance })) }))
    } else {
      const newSplit = calculateSplitValue(newDistance, completeWorkout.intervals[0].completedTimeSecs!);
      setCompleteWorkout((prev) => ({
        ...prev, totalDistance: newDistance, totalSplitSecs: newSplit,
        intervals: prev.intervals.map((int) => ({ ...int, completedDistance: newDistance, completedSplitSecs: newSplit }))
      }))
    }
  }

  function handleSingleUpdateTime(interval: IntervalComplete, updatedValue: number) {
    let updatedInterval = { ...interval, completedTimeSecs: updatedValue };
    if (interval.completedDistance == null) {
      setCompleteWorkout((prev) => ({ ...prev, totalTimeSecs: updatedValue, intervals: [updatedInterval] }));
    } else {
      const newSplit = calculateSplitValue(interval.completedDistance, updatedValue);
      updatedInterval = { ...updatedInterval, completedSplitSecs: newSplit };
      setCompleteWorkout((prev) => ({ ...prev, totalTimeSecs: updatedValue, totalSplitSecs: newSplit, intervals: [updatedInterval] }))
    }
  }

  function handleSingleUpdateHR(newValue: number) {
    setCompleteWorkout((prev) => ({ ...prev, avgHeartRate: newValue, intervals: [{ ...prev.intervals[0], completedHeartRate: newValue }] }))
  }

  function handleSingleUpdateSPM(newValue: number) {
    setCompleteWorkout((prev) => ({ ...prev, avgStrokeRate: newValue, intervals: [{ ...prev.intervals[0], completedStrokeRate: newValue }] }))
  }

  function handleIntervalUpdateDistance(interval: IntervalComplete, newValue: number) {
    const updatedInterval: IntervalComplete = { ...interval, completedDistance: newValue }
    // check for split update
    if (interval.completedTimeSecs) updatedInterval.completedSplitSecs = calculateSplitValue(updatedInterval.completedDistance!, interval.completedTimeSecs);
    setCompleteWorkout((prev) => ({
      ...prev, intervals: prev.intervals.map((itv) => {
        if (itv.intervalNumber == interval.intervalNumber) return updatedInterval;
        return itv;
      })
    }))
  }
  function handleIntervalUpdateTime(interval: IntervalComplete, newValue: number) {
    const updatedInterval: IntervalComplete = { ...interval, completedTimeSecs: newValue }
    if (interval.completedDistance) updatedInterval.completedSplitSecs = calculateSplitValue(interval.completedDistance, updatedInterval.completedTimeSecs!);
    setCompleteWorkout((prev) => ({
      ...prev, intervals: prev.intervals.map((itv) => {
        if (itv.intervalNumber == interval.intervalNumber) return updatedInterval;
        return itv;
      })
    }))
  }
  function handleIntervalUpdateHR(interval: IntervalComplete, newValue: number) {
    const updatedInterval = { ...interval, completedHeartRate: newValue }
    setCompleteWorkout((prev) => ({
      ...prev, intervals: prev.intervals.map((itv) => {
        if (itv.intervalNumber == interval.intervalNumber) return updatedInterval;
        return itv;
      })
    }))
  }
  function handleIntervalUpdateSPM(interval: IntervalComplete, newValue: number) {
    const updatedInterval = { ...interval, completedStrokeRate: newValue };
    setCompleteWorkout((prev) => ({
      ...prev, intervals: prev.intervals.map((itv) => {
        if (itv.intervalNumber == interval.intervalNumber) return updatedInterval;
        return itv;
      })
    }))
  }

  useEffect(() => {
    // recalculate totals section: this is done by adding all fully complete intervals vals
    let newTotalDistance: any = null, newTotalTimeSecs: any = null, newTotalSplitSecs: any = null, intervalsSplitted: any = 0,
      newAvgHeartRate: any = null, intervalsHearted: any = 0, newAvgStrokeRate: any = null, intervalsStroked: any = 0;

    console.log("Here?", completeWorkout.intervals);
    completeWorkout.intervals.forEach((interval) => {
      if (interval.completedDistance) { newTotalDistance += interval.completedDistance; console.log(newTotalDistance, interval.completedDistance) }
      if (interval.completedTimeSecs) newTotalTimeSecs += interval.completedTimeSecs;
      if (interval.completedSplitSecs) { newTotalSplitSecs += interval.completedSplitSecs; intervalsSplitted += 1 }
      if (interval.completedHeartRate) { newAvgHeartRate += interval.completedHeartRate; intervalsHearted += 1 }
      if (interval.completedStrokeRate) { newAvgStrokeRate += interval.completedStrokeRate; intervalsStroked += 1 }
    })

    console.log("total distance", newTotalDistance);

    setCompleteWorkout((prev) => ({
      ...prev, totalDistance: newTotalDistance, totalTimeSecs: newTotalTimeSecs,
      totalSplitSecs: (newTotalSplitSecs ? (newTotalSplitSecs / intervalsSplitted) : null),
      avgHeartRate: (newAvgHeartRate ? (newAvgHeartRate / intervalsHearted) : null),
      avgStrokeRate: (newAvgStrokeRate ? (newAvgStrokeRate / intervalsStroked) : null)
    }))

    //calculate and apply split
  }, [completeWorkout.intervals])

  function handleAddInterval() {
    setCompleteWorkout((prev) => ({
      ...prev,
      intervals: [...prev.intervals, {
        intervalNumber: prev.intervals.length + 1,
        targetDistance: null,
        targetTimeSecs: null,
        completedDistance: null,
        completedTimeSecs: null,
        completedSplitSecs: null,
        completedHeartRate: null,
        completedStrokeRate: null,
      }]
    }))
  }

  function handleDeleteInterval(index: number) {
    if (completeWorkout.intervals.length == 1) return; 
    setCompleteWorkout((prev) => ({...prev, intervals: 
      prev.intervals.filter((_, i) => i !== index).map((interval, i) => ({...interval, intervalNumber: i + 1}))
    }))
  }

  function determineInputDisplay() {
    if (workoutType == workoutTypeEnum.singleDistance) {
      return (
        <>
          <div style={{ marginTop: "1rem" }} className="session-totals">
            <div className="breaker"></div>
            <p style={{ marginTop: "0.8rem" }} className="overview-title">Single Distance</p>
            <div style={{ marginTop: "0.8rem" }} className="session-totals-row">
              <div className="total-distance">
                <p>Total Distance</p>
                <input type="number" className="total-input small" onBlur={(e) => handleSingleUpdateDistance(Number(e.target.value))} required />
              </div>
              <div className="total-time">
                <p>Total Time</p>
                <FormIntervalTimeInputCell interval={completeWorkout.intervals[0]} onUpdate={handleSingleUpdateTime} />
              </div>
            </div>
            <div className="session-totals-row">
              <div className="total-split">
                <p>Average Split</p>
                <input type="text" disabled value={completeWorkout.totalSplitSecs ? formatSplitTime(completeWorkout.totalSplitSecs) : ""} />
              </div>
              <div className="total-bpm">
                <p>Average HR</p>
                <input type="number" inputMode="numeric" className="total-input small" onBlur={(e) => handleSingleUpdateHR(Number(e.target.value))} />
              </div>
              <div className="total-spm">
                <p>Average SPM</p>
                <input type="number" inputMode="numeric" className="total-input small" onBlur={(e) => handleSingleUpdateSPM(Number(e.target.value))} />
              </div>
            </div>
          </div>
        </>
      )
    }

    if (workoutType == workoutTypeEnum.singleTime) {
      return (
        <>
          <div style={{ marginTop: "1rem" }} className="session-totals">
            <div className="breaker"></div>
            <p style={{ marginTop: "0.8rem" }} className="overview-title">Single Distance</p>
            <div style={{ marginTop: "0.8rem" }} className="session-totals-row">
              <div className="total-time">
                <p>Total Time</p>
                <FormIntervalTimeInputCell interval={completeWorkout.intervals[0]} onUpdate={handleSingleUpdateTime} />
              </div>
              <div className="total-distance">
                <p>Total Distance</p>
                <input type="number" className="total-input small" onBlur={(e) => handleSingleUpdateDistance(Number(e.target.value))} required />
              </div>
            </div>
            <div className="session-totals-row">
              <div className="total-split">
                <p>Average Split</p>
                <input type="text" disabled value={completeWorkout.totalSplitSecs ? formatSplitTime(completeWorkout.totalSplitSecs) : ""} />
              </div>
              <div className="total-bpm">
                <p>Average HR</p>
                <input type="number" inputMode="numeric" className="total-input small" onBlur={(e) => handleSingleUpdateHR(Number(e.target.value))} />
              </div>
              <div className="total-spm">
                <p>Average SPM</p>
                <input type="number" inputMode="numeric" className="total-input small" onBlur={(e) => handleSingleUpdateSPM(Number(e.target.value))} />
              </div>
            </div>
          </div>
        </>
      )
    }

    if (workoutType == workoutTypeEnum.intervalDistance) {
      return (
        <>
          <div style={{ marginTop: "1rem" }} className="session-totals">
            <div className="breaker"></div>
            <p style={{ marginTop: "0.8rem" }} className="overview-title">Session Totals</p>
            <div style={{ marginTop: "0.8rem" }} className="session-totals-row">
              <div className="total-distance">
                <p>Total Distance</p>
                <input type="number" className="total-input" disabled value={completeWorkout.totalDistance ? completeWorkout.totalDistance.toString() : ""} />
              </div>
              <div className="total-time">
                <p>Total Time</p>
                <input type="text" className="total-input" disabled value={completeWorkout.totalTimeSecs ? secsToTimeString(completeWorkout.totalTimeSecs) : ""} />
              </div>
            </div>
            <div className="session-totals-row">
              <div className="total-split">
                <p>Average Split</p>
                <input type="text" disabled value={completeWorkout.totalSplitSecs ? formatSplitTime(completeWorkout.totalSplitSecs) : ""} />
              </div>
              <div className="total-bpm">
                <p>Average HR</p>
                <input type="number" inputMode="numeric" className="total-input small"
                  placeholder={completeWorkout.avgHeartRate ? completeWorkout.avgHeartRate.toString() : ""}
                  onBlur={(e) => handleSingleUpdateHR(Number(e.target.value))} />
              </div>
              <div className="total-spm">
                <p>Average SPM</p>
                <input type="number" inputMode="numeric" className="total-input small"
                  placeholder={completeWorkout.avgStrokeRate ? completeWorkout.avgStrokeRate.toString() : ""}
                  onBlur={(e) => handleSingleUpdateSPM(Number(e.target.value))} />
              </div>
            </div>
          </div>
          <div className="breaker"></div>
          <div className="interval-information">
            <div className="title-container">
              <p>{completeWorkout.workoutType}</p>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <th style={{ width: "10%", maxWidth: "10%", minWidth: "10%" }}>#</th>
                  <th>Interval Details</th>
                  <th style={{ width: "10%", maxWidth: "10%", minWidth: "10%" }}>X</th>
                </thead>
                <tbody>
                  {completeWorkout.intervals.map((interval, index) => (
                    <tr>
                      <td className="table-iv-num">{interval.intervalNumber}</td>
                      <td className="cell-input">
                        <details>
                          <summary>Log Stats +</summary>
                          <div className="intervals-input-container">
                            <div className="intervals-input-container-row">
                              <div className="total-distance">
                                <p>Total Distance</p>
                                <input className="total-input small" type="number" inputMode="numeric"
                                  onBlur={(e) => { handleIntervalUpdateDistance(interval, Number(e.target.value)) }} 
                                  placeholder={interval.completedDistance ? interval.completedDistance.toString() : ""}/>
                              </div>
                              <div className="total-time">
                                <p>Total Time</p>
                                <FormIntervalTimeInputCell interval={interval} onUpdate={handleIntervalUpdateTime} />
                              </div>
                            </div>
                            <div className="intervals-input-container-row">
                              <div className="total-split">
                                <p>Average Split</p>
                                <input type="text" disabled value={interval.completedSplitSecs ? formatSplitTime(interval.completedSplitSecs) : ""} />
                              </div>
                              <div className="total-bpm">
                                <p>Average HR</p>
                                <input type="text" inputMode="numeric" className="total-input small"
                                  placeholder={completeWorkout.avgHeartRate ? completeWorkout.avgHeartRate.toString() : ""}
                                  onBlur={(e) => { handleIntervalUpdateHR(interval, Number(e.target.value)) }} />
                              </div>
                              <div className="total-spm">
                                <p>Average SPM</p>
                                <input type="text" inputMode="numeric" className="total-input small"
                                  placeholder={completeWorkout.avgStrokeRate ? completeWorkout.avgStrokeRate.toString() : ""}
                                  onBlur={(e) => { handleIntervalUpdateSPM(interval, Number(e.target.value)) }} />
                              </div>
                            </div>
                          </div>
                        </details>
                      </td>
                      <td onClick={() => handleDeleteInterval(index)}>X</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="add-intervals-btn-wrap">
                <button type="button" className="discard-btn-manual-intervals" onClick={handleAddInterval}>+ Add Interval</button>
              </div>
            </div>
          </div>

        </>
      )
    }

    if (workoutType == workoutTypeEnum.intervalTime) {
      return (
        <>
          <div style={{ marginTop: "1rem" }} className="session-totals">
            <div className="breaker"></div>
            <p style={{ marginTop: "0.8rem" }} className="overview-title">Session Totals</p>
            <div style={{ marginTop: "0.8rem" }} className="session-totals-row">
              <div className="total-time">
                <p>Total Time</p>
                <input type="text" className="total-input" disabled value={completeWorkout.totalTimeSecs ? secsToTimeString(completeWorkout.totalTimeSecs) : ""} />
              </div>
              <div className="total-distance">
                <p>Total Distance</p>
                <input type="number" className="total-input" disabled value={completeWorkout.totalDistance ? completeWorkout.totalDistance.toString() : ""} />
              </div>
            </div>
            <div className="session-totals-row">
              <div className="total-split">
                <p>Average Split</p>
                <input type="text" disabled value={completeWorkout.totalSplitSecs ? formatSplitTime(completeWorkout.totalSplitSecs) : ""} />
              </div>
              <div className="total-bpm">
                <p>Average HR</p>
                <input type="number" inputMode="numeric" className="total-input small" onBlur={(e) => handleSingleUpdateHR(Number(e.target.value))} />
              </div>
              <div className="total-spm">
                <p>Average SPM</p>
                <input type="number" inputMode="numeric" className="total-input small" onBlur={(e) => handleSingleUpdateSPM(Number(e.target.value))} />
              </div>
            </div>
          </div>
        </>
      )
    }
  }

  return (
    <>
      <div className="builder-component">
        <div className="header">
          <div className="log-assigned-back" onClick={handleReturnClick}>&#11013; Back</div>
          <div className="title">Log Manual Session</div>
        </div>

        <div className="template-builder-component">
          <form>
            <div className="overview-information">
              <p className="overview-title">Session Overview</p>
              <div className="form-row">
                <div className="template-input-container">
                  <p>Title</p>
                  <input type="text" onBlur={(e) => setCompleteWorkout((prev) => ({ ...prev, title: e.target.value }))} required />
                </div>
              </div>

              <div className="form-row">
                <div className="template-input-container">
                  <p>Date</p>
                  <input type="date" required />
                </div>
                <div className="template-input-container">
                  <p>Location</p>
                  <input type="text" required />
                </div>
              </div>

              <div className="form-row">
                <div className="template-input-container">
                  <p>Training Type</p>
                  <select onChange={(e) => handleSelectTrainingType(e.target.value)} required>
                    <option value={"Default"}>-- Please Select --</option>
                    <option value={trainingTypeEnum.Land}>Gym Session</option>
                    <option value={trainingTypeEnum.Water}>Water Session</option>
                  </select>
                </div>
                <div className="template-input-container">
                  <p>Workout Type</p>
                  <select onChange={(e) => handleSelectWorkoutType(e.target.value)} required>
                    <option value={"Default"}>-- Please Select --</option>
                    <optgroup label="Single Workout">
                      <option value={workoutTypeEnum.singleDistance}>Single Distance</option>
                      <option value={workoutTypeEnum.singleTime}>Single Time</option>
                    </optgroup>
                    <optgroup label="Interval Workout">
                      <option value={workoutTypeEnum.intervalDistance}>Intervals - Distance</option>
                      <option value={workoutTypeEnum.intervalTime}>Intervals - Time</option>
                    </optgroup>
                  </select>
                </div>
              </div>

              {workoutType == "None" ? (<>
                <div className="gap" style={{ height: "2vh" }}></div>
              </>) : (<>
                {determineInputDisplay()}
              </>)}

            </div>
            <div className="submit-buttons">
              <button type="button" className="discard-btn" onClick={handleReturnClick}>Discard</button>
              <button type="button" className="submit-btn" onClick={() => { }}>Log Session</button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

