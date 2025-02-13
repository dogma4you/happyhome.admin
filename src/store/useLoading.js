import { create } from "zustand";

const useLoading = create((set) => ({
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
}));

export default useLoading;
