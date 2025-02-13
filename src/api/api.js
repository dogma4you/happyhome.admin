import axios from "axios";
import useAuthStore from "../store/useAuthStore";
import useLoading from "../store/useLoading";
import useModal from "../store/useModal";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
  async (config) => {
    useLoading.getState().setIsLoading(true);

    const isTokenValid = useAuthStore.getState().checkTokenValidity();
    if (!isTokenValid) {
      useLoading.getState().setIsLoading(false);
      return Promise.reject(new Error('Token is invalid'));
    }
    
    const user = useAuthStore.getState().user;
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {    
    useLoading.getState().setIsLoading(false);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    useLoading.getState().setIsLoading(false);
    return response;
  },
  (error) => {
    const resetModalDetails = useModal.getState().resetModalDetails;

    useModal.getState().setModalDetails({
      isVisible: true,
      image: "fail",
      onClose: () => resetModalDetails(), 
    });
    useLoading.getState().setIsLoading(false);
    if (error.response && error.response.status === 401) {
      const logout = useAuthStore.getState().logout;
      logout();
    }
    return Promise.reject(error);
  }
);

export default api;