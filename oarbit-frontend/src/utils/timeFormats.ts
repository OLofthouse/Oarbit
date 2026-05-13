export function formatSplitTime(splitTimeValue: number): string {
  if (splitTimeValue == 0) return "";
  
  const mins = Math.floor(splitTimeValue / 60); 
  const secs = Math.floor(splitTimeValue % 60); 
  const tenths = Math.floor((splitTimeValue % 1) * 10); 

  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${tenths}`;
}

export function formatDisplay(digits: string): string {
  const len = digits.length; 

  if (len <= 2) return digits; 
  if (len === 3) return `${digits.slice(0, 1)}:${digits.slice(1)}}`; 
  if (len === 4) return `${digits.slice(0, 2)}:${digits.slice(2)}`;
  if (len === 5) return `${digits.slice(0, 2)}:${digits.slice(2, 4)}.${digits.slice(4)}`;
  if (len === 6) return `${digits.slice(0, 1)}:${digits.slice(1, 3)}:${digits.slice(3, 5)}.${digits.slice(5)}`;
  return `${digits.slice(0, 2)}:${digits.slice(2, 4)}:${digits.slice(4, 6)}.${digits.slice(6)}`;
}

export function parseTimeToSeconds(value: string): number {

  let [digits, decimal] = value.split("."); 
  digits = value.replace(/\D/g, "");
  
  let len = digits.length; 
  let isDecimal = false; 
  
  let hours = 0, mins = 0, secs = 0, tenths = 0; 
 
  if (value.indexOf('.') > -1) {
    digits = digits.substring(0, len - 1);
    isDecimal = true; 
    tenths = Number(decimal); 
    len -= 1; 
  };


  if (len <= 2) {
    secs = parseInt(digits, 10);
  } else if (len === 3) {
    mins = parseInt(digits.slice(0,1), 10); 
    secs = parseInt(digits.slice(1), 10); 
  } else if (len === 4) {
    mins = parseInt(digits.slice(0, 2), 10);
    secs = parseInt(digits.slice(2), 10);
  } else if (len === 5) {
    hours = parseInt(digits.slice(0, 1), 10);
    mins = parseInt(digits.slice(1,3), 10); 
    secs = parseInt(digits.slice(3), 10);
  } else if (len === 6) {
    hours = parseInt(digits.slice(0,2), 10); 
    mins = parseInt(digits.slice(2,4), 10); 
    secs = parseInt(digits.slice(4), 10); 
  } else {
    console.log("Time value exceeds length"); 
  }

  return (hours * 3600) + (mins * 60) + secs + (isDecimal ? tenths / 10 : 0); 
}