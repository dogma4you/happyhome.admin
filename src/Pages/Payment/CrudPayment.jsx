import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Button from "../../Components/Button";
import Input from "../../Components/Input";
import api from "../../api/api";
import useModal from "../../store/useModal";

export default function CrudPayment() {
    const navigate = useNavigate();
    const { id } = useParams();
    let editMode = id ? true : false;
    const { setModalDetails, resetModalDetails } = useModal();
    const location = useLocation();
    const { item } = location.state || {};
  
    useEffect(() => {
      if (editMode) {
        setPaymentInfo(item);
      }
    }, [editMode]);
  const [paymentInfo, setPaymentInfo] = useState({
    recipient: "",
    bank_name: "",
    bank_address: "",
    routing_number: "",
    account_number: "",
    account_type: "",
    reference_number: "",
  });

  const [errors, setErrors] = useState({});


  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!paymentInfo.recipient) newErrors.recipient = "Recipient is required";
    if (!paymentInfo.bank_name) newErrors.bank_name = "Bank name is required";
    if (!paymentInfo.bank_address)
      newErrors.bank_address = "Bank address is required";
    if (!paymentInfo.routing_number)
      newErrors.routing_number = "Routing number is required";
    if (!paymentInfo.account_number)
      newErrors.account_number = "Account number is required";
    if (!paymentInfo.account_type)
      newErrors.account_type = "Account type is required";
    if (!paymentInfo.reference_number)
      newErrors.reference_number = "Reference number is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      if (editMode) {
        await api.put(`/admin/payment_info/${id}`, paymentInfo);
      } else {
        await api.post("/admin/payment_info", paymentInfo);
      }
      setModalDetails({
        isVisible: true,
        image: "success",
        onClose: () => {
          resetModalDetails();
          navigate(-1);
        },
      });
    } catch (err) {
      console.error(err);
      setModalDetails({
        isVisible: true,
        image: "error",
        onClose: () => resetModalDetails(),
      });
    }
  };

  return (
    <form
      className="w-full bg-white p-10 rounded-xl shadow-lg flex flex-col gap-6 border border-gray-200"
      onSubmit={handleSubmit}
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Payment Information
      </h2>

      <div className="w-full flex gap-3">
        <Input
          label="Recipient"
          type="text"
          name="recipient"
          value={paymentInfo.recipient}
          onChange={handleChange}
          error={errors.recipient}
          className="mb-2"
        />
        <Input
          label="Bank Name"
          type="text"
          name="bank_name"
          value={paymentInfo.bank_name}
          onChange={handleChange}
          error={errors.bank_name}
          className="mb-2"
        />
        <Input
          label="Bank Address"
          type="text"
          name="bank_address"
          value={paymentInfo.bank_address}
          onChange={handleChange}
          className="mb-2"
        />
        <Input
          label="Routing Number"
          type="text"
          name="routing_number"
          value={paymentInfo.routing_number}
          onChange={handleChange}
          error={errors.routing_number}
          className="mb-2"
        />
      </div>

      <div className="w-full flex gap-3">
        <Input
          label="Account Number"
          type="text"
          name="account_number"
          value={paymentInfo.account_number}
          onChange={handleChange}
          error={errors.account_number}
          className="mb-2"
        />
        <Input
          label="Account Type"
          type="text"
          name="account_type"
          value={paymentInfo.account_type}
          onChange={handleChange}
          error={errors.account_type}
          className="mb-2"
        />
        <Input
          label="Reference Number"
          type="text"
          name="reference_number"
          value={paymentInfo.reference_number}
          onChange={handleChange}
          className="mb-2"
        />
      </div>

     <div className="w-full flex justify-end items-center"> 
     <Button
        color="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
        text={editMode ? "Update Payment Info" : "Add Payment Info"}
      />
     </div>
    </form>
  );
}
