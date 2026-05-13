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

export const enum assignedWorkoutStatus {
  Assigned = "Assigned", 
  Completed = "Completed", 
}

interface IntervalTemplate {
  intervalNumber: number, 
  targetDistance: number | null, 
  targetTimeSecs: number | null,
}

interface IntervalComplete extends IntervalTemplate {
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

interface AssignedWorkout extends WorkoutTemplate {
  status: assignedWorkoutStatus
}

interface CompleteWorkoutFromTemplate {
  title: string,
  date: Date, 
  location: string,
  assignedCoach: string,
  status: assignedWorkoutStatus, 
  trainingType: trainingTypeEnum, 
  workoutType: workoutTypeEnum,
  totalDistance: number | null, 
  totalTimeSecs: number | null, 
  totalSplitSecs: number | null, 
  avgHeartRate: number | null, 
  avgStrokeRate: number | null, 
  intervals: IntervalComplete[],
}

interface CoachOverviewWorkout {
  title: string, 
  date: Date,
  location: string,
  assignedCoach: string, 
  status: assignedWorkoutStatus, 
  trainingType: trainingTypeEnum, 
  workoutType: workoutTypeEnum, 
  totalDistance: number, 
  totalTimeSecs: number, 
  totalSplitSecs: number,
  avgHeartRate: number | null, 
  avgStrokeRate: number | null, 
  intervals: IntervalComplete[],
  athleteName: string
}

export type {WorkoutTemplate, AssignedWorkout, CompleteWorkoutFromTemplate, IntervalTemplate, IntervalComplete, CoachOverviewWorkout};