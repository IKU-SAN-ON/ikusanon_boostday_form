'use client';
import { useMemo, useEffect } from "react";
import { useSelectedDates } from "@/stores/selectedDate";

import { DayPicker } from "react-day-picker";
import { zhTW } from "react-day-picker/locale";

import { cn } from "@/lib/utils";

interface DateSelectionProps {
  className?: string;
  initialSelectedDates?: Date[];
}

const DatePickerComponent = ({ className, initialSelectedDates }: DateSelectionProps) => {
  const selectedDates = useSelectedDates(state => state.selectedDates);
  const setSelectedDates = useSelectedDates(state => state.setSelectedDates);

  const today = useMemo(() => new Date(), []); // Get today's date once and memoize it
  const { tomorrow, twoMonthFirstDay } = useMemo(() => {
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const nextMonthFirstDay = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    return {tomorrow, twoMonthFirstDay: new Date(nextMonthFirstDay.getFullYear(), nextMonthFirstDay.getMonth() + 1, 1)}
  }, [today]);

  useEffect(() => {
    if (initialSelectedDates) {
      setSelectedDates(initialSelectedDates);
    }
  }, [initialSelectedDates, setSelectedDates]);

  return (
    <DayPicker
      className={cn("react-day-picker", className)}
      mode="multiple"
      timeZone="UTC"
      selected={selectedDates}
      onSelect={setSelectedDates}
      locale={zhTW}
      disabled={{
        before: tomorrow,
        after: twoMonthFirstDay,
      }} />
  );
}

export default DatePickerComponent;