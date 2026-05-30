import { create } from 'zustand';

interface BookingState {
  selectedOfficeId: string | null;
  selectedSeatId: string | null;
  startDate: string;
  endDate: string;
  setSelectedOfficeId: (id: string | null) => void;
  setSelectedSeatId: (id: string | null) => void;
  setDates: (start: string, end: string) => void;
  reset: () => void;
}

const getTodayString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

export const useBookingStore = create<BookingState>((set) => ({
  selectedOfficeId: null,
  selectedSeatId: null,
  startDate: getTodayString(),
  endDate: getTodayString(),

  setSelectedOfficeId: (id) => set({ selectedOfficeId: id, selectedSeatId: null }),
  setSelectedSeatId: (id) => set({ selectedSeatId: id }),
  setDates: (start, end) => set({ startDate: start, endDate: end }),
  reset: () => set({ selectedOfficeId: null, selectedSeatId: null, startDate: getTodayString(), endDate: getTodayString() }),
}));
