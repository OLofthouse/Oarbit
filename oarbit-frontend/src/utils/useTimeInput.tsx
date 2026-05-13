import { useState, useCallback, useEffect } from 'react';

const VALID_COMPLETE = /^(\d+:)?(\d:)?\d{2}(\.\d)?$/;

function parseTimeParts(raw: string) {
  const stripped = raw.replace(/[^\d:.]/g, "");
  const dotParts = stripped.split(".");
  const tenth = dotParts.length > 1 ? dotParts[1].slice(0, 1) : null;
  const colonParts = dotParts[0].split(":");

  if (colonParts.length == 1) {
    return { h: null, m: null, s: colonParts[0].slice(0, 2), t: tenth };
  }

  if (colonParts.length == 2) {
    return { h: null, m: colonParts[0], s: colonParts[1].slice(0, 2), t: tenth };
  }

  if (colonParts.length == 3) {
    return { h: colonParts[0], m: colonParts[1].slice(0, 2), s: colonParts[2].slice(0, 2), t: tenth };
  }

  return null;
}

function formatTimeInput(raw: string) {
  const hasDot = raw.includes(".");
  const [beforeDot, afterDot = ""] = raw.split(".");
  const digits = beforeDot.replace(/\D/g, "").slice(0, 6);
  const tenth = afterDot.replace(/\D/g, "").slice(0, 1);

  let formatted;
  const len = digits.length;

  if (len <= 2) {
    formatted = digits;
  } else if (len === 3) {
    formatted = `${digits[0]}:${digits.slice(1)}`;
  } else if (len === 4) {
    formatted = `${digits.slice(0, 2)}:${digits.slice(2)}`;
  } else if (len === 5) {
    formatted = `${digits[0]}:${digits.slice(1, 3)}:${digits.slice(3)}`;
  } else {
    const secPart = digits.slice(-2);
    const minPart = digits.slice(-4, -2);
    const hrPart = digits.slice(0, -4);
    formatted = `${hrPart}:${minPart}:${secPart}`;
  }

  if (hasDot) {
    formatted = `${formatted}.${tenth}`;
  }

  return formatted;

}

export function validateTime(value: string) {
  if (!value) return null;

  if (!VALID_COMPLETE.test(value)) return "Invalid Format";

  const parts = parseTimeParts(value);
  if (!parts) return "could not parse time";

  const s = parseInt(parts.s, 10);
  if (parts.s.length == 2 && (s < 0 || s > 59)) {
    return "Seconds must be 00-59";
  }

  if (parts.m !== null) {
    const m = parseInt(parts.m, 10);
    if (parts.h !== null && (m < 0 || m > 59)) {
      return "Minutes must be 00-59";
    }
  }

  return null;
}

export function useTimeInput(initialValue = "") {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const onChange = useCallback((e: any) => {
    const raw = e.target.value;

    if (!raw) {
      setValue("");
      setError(null);
      return;
    }

    if (/[^\d:.]/.test(raw)) return;

    if ((raw.match(/\./g) || []).length > 1) return;

    if ((raw.match(/:/g) || []).length > 2) return;

    const formatted = formatTimeInput(raw);
    setValue(formatted);

    if (touched || error) {
      //console.log("Error", formatted); 
      setError(validateTime(formatted));
    }
  }, [touched, error])

  const onBlur = useCallback(() => {
    setTouched(true);
    setError(validateTime(value));
  }, [value])

  const reset = useCallback(() => {
    setValue("");
    setError(null);
    setTouched(false);
  }, []);

  return {
    value,
    onChange,
    onBlur,
    error,
    isValid: !error && VALID_COMPLETE.test(value),
    reset,
  }
}

/** Convert raw seconds → "H:MM:SS.T" display string */
export function secsToTimeString(totalSecs: number) {
  if (totalSecs == null || isNaN(totalSecs)) return "";

  const t = Math.round(totalSecs * 10);
  const tenths = t % 10;
  const s = Math.floor((t / 10) % 60);
  const m = Math.floor((t / 600) % 60);
  const h = Math.floor((t / 36000));
  const ss = String(s).padStart(2, "0");
  const mm = String(m).padStart(2, "0");
  if (h > 0) return `${h}:${mm}:${ss}.${tenths}`;
  if (m > 0) return `${m}:${ss}.${tenths}`;
  return `${ss}.${tenths}`;
}

/** Convert a valid "H:MM:SS.T" string back to raw seconds */
export function timeStringToSecs(str: string) {
  if (!str || !VALID_COMPLETE.test(str)) return null;
  const [beforeDot, afterDot = "0"] = str.split(".");
  const parts = beforeDot.split(":").map(Number);
  const tenths = Number(afterDot) / 10;

  if (parts.length == 3) return (parts[0] * 3600) + (parts[1] * 60) + (parts[2]) + (tenths);
  if (parts.length == 2) return (parts[0] * 60) + parts[1] + tenths;
  return parts[0] + tenths;
}

/** Live Validation ?  */
export function liveTimeStringValidation(str: any) {
  const raw = str;
  if (!raw) return;
  if (/[^\d:.]/.test(raw)) return;
  if ((raw.match(/\./g) || []).length > 1) return;
  if ((raw.match(/:/g) || []).length > 2) return;

  const formatted = formatTimeInput(raw);
  return formatted;
}

export function useControlledTimeInput(completedTimeSecs: any, onCommit: any) {
  const [draft, setDraft] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  const displayValue = (draft ? draft : secsToTimeString(completedTimeSecs));

  const onChange = useCallback((e: any) => {
    const raw = e.target.value;
    if (!raw) { setDraft(""); setError(null); return; }
    if (/[^\d:.]/.test(raw)) return;
    if ((raw.match(/\./g) || []).length > 1) return;
    if ((raw.match(/:/g) || []).length > 2) return;
    const formatted = formatTimeInput(raw);
    setDraft(formatted);
    if (error) setError(validateTime(formatted));
  }, [error])

  const onBlur = useCallback(() => {
    const err = validateTime(displayValue);
    setError(err);
    if (!err) {
      const secs = timeStringToSecs(displayValue);
      if (secs !== null) {
        onCommit(secs); //pushes clean value up
        //setDraft(null);
      } 
    }
  }, [displayValue, onCommit]);

  return {
    value: displayValue,
    onChange,
    onBlur,
    error,
    isValid: !error && VALID_COMPLETE.test(displayValue)
  }
}

export function FormIntervalTimeInputCell({ interval, onUpdate }: any) {
  const { value, onChange, onBlur, error, isValid } = useControlledTimeInput(
    interval.completedTimeSecs,
    (newSecs: any) => onUpdate(interval, newSecs)
  )

  return (
    <>
      <input
      className="total-input small"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        inputMode="numeric"
        placeholder="M:SS"
      />
    </>
  )
}