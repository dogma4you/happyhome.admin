import { create } from "zustand";

const useSettingsStore = create((set) => ({
  settings: { paymentFee: 0, contractFee: 0, singleCreditPrice: 0 },
  setSettings: (newSettings) => set({ settings: newSettings }),
}));
export default useSettingsStore;
