import { useState, useEffect } from 'react';
import CoachNavbar from "../../components/navbar/CoachNavbar";
import './createactivity.css';
import { WorkoutTemplate, workoutTypeEnum } from "../../types/types";
import TemplateBuilder from '../../components/Builders/TemplateBuilder';

export default function CreateActivity() {

  const [selectionStep, setSelectionStep] = useState(0);
  const [selectionWorkoutType, setSelectionWorkoutType] = useState(workoutTypeEnum.singleDistance); 

  function handleSelectionClick(workoutType: workoutTypeEnum) {
    console.log("Workout type selected new: ", workoutType);
    setSelectionWorkoutType(workoutType); 
    setSelectionStep(1);
  }

  function handleExistingClick() {
    console.log("Existing workout selected, view templates");
    setSelectionStep(2);
  }

  function handleReturnClick() {
    setSelectionStep(0);
  }

  const handleReturnClickArrow = () => {
    setSelectionStep(0); 
  }

  return (
    <>

      <div className="create-page">
        <div className="create-content">
          <div className="create-title">
            <p>Create Activity</p>
          </div>

          <div className="breaker"></div>
          {selectionStep == 0 ? <>
            <div className="create-selection">
              <button className="selection-btn" onClick={handleExistingClick}>Select from existing</button>
              <div className="breaker selection"></div>
              <p>Or create new:</p>
              <button className="selection-btn" onClick={() => handleSelectionClick(workoutTypeEnum.singleDistance)}>Single Distance</button>
              <button className="selection-btn" onClick={() => handleSelectionClick(workoutTypeEnum.singleTime)}>Single Time</button>
              <button className="selection-btn" onClick={() => handleSelectionClick(workoutTypeEnum.intervalDistance)}>Intervals Distance</button>
              <button className="selection-btn" onClick={() => handleSelectionClick(workoutTypeEnum.intervalTime)}>Intervals Time</button>
            </div>
          </> : (selectionStep == 1 ? <>
            <div className="template-builder">
              <div className="template-builder-title">
                <div className="selection-back" onClick={handleReturnClick}>&#11013; Back</div>
                <div className="title">Build Session</div>
              </div>

              <TemplateBuilder workoutType={selectionWorkoutType} discardWorkout={handleReturnClickArrow}/>

            </div>
          </> : <>
            <div className="selection-back" onClick={handleReturnClick}>&#11013; Back</div>
          </>
          )}


          <div className="breaker"></div>
        </div>
      </div>
            
      <div className="navbar-padding"></div>
      <CoachNavbar activePage="CreateActivity" />
    </>
  )
}