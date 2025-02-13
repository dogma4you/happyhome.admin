import create from "zustand";

const useTable = create((set) => ({
  tableParams: {
    page: 1,
    limit: 10,
    search: null,
    bedroomsMin: null,
    bedroomsMax: null,
    status: null,
    sellerType: null,
    propertyType: null,
    descriptionType: null,
    builtYearMin: null,
    builtYearMax: null,
    squareFeetMin: null,
    squareFeetMax: null,
    bathroomsMin: null,
    bathroomsMax: null,
    lotSizeMin: null,
    lotSizeMax: null,
    sortKey: null,
    sortValue: null,
  },
  setTableParams: (params) =>
    set((state) => ({
      tableParams: { ...state.tableParams, ...params },
    })),
  totalPages: 1,
  setTotalPages: (pages) => set({ totalPages: pages }),
}));

export default useTable;
