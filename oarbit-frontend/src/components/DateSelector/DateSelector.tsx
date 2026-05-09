import './dateselector.css';
import { useState } from 'react'; 

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]; 
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0,0,0,0); 
  return d;  
}

function getWeekDays(baseDate: Date, offset: number) {
  const start = getWeekStart(baseDate); 
  start.setDate(start.getDate() + offset * 7); 
  return Array.from({length: 7}, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i); 
    return d; 
  })
}

function isSameDay(a: Date, b: Date): Boolean {
  return (
    a.getFullYear() === b.getFullYear() && 
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatWeekLabel(days: Date[]) {
  const s = days[0]; 
  const e = days[6]; 
  if (s.getMonth() === e.getMonth()) {
    return `${MONTHS[s.getMonth()]} ${s.getDate()}–${e.getDate()}, ${s.getFullYear()}`;
  }
  return `${MONTHS[s.getMonth()]} ${s.getDate()} – ${MONTHS[e.getMonth()]} ${e.getDate()}, ${e.getFullYear()}`;
}

interface DateSelectorProps {
  selectedDate: Date | null, 
  onDateChange(date: Date): void
}

export default function DateSelector(props: DateSelectorProps) {

  const today = new Date(); 
  today.setHours(0, 0, 0, 0); 

  const [weekOffset, setWeekOffset] = useState(0); 
  const [internalSelected, setInternalSelected] = useState(today);

  var selected = props.selectedDate ?? internalSelected; 
  // selected = internalSelected; 

  const days = getWeekDays(today, weekOffset); 

  function handleDayClick(d: Date) {
    setInternalSelected(d); 
    props.onDateChange?.(d); 
  }

  return (
    <>
      <div className="date-selector-container">
        <div className="date-selector-content">
          <div className="date-selector-title">
            <p className="title">Schedule</p>
            <p className="month">{today.getDate() + " " + MONTHS[today.getMonth()]}</p>
          </div>

          <div className="date-selector-scroller">
            <button onClick={() => setWeekOffset((o) => o - 1)} className="arrow-btn">&lsaquo;</button>

            <div className="day-track">
              <div className="day-track-content">
                {
                  days.map((d) => {
                    var isActive = isSameDay(d, selected); 
                    return (
                      <>
                        <button
                          key={d.toISOString()}
                          onClick={() => {handleDayClick(d)}}
                          className={"dayBtn " + (isActive ? "dayBtnActive" : "")}
                        >
                          <span className={"dayLabel " + (isActive ? "dayLabelActive" : "")}>{DAY_NAMES[d.getDay()]}</span>
                          <span className={"dayNum " + (isActive ? "dayNumActive" : "")}>{d.getDate()}</span>
                        </button>
                      </>
                    )
                  })
                }
              </div>

              <p className={"weekLabel"}>{formatWeekLabel(days)}</p>
            </div>

            <button className="arrow-btn" onClick={() => setWeekOffset((o) => o + 1)}>&rsaquo;</button>
          </div>

          <div className="breaker"></div>
        </div>
      </div>
    </>
  )
}