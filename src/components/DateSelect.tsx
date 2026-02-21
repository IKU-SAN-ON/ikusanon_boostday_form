'use client';
import { useState, useMemo } from "react";

import { DayPicker } from "react-day-picker";
import { zhTW } from "react-day-picker/locale";

const DatePickerComponent = () => {
  const [selectedDates, setSelectedDates] = useState<Date[] | undefined>([]);
  const today = useMemo(() => new Date(), []); // Get today's date once and memoize it
  const nextMonthLastDay = useMemo(() => {
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    return new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0); // Last day of next month
  }, [today]);

  return (
    <DayPicker
      mode="multiple"
      selected={selectedDates}
      onSelect={setSelectedDates}
      locale={zhTW}
      disabled={{
        before: today,
        after: nextMonthLastDay
      }} />
  );
}

export default DatePickerComponent;