import { IntervalTemplate, trainingTypeEnum, workoutTypeEnum } from '../../types/types';
import './builders.css';
import { useState, useEffect } from 'react';
import { isPropertySignature } from 'typescript';

interface TemplateBuilderProps {
  workoutType: workoutTypeEnum,
  discardWorkout: () => void;
}

export default function TemplateBuilder(props: TemplateBuilderProps) {

  const emptyInterval: IntervalTemplate = { intervalNumber: 1, targetDistance: null, targetTime: null };
  const [intervals, setIntervals] = useState<IntervalTemplate[]>([emptyInterval]);
  const [numIntervals, setNumIntervals] = useState(1);

  function dateTodayString(): string {
    const today = new Date();
    return today.toLocaleDateString();
  }

  function isWorkoutIntervals(): boolean {
    if (props.workoutType == workoutTypeEnum.singleDistance || props.workoutType == workoutTypeEnum.singleTime) return false;
    if (props.workoutType == workoutTypeEnum.intervalDistance || props.workoutType == workoutTypeEnum.intervalTime) return true;
    return false;
  }

  function deleteInterval(index: number) {
    if (numIntervals > 1) {
      setIntervals((prev) => prev.filter((_, i) => i !== index).map((interval, idx) => ({ ...interval, intervalNumber: idx + 1 })))
      setNumIntervals((prev) => prev - 1);
    }
  }

  function updateInterval(index: number, changedValue: any) {
    const updatedInterval: IntervalTemplate = {
      intervalNumber: index,
      targetDistance: (props.workoutType == workoutTypeEnum.intervalDistance || props.workoutType == workoutTypeEnum.singleDistance) ? changedValue : null,
      targetTime: (props.workoutType == workoutTypeEnum.intervalTime || props.workoutType == workoutTypeEnum.singleTime) ? changedValue : null
    }
    setIntervals((prev) => prev.map((iv, i) => (i === index ? updatedInterval : iv)));
    console.log(intervals, updatedInterval);
  }

  function addInterval() {
    setNumIntervals((prev) => prev + 1);

    setIntervals((prev) => [...prev, { 
      intervalNumber: prev.length, 
      targetDistance: (props.workoutType == workoutTypeEnum.intervalDistance ? prev[prev.length - 1].targetDistance : null), 
      targetTime: (props.workoutType == workoutTypeEnum.intervalTime ? prev[prev.length - 1].targetTime : null)
    }])
  }

  function getTargetPlaceholderValue(index: number) {
    if (props.workoutType == workoutTypeEnum.singleDistance || props.workoutType == workoutTypeEnum.intervalDistance) {
      return intervals[index].targetDistance ?? "";
    }

    if (props.workoutType == workoutTypeEnum.singleTime || props.workoutType == workoutTypeEnum.intervalTime) {
      return intervals[index].targetTime ?? "";
    }
  }

  function handleSavePress() {
    console.log("Intervals at Save: ", intervals);
  }

  return (
    <>
      <div className="builder-component">
        <div className="template-builder-component">
          <form>
            <div className="overview-information">
              <p className="overview-title">Session Overview</p>

              <div className="form-row">
                <div className="template-input-container">
                  <p>Title</p>
                  <input type="text"/>
                </div>
              </div>

              <div className="form-row">
                <div className="template-input-container">
                  <p>Date</p>
                  <input type="date" placeholder={dateTodayString()} />
                </div>

                <div className="template-input-container">
                  <p>Location:</p>
                  <input type="text" />
                </div>
              </div>

              <div className="template-input-container">
                <p>Coach:</p>
                <input id="template-coach-input" type="text" />
              </div>

              <div className="form-row">
                <div className="template-input-container">
                  <p>Type:</p>
                  <select>
                    <option value={trainingTypeEnum.Water}>Water</option>
                    <option value={trainingTypeEnum.Land}>Land</option>
                  </select>
                </div>

                <div className="template-input-container">
                  <p>Time:</p>
                  <input type="time" step="1800" />
                </div>
              </div>
            </div>
            <div className="interval-information">
              <div className="title-container">
                <p>Intervals - {props.workoutType}</p>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <th style={{ width: "10%" }}>#</th>
                    {isWorkoutIntervals() ? (
                      <th>{props.workoutType == workoutTypeEnum.intervalDistance ? "Distance (m)" : "Time (mins)"}</th>
                    ) : (
                      <th>{props.workoutType == workoutTypeEnum.singleDistance ? "Distance (m)" : "Time (mins)"}</th>
                    )}
                    <th style={{ width: "5%" }}></th>
                  </thead>
                  <tbody>
                    {isWorkoutIntervals() ? (
                      Array.from({ length: numIntervals }).map((item, index) => (<>
                        <tr>
                          <td className="table-iv-num">{index + 1}</td>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <td className="cell-input"><input type="number" onChange={(e) => { updateInterval(index, e.target.value) }} value={getTargetPlaceholderValue(index)} placeholder="0" /></td>
                          </div>
                          <td className="table-del-btn" onClick={() => deleteInterval(index)}>X</td>
                        </tr>
                      </>))
                    ) : (
                      <>
                        <tr>
                          <td className="table-iv-num">1</td>
                          <td>
                            <div className="single-input-wrap cell-input">
                              <input
                                type="number"
                                className="single-input"
                                placeholder="0"
                                min={0}
                                onChange={(e) => { updateInterval(0, e.target.value) }}
                                value={getTargetPlaceholderValue(0)}
                              />
                            </div>
                          </td>
                        </tr>
                      </>
                    )}


                  </tbody>
                </table>
              </div>

              {isWorkoutIntervals() ? <>
                <div className="add-interval-button-container">
                  <button type="button" onClick={addInterval} className="add-interval-btn">+ Add Interval</button>
                </div>
              </> : ""}
            </div>
            <div className="submit-buttons">
              <button type="button" className="discard-btn" onClick={props.discardWorkout}>Discard</button>
              <button type="button" className="save-btn" onClick={handleSavePress}>Save</button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}