import {
  ChevronLeftIcon,
  DocumentArrowDownIcon,
  EyeIcon,
  PencilIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { TrashIcon } from "@heroicons/react/16/solid";
import ReactPaginate from "react-paginate";
import useTable from "../store/useTable";
import { useLocation, useNavigate } from "react-router-dom";
import Input from "./Input";
import PropTypes from "prop-types";
import Button from "./Button";
import api from "../api/api";
import constants from "../utils/constant.json";
import useModal from "../store/useModal";
import { useState } from "react";
import RefillModal from "./RefillModal";
import ProofsModal from "./ProofsModal";
import RefundModal from "./RefundModal";
import { FaSort } from "react-icons/fa";

const Table = ({ dashboard, onDataChange, isSortable }) => {
  const { tableParams, setTableParams, totalPages } = useTable();
  const location = useLocation();
  const navigate = useNavigate();
  const { setModalDetails, resetModalDetails } = useModal();
  let notificationId = location.state?.notificationID;
  const [sortDirection, setSortDirection] = useState("asc");

  const handlePageChange = ({ selected }) => {
    setTableParams({ page: selected + 1 });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLimitChange = (e) => {
    setTableParams({ limit: parseInt(e.target.value), page: 1 });
  };

  const handleSearch = (e, field) => {
    setTableParams({ [field]: e.target.value, page: 1 });
  };

  const getTypeKey = (type, value) => {
    let constantObject = "";
    if (
      type === "SELLER_TYPES" ||
      type === "PROPERTY_TYPE" ||
      type === "HOME_TYPE" ||
      type === "HOA_TYPE"
    ) {
      constantObject = constants.propertyConstants[type];
    } else if (
      type === "HEATING" ||
      type === "AIR_CONDITIONING" ||
      type === "WATER_SUPPLY" ||
      type === "SEWER" ||
      type === "ELECTRIC_PANEL" ||
      type === "EXTERIOR_TYPE"
    ) {
      constantObject = constants.propertyOptions[type];
    } else if (type === "STATUS") {
      if (location.pathname === "/contracts/listed") {
        constantObject = constants.contractStatus;
      } else if (location.pathname === "/transactions") {
        constantObject = constants.transactionStatus;
      } else {
        constantObject = constants.propertyStatus;
      }
    } else if (type === "activity") {
      constantObject = constants.userActivityTypeEnum;
    } else if (type === "transactionTypes") {
      constantObject = constants.transactionTypes;
    }
    return Object.keys(constantObject).find(
      (key) => constantObject[key] === value
    );
  };

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return `${formattedDate} at ${formattedTime}`;
  };

  const renderCellContent = (key, value, item) => {
    if (key === "balances") return;
    if (typeof value === "object" && value !== null) {
      if (Array.isArray(value)) {
        return value.join(", ");
      } else if (key === "address") {
        return `${value.city}, ${value.street}`;
      } else if (key === "user" && location.pathname == "/offers") {
        return `${value.first_name} ${value.last_name}`;
      } else if (key === "plan") {
        if (value?.title && value?.price) {
          return `${value.title} - ${value.price}`;
        }
      } else if (key === "user" && location.pathname == "/transactions") {
        return `${value.id} | ${value.first_name} ${value.last_name} | ${value.email}`;
      } else {
        return JSON.stringify(value);
      }
    } else if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    } else if (
      key === "created_at" ||
      key === "updated_at" ||
      key === "builtYear"
    ) {
      if (key === "builtYear") {
        return value?.substring(0, 4);
      } else {
        const dateObject = new Date(value);

        const options = { year: "numeric", month: "long", day: "2-digit" };
        const formattedDate = dateObject.toLocaleDateString("en-US", options);

        return formattedDate;
      }
    } else if (key === "sellerType") {
      return getTypeKey("SELLER_TYPES", value) || value;
    } else if (key === "propertyType") {
      return getTypeKey("PROPERTY_TYPE", value) || value;
    } else if (key === "homeType") {
      return getTypeKey("HOME_TYPE", value) || value;
    } else if (key === "currentHOA") {
      return getTypeKey("HOA_TYPE", value) || value;
    } else if (key === "heating") {
      return getTypeKey("HEATING", value) || value;
    } else if (key === "airConditioning") {
      return getTypeKey("AIR_CONDITIONING", value) || value;
    } else if (key === "waterSupply") {
      return getTypeKey("WATER_SUPPLY", value) || value;
    } else if (key === "sewer") {
      return getTypeKey("SEWER", value) || value;
    } else if (key === "electricPanel") {
      return getTypeKey("ELECTRIC_PANEL", value) || value;
    } else if (key === "exteriorType") {
      return getTypeKey("EXTERIOR_TYPE", value) || value;
    } else if (key === "type") {
      return getTypeKey("transactionTypes", value) || value;
    } else if (key === "status") {
      if (location.pathname === "/transactions") {
        const transactionStatusOptions = Object.entries(
          constants.transactionStatus
        );

        if (item.status == 1) {
          return (
            <select
              name="transactionStatus"
              id="transactionStatus"
              value={value}
              className="cursor-pointer border p-2 rounded border-gray-300 bg-white"
              onChange={(e) => handleStatusChange(item, e.target.value)}
            >
              {transactionStatusOptions.map(([statusKey, statusValue]) => (
                <option key={statusValue} value={statusValue}>
                  {getTypeKey("STATUS", statusValue) || statusKey}
                </option>
              ))}
            </select>
          );
        } else {
          return getTypeKey("STATUS", value) || value;
        }
      }

      const fontWeightClass = "font-bold";
      let textColorClass = "";
      if (value === 1) {
        textColorClass = "text-green-500";
      } else if (value === 2) {
        textColorClass = "text-yellow-500";
      } else if (value === 3) {
        textColorClass = "text-red-500";
      } else if (value === 4) {
        textColorClass = "text-blue-500";
      }
      return (
        <div className={`${textColorClass} ${fontWeightClass}`}>
          {getTypeKey("STATUS", value) || value}
        </div>
      );
    } else if (key === "activity") {
      const textColorClass =
        value === 9 || value === 10 || value === 11 || value === 12
          ? "text-red-500"
          : "text-green-500";

      const fontWeightClass = "font-bold";

      if (location.pathname === "/customers") {
        const activityOptions = [1, 2, 3, 4, 5, 6, 8, 9, 10];

        return (
          <div className="flex items-center space-x-2">
            <select
              name="userActivity"
              id="userActivity"
              value={value}
              className="cursor-pointer border p-2 rounded border-gray-300 bg-white"
              onChange={(e) => handleActivityChange(item, e.target.value)}
            >
              {activityOptions.map((option) => (
                <option key={option} value={option}>
                  {getTypeKey("activity", option) || [option]}
                </option>
              ))}
            </select>
            {item?.deleted_by_reason && (
              <div className="relative group">
                <QuestionMarkCircleIcon className="h-6 w-6 text-gray-500" />
                <div className="absolute left-1/2 transform -translate-x-1/2 bottom-10 w-max p-2 hidden group-hover:block bg-white border border-red-500 text-red-500 text-sm rounded shadow-lg">
                  {item.deleted_by_reason}
                </div>
              </div>
            )}
          </div>
        );
      } else {
        return (
          <div className={`${textColorClass} ${fontWeightClass}`}>
            {getTypeKey("activity", value) || value}
          </div>
        );
      }
    } else {
      return value;
    }
  };

  const handleActivityChange = (item, selectedValue) => {
    api
      .put(`admin/users/${item.id}`, { status: selectedValue })
      .then(() => {
        setModalDetails({
          isVisible: true,
          image: "success",
          onClose: () => {
            resetModalDetails();
            onDataChange();
          },
        });
      })
      .catch((err) => {
        console.log("🚀 ~ handleActivityChange ~ err:", err);
      });
  };

  const handleStatusChange = (item, selectedValue) => {
    api
      .put(`admin/transactions/${item.id}`, { status: selectedValue })
      .then(() => {
        setModalDetails({
          isVisible: true,
          image: "success",
          onClose: () => {
            resetModalDetails();
            onDataChange();
          },
        });
      })
      .catch((err) => {
        console.log("🚀 ~ handleStatusChange ~ err:", err);
      });
  };

  const handleRowClick = (item) => {
    if (location.pathname === "/offers") {
      navigate(`/offer/${item.id}`);
    } else if (location.pathname === "/contracts/listed") {
      navigate(`/contract/${item.id}`);
    } else if (location.pathname === "/contracts/purchased") {
      navigate(`/contract-purchased/${item.id}`);
    }
  };

  let columns =
    dashboard.length > 0
      ? Object.keys(dashboard[0]).filter(
          (key) => key !== "actions" && key !== "balances"
        )
      : [];

  if (location.pathname === "/employees" || location.pathname === "/payment") {
    columns.push("actions");
  } else if (location.pathname === "/customers") {
    columns.push("Credit Actions");
    columns.push("Balance");
    columns.push("Credits");
    columns.push("_");
    columns = columns.filter((column) => column !== "deleted_by_reason");
  } else if (location.pathname === "/transactions") {
    columns = columns.filter((column) => column !== "updated_at");
    columns = columns.filter((column) => column !== "id");
  }

  const editItem = (item) => {
    if (location.pathname === "/employees") {
      navigate(`/employee/${item.id}/edit`, { state: { item } });
    } else {
      navigate(`/payment/${item.id}/edit`, { state: { item } });
    }
  };

  const deleteItem = (item) => {
    let apiUrl = "";
    if (location.pathname === "/employees") {
      apiUrl = `/admin/employee/${item.id}`;
    } else {
      apiUrl = `/admin/payment_info/${item.id}`;
    }

    setModalDetails({
      isVisible: true,
      image: "warning",
      button1Text: "Cancel",
      button2Text: "Delete",
      button1Color: "bg-gray-500",
      button2Color: "bg-red-500",
      button1OnClick: () => resetModalDetails(),
      button2OnClick: () => {
        api
          .delete(apiUrl)
          .then(() => {
            console.log("Item deleted");
            console.log(typeof onDataChange);

            onDataChange();
          })
          .catch((err) => console.log(err))
          .finally(() => resetModalDetails());
      },
      onClose: () => resetModalDetails(),
    });
  };

  const searchFieldsForOffers = [
    { name: "status", placeholder: "Status" },
    { name: "sellerType", placeholder: "Seller type" },
    { name: "propertyType", placeholder: "Property type" },
    { name: "descriptionType", placeholder: "Description type" },
    { name: "lotSizeMin", placeholder: "Lot size min" },
    { name: "lotSizeMax", placeholder: "Lot size max" },
  ];

  const renderTopSectionTable = () => {
    if (location.pathname === "/offersaaa") {
      return (
        <div className="w-full flex gap-3 flex-wrap mt-2 bg-blue-gray-50 p-4 rounded shadow">
          {searchFieldsForOffers.map((field) => (
            <Input
              key={field.name}
              type="text"
              placeholder={field.placeholder}
              value={tableParams[field.name] || ""}
              onChange={(e) => handleSearch(e, field.name)}
            />
          ))}
        </div>
      );
    } else if (location.pathname === "/employees") {
      return (
        <div className="w-full flex justify-end items-center">
          <Button
            color="bg-green-500"
            text="Add Employee"
            onClick={() => navigate("/employee/add")}
          />
        </div>
      );
    } else if (location.pathname === "/payment") {
      return (
        <div className="w-full flex justify-end items-center">
          <Button
            color="bg-green-500"
            text="Add Payment"
            onClick={() => navigate("/payment/add")}
          />
        </div>
      );
    } else if (location.pathname.includes("/contracts")) {
      return (
        <div className="w-full flex justify-start items-center max-w-[23rem] gap-4 relative">
          <div
            className={`flex-1 text-center cursor-pointer py-2 transition-all duration-200 
      ${
        location.pathname === "/contracts/listed"
          ? "font-bold text-blue-600"
          : "text-gray-600"
      }
      hover:text-blue-600`}
            onClick={() => navigate("/contracts/listed")}
          >
            List of Contracts
          </div>
          <div
            className={`flex-1 text-center cursor-pointer py-2 transition-all duration-200 
      ${
        location.pathname === "/contracts/purchased"
          ? "font-bold text-teal-600"
          : "text-gray-600"
      }
      hover:text-teal-600`}
            onClick={() => navigate("/contracts/purchased")}
          >
            Purchased Contracts
          </div>
          <div
            className={`absolute bottom-0 h-1 transition-all duration-200 
      ${
        location.pathname === "/contracts/listed"
          ? "w-1/2 bg-blue-600 left-0"
          : "w-1/2 bg-teal-600 left-1/2"
      }`}
          />
        </div>
      );
    }
    return null;
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState({});
  const [maxRefundCredit, setMaxRefundCredit] = useState(null);
  const fillBalance = (type, item) => {
    if (type === "refill") {
      setSelectedCustomer(item);
      setIsModalOpen(true);
    } else if (type === "refund") {
      setMaxRefundCredit(item.balances?.credits);
      setSelectedCustomer(item);
      setIsRefundModalOpen(true);
    }
  };
  const handleClose = () => {
    setIsModalOpen(false);
    setIsRefundModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleSubmit = (inputValue) => {
    api
      .put(`admin/user/credit/${selectedCustomer.id}`, { credits: inputValue })
      .then(() => {
        setModalDetails({
          isVisible: true,
          image: "success",
          onClose: () => {
            resetModalDetails();
            onDataChange();
          },
        });
      })
      .catch((err) => {
        console.log("🚀 ~ handleSubmit ~ err:", err);
      });
  };

  const handleSubmitRefund = (inputValue) => {
    api
      .put(`admin/user/credit/refound/${selectedCustomer.id}`, {
        credits: inputValue,
      })
      .then(() => {
        setModalDetails({
          isVisible: true,
          image: "success",
          onClose: () => {
            resetModalDetails();
            onDataChange();
          },
        });
      })
      .catch((err) => {
        console.log("🚀 ~ handleSubmit ~ err:", err);
      });
  };

  const deleteCustomer = (item) => {
    setModalDetails({
      isVisible: true,
      image: "warning",
      button1Text: "Cancel",
      button2Text: "Delete",
      button1Color: "bg-gray-500",
      button2Color: "bg-red-500",
      button1OnClick: () => resetModalDetails(),
      button2OnClick: () => {
        api
          .put(`admin/users/${item.id}`, { status: 12 })
          .then(() => {
            onDataChange();
          })
          .catch((err) => console.log(err))
          .finally(() => resetModalDetails());
      },
      onClose: () => resetModalDetails(),
    });
  };

  let token = JSON.parse(localStorage.getItem("auth-storage")).state.user.token;

  const openProofOfFoundsFile = (item) => {
    api
      .get(`files/${item}?token=${token}`, { responseType: "arraybuffer" })
      .then((fileRes) => {
        const fileType = fileRes.headers["content-type"];
        const blob = new Blob([fileRes.data], { type: fileType });
        const fileURL = URL.createObjectURL(blob);
        window.open(fileURL, "_blank");
      })
      .catch((error) => {
        console.log("Error fetching the file:", error);
      });
  };

  const [isProofsModalOpen, setIsProofsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const approveProofOfFounds = (item) => {
    setSelectedItem(item);
    setIsProofsModalOpen(true);
  };

  const handleProofsClose = () => {
    setIsProofsModalOpen(false);
  };

  const handleProofsSubmit = (modalValues) => {
    const data = {
      files: selectedItem.proof_of_founds.files,
      status: 3,
      expire_at: modalValues.dateTimeValue,
    };

    api
      .put(`admin/user/proofs/${selectedItem.id}`, data)
      .then(() => {
        setModalDetails({
          isVisible: true,
          image: "success",
          onClose: () => {
            resetModalDetails();
            onDataChange();
          },
        });
      })
      .catch((err) => {
        console.log("🚀 ~ handleProofsSubmit ~ err:", err);
      });
  };

  const rejectProofOfFounds = (item) => {
    const data = {
      files: selectedItem.proof_of_founds.files,
      status: 2,
    };

    api
      .put(`admin/user/proofs/${item.id}`, data)
      .then(() => {
        setModalDetails({
          isVisible: true,
          image: "success",
          onClose: () => {
            resetModalDetails();
            onDataChange();
          },
        });
      })
      .catch((err) => {
        console.log("🚀 ~ handleProofsSubmit ~ err:", err);
      });
  };

  const handleSort = (key) => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    setTableParams({ sortKey: key, sortValue: sortDirection === "asc" ? "desc" : "asc" });
  };

  return (
    <>
      <div className="w-full flex flex-col gap-4">
        <div className="flex justify-between items-center">
          {dashboard.length > 0 ? (
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
          <div className="w-72">
            <div className="relative h-10 w-full min-w-[200px]">
              <Input
                type="text"
                placeholder="Search"
                value={tableParams.search || ""}
                onChange={(e) => handleSearch(e, "search")}
                className="peer h-full w-full rounded-[7px] !border !border-gray-300 border-t-transparent bg-transparent bg-white px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 shadow-lg shadow-blue-900/5 outline outline-0 ring-4 ring-transparent transition-all placeholder:text-gray-500 placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:!border-blue-700 focus:border-t-transparent focus:outline-0 focus:ring-gray-900/10 disabled:border-0 disabled:bg-blue-gray-50"
              />
            </div>
          </div>
        </div>
        {renderTopSectionTable()}
        {dashboard.length > 0 && (
          <div className="w-full overflow-x-auto bg-white shadow-md rounded-lg mt-4">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-200">
                <tr>
                  {(location.pathname === "/offers" ||
                    location.pathname.includes("/contracts")) && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider "></th>
                  )}
                  {columns.map((key) => (
                    <th
                      key={key}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider "
                    >
                      <div className="flex gap-2 items-center">
                        {key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())}
                          {location.pathname === "/customers" && isSortable.includes(key) && (
                            <button onClick={() => handleSort(key)} className="flex items-center cursor-pointer">
                              <FaSort className="w-4 h-4 ml-2 text-black" />
                            </button>
                        )}
                      </div>
                    </th>
                  ))}
                  {dashboard[0].actions && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">
                      Actions
                    </th>
                  )}
                  {location.pathname === "/customers" &&
                    columns.deleted_by_reason}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboard.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } ${
                      location.pathname === "/offers" ||
                      location.pathname.includes("/contracts")
                        ? "cursor-pointer hover:bg-gray-100"
                        : ""
                    } ${notificationId == item.id ? "bg-blue-100" : ""}`}
                    onClick={() => handleRowClick(item)}
                  >
                    {(location.pathname === "/offers" ||
                      location.pathname.includes("/contracts")) && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <EyeIcon
                          data-tooltip-id="tooltip"
                          data-tooltip-content="View details"
                          className="w-5 h-5 text-blue-600 hover:text-blue-800"
                        />
                      </td>
                    )}
                    {columns.map((key) => {
                      if (key === "actions") {
                        if (
                          location.pathname === "/employees" ||
                          location.pathname === "/payment"
                        ) {
                          return (
                            <td
                              key={key}
                              className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                            >
                              <div
                                className="flex space-x-2"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  onClick={() => editItem(item)}
                                  className="text-blue-600 hover:text-blue-800"
                                  data-tooltip-id="tooltip"
                                  data-tooltip-content="Edit"
                                >
                                  <PencilIcon className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => deleteItem(item)}
                                  className="text-blue-600 hover:text-blue-800"
                                  data-tooltip-id="tooltip"
                                  data-tooltip-content="Delete"
                                >
                                  <TrashIcon className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          );
                        }
                      }
                      if (key === "proof_of_founds") {
                        if (location.pathname === "/customers") {
                          return (
                            <td
                              key={key}
                              className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                            >
                              {item?.proof_of_founds?.files.length > 0 ? (
                                <div className="flex flex-col items-center justify-center bg-white p-2 border-2 rounded-md gap-2">
                                  <div className="flex items-center gap-2">
                                    {item?.proof_of_founds?.files?.map(
                                      (file, index) => (
                                        <DocumentArrowDownIcon
                                          onClick={() =>
                                            openProofOfFoundsFile(file)
                                          }
                                          key={index}
                                          className="w-10 h-10 text-blue-600 cursor-pointer hover:text-blue-800 transition duration-200"
                                        />
                                      )
                                    )}

                                    {item?.proof_of_founds?.status === 1 && (
                                      <div className="flex items-center gap-2">
                                        <Button
                                          color="bg-red-500 ml-2"
                                          text="Reject"
                                          onClick={() =>
                                            rejectProofOfFounds(item)
                                          }
                                        />
                                        <Button
                                          color="bg-green-500 ml-2"
                                          text="Approve"
                                          onClick={() =>
                                            approveProofOfFounds(item)
                                          }
                                        />
                                      </div>
                                    )}
                                  </div>

                                  {/* Expire at */}
                                  {item?.proof_of_founds?.expire_at && (
                                    <div className="mt-2 text-sm text-gray-600 italic">
                                      <p className="text-red-500 font-semibold">
                                        Expires at:{" "}
                                        {formatDate(
                                          item?.proof_of_founds?.expire_at
                                        )}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                "No files"
                              )}
                            </td>
                          );
                        }
                      }
                      if (key === "Credit Actions") {
                        if (location.pathname === "/customers") {
                          return (
                            <td
                              key={key}
                              className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                            >
                              <Button
                                color="bg-green-500 !max-w-24"
                                text="Refill Credit"
                                onClick={() => fillBalance("refill", item)}
                              />
                              {item.balances?.credits > 0 && (
                                <Button
                                  color="bg-green-500 !max-w-28 ml-2"
                                  text="Refund Credit"
                                  onClick={() => fillBalance("refund", item)}
                                />
                              )}
                            </td>
                          );
                        }
                      }
                      if (key === "Balance") {
                        if (location.pathname === "/customers") {
                          return (
                            <td
                              key={key}
                              className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                            >
                              <p>{item.balances?.balance}</p>
                            </td>
                          );
                        }
                      }
                      if (key === "Credits") {
                        if (location.pathname === "/customers") {
                          return (
                            <td
                              key={key}
                              className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                            >
                              <p>{item.balances?.credits}</p>
                            </td>
                          );
                        }
                      }
                      if (key === "_") {
                        if (location.pathname === "/customers") {
                          return (
                            <td
                              key={key}
                              className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                            >
                              <button
                                onClick={() => deleteCustomer(item)}
                                className="text-blue-600 hover:text-blue-800"
                                data-tooltip-id="tooltip"
                                data-tooltip-content="Delete"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </td>
                          );
                        }
                      } else {
                        return (
                          <td
                            key={key}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                          >
                            {renderCellContent(key, item[key], item)}
                          </td>
                        );
                      }
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
      <RefillModal
        isOpen={isModalOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
      <RefundModal
        maxCredit={maxRefundCredit}
        isOpen={isRefundModalOpen}
        onClose={handleClose}
        onSubmit={handleSubmitRefund}
      />
      <ProofsModal
        isOpen={isProofsModalOpen}
        onClose={handleProofsClose}
        onSubmit={handleProofsSubmit}
      />
    </>
  );
};

export default Table;

Table.propTypes = {
  dashboard: PropTypes.array.isRequired,
  onDataChange: PropTypes.func,
};
