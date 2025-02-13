import { useCallback, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/api";
import useTable from "../store/useTable";
import ReactPaginate from "react-paginate";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

export default function Subscriptions() {
  const location = useLocation();
  const navigate = useNavigate();
  const { tableParams, setTotalPages, setTableParams, totalPages } = useTable();
  const [menuData, setMenuData] = useState([]);

  const fetchData = useCallback(() => {
    const currentPath = location.pathname;
    const apiUrl = "admin" + currentPath;

    console.log("🚀 ~ fetchData ~ apiUrl:", apiUrl);
    console.log("🚀 ~ fetchData ~ currentPath:", currentPath);

    if (apiUrl) {
      api
        .get(apiUrl, {
          params: tableParams,
        })
        .then((res) => {
          setMenuData(res.data.data.data);

          const totalItems = res.data.data.totalCount;
          const totalPages = Math.max(
            1,
            Math.ceil(totalItems / tableParams.limit)
          );
          setTotalPages(totalPages);
        })
        .catch(() => {
          setMenuData([]);
          setTotalPages(1);
        });
    }
  }, [location.pathname, tableParams, setTotalPages]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLimitChange = (e) => {
    setTableParams({ limit: parseInt(e.target.value), page: 1 });
  };

  const handlePageChange = ({ selected }) => {
    setTableParams({ page: selected + 1 });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  console.log("menuData", menuData);
  return (
    <div className="w-full flex flex-col gap-4">
      {menuData.length > 0 ? (
        <div className="flex gap-3 items-center">
          <p>Show</p>
          <select
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-20 p-2.5"
            value={tableParams.limit}
            onChange={handleLimitChange}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <p>entries</p>
        </div>
      ) : (
        <p>No data</p>
      )}
      <div className="w-full flex justify-start items-center max-w-[30rem] gap-4 relative">
        <div
          className={`flex-1 text-center cursor-pointer py-2 transition-all duration-200 ${
            location.pathname === "/subscriptions/book"
              ? "font-bold text-blue-600"
              : "text-gray-600"
          } hover:text-blue-600`}
          onClick={() => navigate("/subscriptions/book")}
        >
          Subscription for Guide Book
        </div>
        <div
          className={`flex-1 text-center cursor-pointer py-2 transition-all duration-200 ${
            location.pathname === "/subscriptions/info"
              ? "font-bold text-teal-600"
              : "text-gray-600"
          } hover:text-teal-600`}
          onClick={() => navigate("/subscriptions/info")}
        >
          HHI Subscription
        </div>
        <div
          className={`absolute bottom-0 h-1 transition-all duration-200 ${
            location.pathname === "/subscriptions/book"
              ? "w-1/2 bg-blue-600 left-0"
              : "w-1/2 bg-teal-600 left-1/2"
          }`}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuData.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-300 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <p className="text-gray-700 font-semibold text-lg mb-2">
                Email: <span className="font-normal">{item.email}</span>
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Created At:</span>{" "}
                {new Date(item.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      <ReactPaginate
        pageCount={totalPages}
        pageRangeDisplayed={3}
        marginPagesDisplayed={1}
        onPageChange={handlePageChange}
        forcePage={tableParams.page - 1}
        containerClassName="flex justify-end items-center mt-4"
        pageClassName="mx-2 cursor-pointer"
        pageLinkClassName="py-2 px-3 text-gray-700"
        activeClassName="border flex justify-center items-center w-10 h-10 rounded-border-10 border-green-color text-white"
        previousLabel={
          <div
            className={`flex gap-2 justify-center items-center ${
              tableParams.page === 1
                ? "opacity-50 text-gray-300 cursor-not-allowed"
                : "cursor-pointer text-green-color"
            }`}
            disabled={tableParams.page === 1}
          >
            <ChevronLeftIcon className="text-xs" />
            Prev
          </div>
        }
        nextLabel={
          <div
            className={`flex gap-2 justify-center items-center cursor-pointer ${
              tableParams.page === totalPages
                ? "opacity-50 text-gray-300 cursor-not-allowed"
                : "text-green-color"
            }`}
            disabled={tableParams.page === totalPages}
          >
            Next
            <ChevronLeftIcon className="rotate-180 text-xs" />
          </div>
        }
        breakLabel={<div className="mx-2">...</div>}
      />
    </div>
  );
}
