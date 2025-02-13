import { create } from "zustand";
import api from "../api/api";

const useUserSelf = create((set, get) => ({
  user: null,
  fetchUser: async () => {
    const { user } = get();
    if (user) return;

    try {
      const response = await api.get("/user/self");
      set({ user: response.data.data });
    } catch (error) {
      console.log(error);
    }
  },

  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));

export default useUserSelf;
