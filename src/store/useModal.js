import { create } from "zustand";

const initialModalDetails = {
  isVisible: false,
  image: "",
  button1Text: "",
  button2Text: "",
  button1OnClick: () => {},
  button2OnClick: () => {},
  button1Color: "",
  button2Color: "",
  onClose: () => {},
};

const useModal = create((set) => ({
  modalDetails: initialModalDetails,

  setModalDetails: (details) =>
    set((state) => ({
      modalDetails: {
        ...state.modalDetails,
        ...details,
      },
    })),

  resetModalDetails: () =>
    set(() => ({
      modalDetails: initialModalDetails,
    })),
}));

export default useModal;
