"use client";

import { DayPicker } from "@daypicker/react";
import { zhTW } from "@daypicker/react/locale";
import { useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useSelectedDates } from "@/stores/selectedDate";
import { getRangeOfValidDates } from "@/utils/verifyDate";

interface DateSelectionProps {
  className?: string;
  initialSelectedDates?: Date[];
}

const DatePickerComponent = ({
  className,
  initialSelectedDates,
}: DateSelectionProps) => {
  const selectedDates = useSelectedDates((state) => state.selectedDates);
  const setSelectedDates = useSelectedDates((state) => state.setSelectedDates);

  const today = useMemo(() => new Date(), []); // Get today's date once and memoize it
  const { tomorrow, twoMonthFirstDay } = useMemo(() => {
    const { start: tomorrow, end: twoMonthFirstDay } =
      getRangeOfValidDates(today);
    return { tomorrow, twoMonthFirstDay };
  }, [today]);

  useEffect(() => {
    if (initialSelectedDates) {
      setSelectedDates(initialSelectedDates);
    }
  }, [initialSelectedDates, setSelectedDates]);

  return (
    <div className="flex flex-col items-center gap-4">
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
        }}
      />
    </div>
  );
};

export default DatePickerComponent;
