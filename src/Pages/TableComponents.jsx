import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useTable from "../store/useTable";
import api from "../api/api";
import Table from "../Components/Table";

export default function TableComponents() {
  const location = useLocation();
  const { tableParams, setTotalPages } = useTable();
  const [menuData, setMenuData] = useState([]);
  const setTableParams = useTable((state) => state.setTableParams);
  const [isSortableData, setIsSortableData] = useState([]);

  const fetchData = useCallback(() => {
    const pathToApiMap = {
      "/": "/admin/dashboard",
      "/customers": "/admin/users",
      "/contracts/listed": "/admin/contracts",
      "/contracts/purchased": "/admin/contracts/purchased",
      "/employees": "/admin/employee",
    };

    const currentPath = location.pathname;

    // Disable fetching for dashboard and mailing
    if (currentPath === "/") {
      setMenuData([]);
      setTotalPages(1);
      return;
    }

    const apiUrl = pathToApiMap[currentPath] || `/admin${currentPath}`;

    api
      .get(apiUrl, {
        params: tableParams,
      })
      .then((res) => {
        if (currentPath === "/offers") {
          const transformedData = res.data.data.map((item) => {
            const keys = [
              "id",
              "user",
              "status",
              "sellerType",
              "address",
              "propertyType",
              "builtYear",
              "created_at",
            ];
            return keys.reduce((obj, key) => {
              if (item[key] !== undefined) {
                obj[key] = item[key];
              }
              return obj;
            }, {});
          });

          setMenuData(transformedData);
          const totalItems = res.data.totalCount;
          const totalPages = Math.max(
            1,
            Math.ceil(totalItems / tableParams.limit)
          );
          setTotalPages(totalPages);
        } else if (currentPath === "/contracts/listed") {
          const transformedData = res.data.data.data.map((item) => {
            const keys = [
              "id",
              "status",
              "sellerType",
              "address",
              "propertyType",
              "builtYear",
              "created_at",
              "expired_at",
            ];
            return keys.reduce((obj, key) => {
              if (item[key] !== undefined) {
                obj[key] = item[key];
              }
              return obj;
            }, {});
          });

          setMenuData(transformedData);
          const totalItems = res.data.data.totalCount;
          const totalPages = Math.max(
            1,
            Math.ceil(totalItems / tableParams.limit)
          );
          setTotalPages(totalPages);
        } else if (currentPath === "/contracts/purchased") {
          const convertedData = res.data.data.data.map((item) => ({
            id: item.id,
            user: item.user.first_name + " " + item.user.last_name,
            address: item.contract.address,
            propertyType: item.contract.propertyType,
            builtYear: item.contract.builtYear,
            created_at: item.created_at,
          }));

          const transformedData = convertedData.map((item) => {
            const keys = [
              "id",
              "user",
              "address",
              "propertyType",
              "builtYear",
              "created_at",
            ];
            return keys.reduce((obj, key) => {
              if (item[key] !== undefined) {
                obj[key] = item[key];
              }
              return obj;
            }, {});
          });

          setMenuData(transformedData);
          const totalItems = res.data.data.totalCount;
          const totalPages = Math.max(
            1,
            Math.ceil(totalItems / tableParams.limit)
          );
          setTotalPages(totalPages);
        } else if (currentPath === "/customers") {
          const transformedData = res.data.data.map((item) => {
            const keys = [
              "id",
              "first_name",
              "last_name",
              "email",
              "phone",
              "proof_of_founds",
              "credit actions",
              "deleted_by_reason",
              "balance",
              "credits",
              "created_at",
              "activity",
              "balances",
            ];
            return keys.reduce((obj, key) => {
              if (item[key] !== undefined) {
                obj[key] = item[key];
              }
              return obj;
            }, {});
          });

          setMenuData(transformedData);

          const totalItems = res.data.totalCount;
          const totalPages = Math.max(
            1,
            Math.ceil(totalItems / tableParams.limit)
          );
          setTotalPages(totalPages);
          setIsSortableData(["last_name", "first_name", "id", "created_at"]);
        } else if (currentPath === "/transactions") {
          setMenuData(res.data.data.data);

          const totalItems = res.data.data.totalCount;
          const totalPages = Math.max(
            1,
            Math.ceil(totalItems / tableParams.limit)
          );
          setTotalPages(totalPages);
        } else {
          setMenuData(res.data.data);

          const totalItems = res.data.totalCount;
          const totalPages = Math.max(
            1,
            Math.ceil(totalItems / tableParams.limit)
          );
          setTotalPages(totalPages);
        }
      })
      .catch(() => {
        setMenuData([]);
        setTotalPages(1);
      });
  }, [tableParams, location.pathname, setTotalPages]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setTableParams({
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
    });
    setTotalPages(1);
  }, [location.pathname, setTableParams]);

  return (
    <div className="w-full">
      <Table dashboard={menuData} onDataChange={fetchData} isSortable={isSortableData} />
    </div>
  );
}
