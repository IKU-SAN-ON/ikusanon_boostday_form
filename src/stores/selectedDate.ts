import { create } from "zustand";

interface SelectedDateState {
  selectedDates: Date[] | undefined;
  setSelectedDates: (dates: Date[] | undefined) => void;
}

export const useSelectedDates = create<SelectedDateState>((set) => ({
  selectedDates: undefined,
  setSelectedDates: (dates) => set({ selectedDates: dates }),
}));