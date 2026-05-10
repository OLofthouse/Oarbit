export const enum trainingTypeEnum {
  Water = "Water",
  Land = "Gym",
  None = "Unset",
}

export const enum workoutTypeEnum {
  singleDistance = "Single Distance",
  singleTime = "Single Time",
  intervalDistance = "Interval Distance",
  intervalTime = "Interval Time",
}

interface IntervalTemplate {
  intervalNumber: number, 
  targetDistance: number | null, 
  targetTime: number | null,
}

interface IntervalComplete {
  intervalNumber: number, 
  completedDistance: number | null, 
  completedTimeSecs: number | null, 
  completedSplitSecs: number | null,
  completedHeartRate: number | null, 
  completedStrokeRate: number | null,
}

interface WorkoutTemplate {
  title: string, 
  date: Date, 
  location: string, 
  assignedCoach: string, 
  trainingType: trainingTypeEnum, 
  workoutType: workoutTypeEnum,
  intervals: IntervalTemplate[]
}

interface CompleteWorkoutFromTemplate {
  title: string,
  date: Date, 
  location: string,
  assignedCoach: string,
  trainingType: trainingTypeEnum, 
  workoutType: workoutTypeEnum,
  totalDistance: number | null, 
  totalTimeSecs: number | null, 
  totalSplitSecs: number | null, 
  avgHeartRate: number | null, 
  avgStrokeRate: number | null, 
  intervals: IntervalComplete[],
}

export type {WorkoutTemplate, CompleteWorkoutFromTemplate, IntervalTemplate, IntervalComplete};