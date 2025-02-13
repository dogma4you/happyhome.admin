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
import Input from "../../Components/Input";
import Button from "../../Components/Button";
import { GiPriceTag } from "react-icons/gi";
import { BsPerson } from "react-icons/bs";
import constants from "../../utils/constant.json";
import useModal from "../../store/useModal";
import { FaExternalLinkAlt } from "react-icons/fa";
import { FaCopy } from "react-icons/fa";

function OfferDetails() {
  const { id } = useParams();
  const [details, setDetails] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { setModalDetails, resetModalDetails } = useModal();
  const [copied, setCopied] = useState(false);
  let token = JSON.parse(localStorage.getItem("auth-storage")).state.user.token;

  const [range, setRange] = useState({
    id: Number(id),
    from: "",
    to: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const digitsOnly = value.replace(/\D/g, "");
    setRange((prevRange) => ({
      ...prevRange,
      [name]: digitsOnly ? parseInt(digitsOnly, 10) : "",
    }));
  };

  const [convertedImages, setConvertedImages] = useState([]);
  const [convertedFiles, setConvertedFiles] = useState([]);

  useEffect(() => {
    getOffer();
  }, [id, token]);

  const getOffer = () => {
    api
      .get(`/admin/offer/${id}`)
      .then((res) => {
        setDetails(res.data.data);

        if (
          res.data.data.estimated_higher_price !== null &&
          res.data.data.estimated_lower_price !== null
        ) {
          setRange({
            id: Number(id),
            from: res.data.data.estimated_lower_price,
            to: res.data.data.estimated_higher_price,
          });
        }

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
      constantObject = constants.propertyStatus;
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
    const handleConditionChange = (conditionKey, newValue) => {
      setDetails((prevDetails) => ({
        ...prevDetails,
        property_condition: {
          ...prevDetails.property_condition,
          [conditionKey]: newValue,
        },
      }));
    };

    const handleCopy = () => {
      if (details.uploadUrl) {
        navigator.clipboard.writeText(details.uploadUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    };

    const saveConditions = () => {
      console.log(details);
      api.put(`/admin/offer/${id}`, { property_condition: details.property_condition })
        .then((res) => {
          console.log(res);
          setModalDetails({
            title: "Success",
            message: "Conditions saved successfully.",
            type: "success",
          });
        })
        .catch((error) => {
          console.error(error); 
          setModalDetails({
            title: "Error",
            message: "Failed to save conditions.",
            type: "error",
          });
        });
    };
    

    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-8 space-y-8">
          <div className="flex items-center gap-12 mb-6">
            <h2 className="text-3xl font-medium text-indigo-800">
              Offer Details
            </h2>
            {details.uploadUrl && (
              <div className="flex items-center gap-2">
                <FaExternalLinkAlt className="h-6 w-6 text-indigo-800" />
                <div
                  className="flex items-center gap-2 group cursor-pointer"
                  onClick={handleCopy}
                >
                  <p className="text-gray-500 group-hover:text-indigo-800">
                    {details.uploadUrl && "Upload Later Link"}
                  </p>
                  <FaCopy className="h-6 w-6 text-gray-500 group-hover:text-indigo-800" />
                  {copied && (
                    <span className="text-green-600 text-sm">Copied!</span>
                  )}
                </div>
              </div>
            )}
          </div>
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
                      <div className="flex items-end justify-end gap-4 flex-col">
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
                                    onClick={() =>
                                      handleConditionChange(
                                        conditionKey,
                                        index + 1
                                      )
                                    }
                                    className={`w-6 h-6 rounded-full border cursor-pointer ${
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
                      <Button
                      color="bg-indigo-600"
                      text="Save Conditions"
                      onClick={() => saveConditions()}
                      className="px-6 py-2 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    />
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

          {details.status === 4 && (
            <div className="mt-12">
              {/* <h3 className="text-3xl font-medium text-indigo-800 mb-6">Make Offer</h3> */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="grid grid-cols-3 gap-4">
                  {(() => {
                    const keysToDisplay = ["estimated_date", "price"];

                    const filteredEntries = Object.entries(details).filter(
                      ([key, value]) => keysToDisplay.includes(key) && value
                    );
                    if (filteredEntries.length === 0) return null;

                    return filteredEntries
                      .sort(
                        ([keyA], [keyB]) =>
                          keysToDisplay.indexOf(keyA) -
                          keysToDisplay.indexOf(keyB)
                      )
                      .map(([key, value]) => (
                        <div
                          key={key}
                          className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 transform"
                        >
                          <div className="p-5">
                            <div className="flex items-center mb-3">
                              {getIcon(key)}
                              <h3 className="ml-3 text-lg font-semibold text-gray-800">
                                {key === "price"
                                  ? "Accepted Price"
                                  : formatLabel(key)}
                              </h3>
                            </div>
                            <div
                              className={`text-gray-600 ${
                                key === "price"
                                  ? "text-xl font-bold text-green-500"
                                  : ""
                              }`}
                            >
                              {formatValue(value, key)}
                            </div>
                          </div>
                        </div>
                      ));
                  })()}
                </div>

                <div className="flex items-center gap-4 mb-6 mt-6">
                  <Input
                    type="text"
                    placeholder="From"
                    name="from"
                    value={range.from}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <span className="text-2xl font-bold text-gray-400">-</span>
                  <Input
                    type="text"
                    placeholder="To"
                    name="to"
                    value={range.to}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  {!details.price && (
                    <Button
                      color="bg-indigo-600"
                      text="Activate Offer"
                      onClick={() => makeOffer("sendRange")}
                      className="px-6 py-2 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    />
                  )}
                </div>
                <div className="flex gap-4">
                  <Button
                    color="bg-red-500"
                    text="Reject Offer"
                    onClick={() => makeOffer("cancel")}
                    className="flex-1 px-6 py-3 text-white rounded-md hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  />
                  <Button
                    color="bg-green-500"
                    text="Approve Offer"
                    onClick={() => makeOffer("approve")}
                    className="flex-1 px-6 py-3 text-white rounded-md hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const makeOffer = (status) => {
    if (status === "cancel") {
      api
        .put(`/admin/offer/cancel/${id}`)
        .then(() => {
          setModalDetails({
            isVisible: true,
            image: "success",
            onClose: () => {
              resetModalDetails();
            },
          });
          getOffer();
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (status === "approve") {
      api
        .put(`/admin/offer/approve/${id}`)
        .then(() => {
          setModalDetails({
            isVisible: true,
            image: "success",
            onClose: () => {
              resetModalDetails();
            },
          });
          getOffer();
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (status === "sendRange") {
      api
        .post("/admin/offer/send_range", range)
        .then(() => {
          setModalDetails({
            isVisible: true,
            image: "success",
            onClose: () => {
              resetModalDetails();
            },
          });
          getOffer();
        })
        .catch((err) => {
          console.log(err);
        });
    }
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
  return (
    <div>
      {renderDetails()}
      {renderImageModal()}
    </div>
  );
}

export default OfferDetails;
