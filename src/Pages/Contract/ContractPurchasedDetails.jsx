import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/api";
import {
  FaUser,
  FaSquare,
  FaWarehouse,
  FaUsers,
  FaHome,
  FaCalendarCheck,
  FaIdCard,
} from "react-icons/fa";
import { FaRegAddressCard } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { GrStatusCriticalSmall } from "react-icons/gr";
import {
  MdSell,
  MdDescription,
  MdBedroomParent,
  MdBathroom,
  MdOutlineHeatPump,
  MdPlumbing,
  MdElectricBolt,
  MdOutlineBallot,
  MdOutlineGppGood,
  MdOutlinePriceChange,
  MdDataUsage,
} from "react-icons/md";
import { TbAirConditioning } from "react-icons/tb";
import { IoIosWater } from "react-icons/io";
import NoImage from "../../Images/No_Image_Available.jpg";
import { GiPriceTag } from "react-icons/gi";
import { BsPerson } from "react-icons/bs";
import constants from "../../utils/constant.json";
import { IoDocumentOutline } from "react-icons/io5";
import Input from "../../Components/Input";

function ContractPurchasedDetails() {
  const { id } = useParams();
  const [details, setDetails] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  let token = JSON.parse(localStorage.getItem("auth-storage")).state.user.token;

  const [convertedImages, setConvertedImages] = useState([]);
  const [convertedFiles, setConvertedFiles] = useState([]);

  useEffect(() => {
    getOffer();
  }, [id, token]);

  const getOffer = () => {
    api
      .get(`/admin/contract/${id}`)
      .then((res) => {
        setDetails(res.data.data);
        if (res.data.data.images) {
          const imagePromises = res.data.data.images.map((imageId) =>
            api.get(`files/${imageId}?token=${token}`, {
              responseType: "arraybuffer",
            })
          );

          Promise.all(imagePromises)
            .then((imageResponses) => {
              const fetchedImages = imageResponses.map((imageRes) => {
                const base64String = btoa(
                  new Uint8Array(imageRes.data).reduce(
                    (data, byte) => data + String.fromCharCode(byte),
                    ""
                  )
                );
                return `data:image/jpeg;base64,${base64String}`;
              });
              setConvertedImages(fetchedImages);
            })
            .catch((error) => {
              console.log(error);
            });
        }

        if (res.data.data.files) {
          const filePromises = res.data.data.files.map((fileId) =>
            api.get(`files/${fileId}?token=${token}`, {
              responseType: "arraybuffer",
            })
          );

          Promise.all(filePromises)
            .then((fileResponses) => {
              const fetchedFiles = fileResponses.map((fileRes) => {
                const fileType = fileRes.headers["content-type"];
                const blob = new Blob([fileRes.data], { type: fileType });
                const url = URL.createObjectURL(blob);
                return {
                  type: fileType,
                  url: url,
                };
              });
              setConvertedFiles(fetchedFiles);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const formatLabel = (key) => {
    if (key === "id") {
      return "ID";
    }
    const words = key.split(/(?=[A-Z])|_/);
    return words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
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
      constantObject = constants.contractStatus;
    } else if (type === "DESCRIPTION_TYPE") {
      constantObject = constants.propertyDescriptionTypes;
    }
    return Object.keys(constantObject).find(
      (key) => constantObject[key] === value
    );
  };

  const formatValue = (value, key) => {
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      if (
        Object.prototype.hasOwnProperty.call(value, "formatted_address") &&
        value.formatted_address !== null &&
        value.formatted_address !== undefined
      ) {
        return <p key="formatted_address">{value.formatted_address}</p>;
      }

      if (
        Object.prototype.hasOwnProperty.call(value, "first_name") &&
        Object.prototype.hasOwnProperty.call(value, "last_name") &&
        value.first_name !== null &&
        value.last_name !== null
      ) {
        return (
          <p key="name">
            {value.first_name} {value.last_name}
          </p>
        );
      }

      return Object.entries(value)
        .map(([nestedKey, nestedValue], index) => {
          if (nestedValue !== null && nestedValue !== undefined) {
            return (
              <p key={index}>
                {formatLabel(nestedKey)}: {nestedValue.toString()}
              </p>
            );
          }
          return null;
        })
        .filter(Boolean);
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
    } else if (key === "status") {
      return getTypeKey("STATUS", value) || value;
    } else if (
      key === "created_at" ||
      key === "updated_at" ||
      key === "builtYear" ||
      key === "estimated_date"
    ) {
      if (key === "builtYear") {
        return value?.substring(0, 4);
      } else {
        const dateObject = new Date(value);

        const options = { year: "numeric", month: "long", day: "2-digit" };
        const formattedDate = dateObject.toLocaleDateString("en-US", options);

        return formattedDate;
      }
    } else if (key === "lotSize") {
      return value !== null && value !== undefined ? `${value} sqft` : "";
    } else if (key === "descriptionType") {
      return getTypeKey("DESCRIPTION_TYPE", value) || value;
    } else {
      return value !== null && value !== undefined ? value.toString() : "";
    }
  };

  const getIcon = (key) => {
    switch (key) {
      case "id":
        return <FaIdCard className="h-6 w-6 text-gray-500" />;
      case "user":
        return <FaUser className="h-6 w-6 text-gray-500" />;
      case "status":
        return <GrStatusCriticalSmall className="h-6 w-6 text-gray-500" />;
      case "sellerType":
        return <MdSell className="h-6 w-6 text-gray-500" />;
      case "address":
        return <FaRegAddressCard className="h-6 w-6 text-gray-500" />;
      case "propertyType":
        return <FaHome className="h-6 w-6 text-gray-500" />;
      case "descriptionType":
        return <MdDescription className="h-6 w-6 text-gray-500" />;
      case "builtYear":
        return <FaCalendarCheck className="h-6 w-6 text-gray-500" />;
      case "squareFeet":
        return <FaSquare className="h-6 w-6 text-gray-500" />;
      case "bedrooms":
        return <MdBedroomParent className="h-6 w-6 text-gray-500" />;
      case "bathrooms":
        return <MdBathroom className="h-6 w-6 text-gray-500" />;
      case "heating":
        return <MdOutlineHeatPump className="h-6 w-6 text-gray-500" />;
      case "airConditioning":
        return <TbAirConditioning className="h-6 w-6 text-gray-500" />;
      case "waterSupply":
        return <IoIosWater className="h-6 w-6 text-gray-500" />;
      case "sewer":
        return <MdPlumbing className="h-6 w-6 text-gray-500" />;
      case "electricPanel":
        return <MdElectricBolt className="h-6 w-6 text-gray-500" />;
      case "exteriorType":
        return <FaWarehouse className="h-6 w-6 text-gray-500" />;
      case "lotSize":
        return <MdOutlineBallot className="h-6 w-6 text-gray-500" />;
      case "currentHOA":
        return <FaUsers className="h-6 w-6 text-gray-500" />;
      case "property_condition":
        return <MdOutlineGppGood className="h-6 w-6 text-gray-500" />;
      case "price":
        return <GiPriceTag className="h-6 w-6 text-gray-500" />;
      case "estimated_lower_price":
        return <MdOutlinePriceChange className="h-6 w-6 text-gray-500" />;
      case "estimated_higher_price":
        return <MdOutlinePriceChange className="h-6 w-6 text-gray-500" />;
      case "estimated_date":
        return <MdDataUsage className="h-6 w-6 text-gray-500" />;
      case "estimated_by":
        return <BsPerson className="h-6 w-6 text-gray-500" />;
      case "propertycondition":
        return <MdOutlineGppGood className="h-6 w-6 text-gray-500" />;
      default:
        return null;
    }
  };
  const openImageModal = (index) => {
    setSelectedImageIndex(index);
    setShowImageModal(true);
  };

  const closeImageModal = useCallback(() => {
    setShowImageModal(false);
  }, []);

  const navigateImage = useCallback(
    (direction) => {
      setSelectedImageIndex((prevIndex) => {
        if (direction === "next") {
          return (prevIndex + 1) % convertedImages?.length;
        } else {
          return (
            (prevIndex - 1 + convertedImages?.length) % convertedImages?.length
          );
        }
      });
    },
    [convertedImages?.length]
  );

useEffect(() => {
  const handleKeyDown = (event) => {
    if (!showImageModal) return;
    switch (event.key) {
      case "Escape":
        closeImageModal();
        break;
      case "ArrowLeft":
        navigateImage("prev");
        break;
      case "ArrowRight":
        navigateImage("next");
        break;
      default:
        break;
    }
  };
  window.addEventListener("keydown", handleKeyDown);
  return () => {
    window.removeEventListener("keydown", handleKeyDown);
  };
}, [showImageModal, closeImageModal, navigateImage]);


  const renderDetails = () => {
    if (!details) return null;

    const excludeFields = [
      "id",
      "created_at",
      "updated_at",
      "images",
      "files",
      "isSentUploadLink",
    ];

    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-8 space-y-8">
          <h2 className="text-3xl font-medium text-indigo-800 mb-6">
            Purchased Contract
          </h2>
          <div className="gap-5 grid grid-cols-3 items-start">
            {(() => {
              const keysToDisplay = [
                "id",
                "user",
                "status",
                "address",
                "builtYear",
                "currentHOA",
                "descriptionType",
                "electricPanel",
                "heating",
                "lotSize",
                "propertyType",
                "sellerType",
                "sewer",
                "waterSupply",
                "airConditioning",
              ];

              const sortedEntries = Object.entries(details)
                .filter(([key]) => keysToDisplay.includes(key))
                .sort(
                  ([keyA], [keyB]) =>
                    keysToDisplay.indexOf(keyA) - keysToDisplay.indexOf(keyB)
                );

              return sortedEntries.map(([key, value]) => (
                <div
                  key={key}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 transform"
                >
                  <div className="p-5">
                    <div className="flex items-center mb-3">
                      {getIcon(key)}
                      <h3 className="ml-3 text-lg font-semibold text-gray-800">
                        {formatLabel(key)}
                      </h3>
                    </div>
                    <div className="text-gray-600">
                      {formatValue(value, key)}
                    </div>
                  </div>
                </div>
              ));
            })()}
          </div>
          {(() => {
            const sortedEntries = Object.entries(details)
              .filter(
                ([key]) =>
                  !excludeFields.includes(key) && key === "property_condition"
              )
              .sort(([keyA], [keyB]) => {
                if (keyA === "property_condition") return 1;
                if (keyB === "property_condition") return -1;
                return 0;
              });

            return sortedEntries.map(([key, value]) => {
              if (key === "property_condition") {
                const conditionEntries = Object.entries(value).filter(
                  ([conditionKey]) => conditionKey.toLowerCase() !== "id"
                );

                return (
                  <div
                    key={key}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 transform"
                  >
                    <div className="p-5">
                      <div className="mb-5">
                        <div className="flex items-center mb-3">
                          {getIcon(key)}
                          <h3 className="ml-3 text-lg font-semibold text-gray-800">
                            {formatLabel(key)}
                          </h3>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-6">
                        {conditionEntries.map(
                          ([conditionKey, conditionValue]) => (
                            <div
                              key={conditionKey}
                              className="flex justify-between p-4 bg-gray-100 rounded-lg shadow-sm"
                            >
                              <h4 className="text-md font-semibold text-gray-800 w-1/4">
                                {formatLabel(conditionKey)}
                              </h4>
                              <div className="flex items-center space-x-1">
                                {[...Array(10)].map((_, index) => (
                                  <div
                                    key={index}
                                    className={`w-6 h-6 rounded-full border ${
                                      index < conditionValue
                                        ? conditionValue > 7
                                          ? "bg-green-500"
                                          : conditionValue > 4
                                          ? "bg-yellow-500"
                                          : "bg-red-500"
                                        : "bg-gray-300"
                                    }`}
                                  ></div>
                                ))}
                                <span className="ml-auto text-gray-600 w-1/4 text-right">
                                  {conditionValue}/10
                                </span>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                );
              }
            });
          })()}

          <div className="mt-12">
            <h3 className="text-3xl font-medium text-indigo-800 mb-6">
              Property Images
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              <div className="flex flex-col gap-4">
                {convertedImages && convertedImages?.length > 0 ? (
                  <>
                    {/* First image (full size) */}
                    <div
                      className="relative group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                      onClick={() => openImageModal(0)}
                    >
                      <img
                        src={convertedImages[0]}
                        alt="Main Property Image"
                        className="w-full h-96 object-cover transform group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="text-white text-lg font-semibold">
                          View
                        </span>
                      </div>
                    </div>

                    {/* Other images (smaller size) */}
                    <div className="grid grid-cols-4 gap-2">
                      {convertedImages.slice(1).map((image, index) => (
                        <div
                          key={index + 1}
                          className="relative group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                          onClick={() => openImageModal(index + 1)}
                        >
                          <img
                            src={image}
                            alt={`Property ${index + 2}`}
                            className="w-full h-24 object-cover transform group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">
                              View
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <img
                    src={NoImage}
                    alt="noImage"
                    className="w-72 h-72 object-contain rounded-lg shadow-md"
                  />
                )}
              </div>
            </div>
          </div>

          {convertedFiles.length > 0 && (
            <div className="mt-12">
              <h3 className="text-3xl font-medium text-indigo-800 mb-6">
                Files
              </h3>
              <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {convertedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50/80 rounded-lg shadow-md"
                  >
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      <p>
                        {file.type.includes("image") ? "Image" : "File"}{" "}
                        {index + 1}
                      </p>
                    </a>
                    <p className="text-sm text-gray-600">{file.type}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderImageModal = () => {
    if (!showImageModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="w-[800px] h-[800px] relative flex justify-center items-center p-6">
          <img
            src={convertedImages[selectedImageIndex]}
            alt={`Full size ${selectedImageIndex + 1}`}
            className="object-contain w-full h-full"
          />
          <button
            onClick={() => navigateImage("prev")}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-r"
          >
            <FaChevronLeft size={24} />
          </button>
          <button
            onClick={() => navigateImage("next")}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-l"
          >
            <FaChevronRight size={24} />
          </button>
          <button
            onClick={closeImageModal}
            className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  const renderFee = () => {

    const agreementNames = [
      { name: "Assignment Contract", key: "asignmentContract" },
      {
        name: "Real Estate Purchase Agreement",
        key: "realEstatePurchseAgreement",
      },
      { name: "Competitive Market Analysis", key: "competitiveMarketAnalisys" },
      { name: "Scope of Work", key: "scopeOfWork" },
    ];

    return (
      <div className="mt-6 shadow-md bg-white rounded-2xl p-6 flex flex-col gap-8">
        <div className="w-full flex gap-8">
          {/* Left input fields */}
          <div className="flex flex-wrap gap-4 w-1/2 bg-gradient-to-r from-gray-50 via-white to-gray-100 p-4 rounded-lg shadow-lg border border-gray-200">
            <Input
              label="Total sales price"
              value={details?.totalSalesPrice}
              type="text"
              placeholder="Total sales price"
              name="totalSalesPrice"
              disabled
              allowNumbers
            />
            <Input
              label="Contact Price"
              value={details?.price || ""}
              type="text"
              placeholder="Contact Price"
              name="price"
              allowNumbers
              disabled
            />
            <Input
              label="Est. Rent/Mo"
              value={details?.estRentMo || ""}
              type="text"
              placeholder="Est. Rent/Mo"
              name="estRentMo"
              allowNumbers
              disabled
            />
            <Input
              label="Est. Repair Costs"
              value={details?.estRepairCost || ""}
              type="text"
              placeholder="Est. Repair Costs"
              name="estRepairCost"
              allowNumbers
              disabled
            />
            <Input
              label="Est. ARV"
              value={details?.estAvr || ""}
              type="text"
              placeholder="Est. ARV"
              name="estAvr"
              allowNumbers
              disabled
            />
            <Input
              label="Est. Net Profit"
              value={details?.estNetProfit || ""}
              type="text"
              placeholder="Est. Net Profit"
              name="estNetProfit"
              allowNumbers
              disabled
            />
            <Input
              label="Assignment Fee"
              value={details?.asignmentFee || ""}
              type="text"
              placeholder="Assignment Fee"
              name="asignmentFee"
              allowNumbers
              disabled
            />
          </div>

          {/* Right input fields */}
          <div className="flex gap-4 w-1/2 bg-gradient-to-r from-white via-gray-50 to-gray-100 p-4 rounded-lg shadow-lg border border-gray-200">
            <div className="w-full flex flex-col gap-4">
              <Input
                label="Required Deposit"
                value={details?.buyersFee || ""}
                type="text"
                placeholder="Required Deposit"
                name="buyersFee"
                allowNumbers
                disabled
              />
              <Input
                label="Includes Earnest Money Dep. of"
                value={details?.earnestMoneyDep || ""}
                type="text"
                placeholder="Includes Earnest Money Dep. of"
                name="earnestMoneyDep"
                allowNumbers
                disabled
              />
              <Input
                label="Total Amount Due at Closing"
                value={details?.totalAmount || ""}
                type="text"
                placeholder="Total amount"
                name="totalAmount"
                allowNumbers
                disabled
              />
            </div>
          </div>
        </div>

        {/* Agreements Section */}
        <div className="w-full flex-col flex gap-4">
          <h2 className="text-xl font-semibold text-gray-800">Agreements</h2>

          <div className="flex gap-4">
            {agreementNames
              .filter((agreement) => details && details[agreement.key])
              .map((agreement, index) => {
                return (
                  <div
                    key={index}
                    className="relative flex gap-2 items-center justify-center border border-gray-300 rounded-lg p-4 shadow-md w-60 h-20 cursor-pointer group transition hover:shadow-lg hover:border-blue-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFileAction(e, agreement.key);
                    }}
                  >
                    {/* Hide icon and name on hover */}
                    <span className="text-gray-500 text-2xl group-hover:hidden">
                      <IoDocumentOutline />
                    </span>
                    <span className="text-gray-500 text-center group-hover:hidden">
                      {agreement.name}
                    </span>

                    <div className="hidden group-hover:block">
                      <IoDocumentOutline className="text-blue-500 text-4xl" />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    );
  };

  const handleFileAction = async (event, agreementKey) => {
    // If the file already exists, open it
    if (details && details[agreementKey]) {
      await openFile(details[agreementKey]);
      return; // Exit to prevent file upload
    } else {
      // Otherwise, handle file upload
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("files", file);

        try {
          const response = await api.post("admin/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          // Update details state with uploaded file info
          setDetails((prevDetails) => ({
            ...prevDetails,
            [agreementKey]: response.data.data,
          }));
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }
    }
  };

  const openFile = async (file) => {
    try {
      const response = await api.get(`files/${file}?token=${token}`, {
        responseType: "arraybuffer",
      });

      if (!response.data) {
        console.error("No data received from server.");
        return;
      }

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
      setTimeout(() => window.URL.revokeObjectURL(url), 10000);
    } catch (error) {
      console.error("Error opening file:", error);
    }
  };

  return (
    <div>
      {renderDetails()}
      {renderImageModal()}
      {renderFee()}
    </div>
  );
}

export default ContractPurchasedDetails;
