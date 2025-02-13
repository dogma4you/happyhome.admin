import { useEffect, useState } from "react";
import api from "../api/api";
import Input from "../Components/Input";
import useModal from "../store/useModal";

export default function Payment() {
  const [paymentData, setPaymentData] = useState({
    recipient: '',
    bank_name: '',
    bank_address: '',
    routing_number: '',
    account_number: '',
    account_type: '',
  });

  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const { setModalDetails, resetModalDetails } = useModal();
  const [editMode, setEditMode] = useState(true)

  useEffect(() => {
      fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get(`/admin/payment_info`);
      setErrors({});
      if(response.data.data.length == 0) {
          setEditMode(false);
      }else{
      setPaymentData(response.data.data[0]);
      }
    } catch (err) {
      setError("Failed to fetch settings");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const validationErrors = {};
    if (!paymentData.recipient) validationErrors.recipient = "Recipient is required";
    if (!paymentData.bank_name) validationErrors.bank_name = "Bank name is required";
    if (!paymentData.routing_number) validationErrors.routing_number = "Routing number is required";
    if (!paymentData.account_number) validationErrors.account_number = "Account number is required";
    if (!paymentData.account_type) validationErrors.account_type = "Account type is required";
    if (!paymentData.bank_address) validationErrors.bank_address = "Bank address is required";
    return validationErrors;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      if (editMode) {
        await api.put(`/admin/payment_info/1`, paymentData);
      } else {
        await api.post("/admin/payment_info", paymentData);
      }
      setModalDetails({
        isVisible: true,
        image: "success",
        onClose: () => {
          resetModalDetails();
          fetchSettings();
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
    <div>
      <h2 className="text-lg font-semibold mb-4">Payment Information</h2>

     <div className="flex flex-col gap-3">
     <div className="w-full flex gap-3">
        <Input
          label="Recipient"
          type="text"
          name="recipient"
          value={paymentData.recipient}
          onChange={handleChange}
          error={errors.recipient}
          className="mb-2"
        />
        <Input
          label="Bank Name"
          type="text"
          name="bank_name"
          value={paymentData.bank_name}
          onChange={handleChange}
          error={errors.bank_name}
          className="mb-2"
        />
      </div>
      <div className="w-full flex gap-3">

        <Input
          label="Bank Address"
          type="text"
          name="bank_address"
          value={paymentData.bank_address}
          error={errors.bank_address}
          onChange={handleChange}
          className="mb-2"
        />
        <Input
          label="Routing Number"
          type="text"
          name="routing_number"
          value={paymentData.routing_number}
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
          value={paymentData.account_number}
          onChange={handleChange}
          error={errors.account_number}
          className="mb-2"
        />
        <Input
          label="Account Type"
          type="text"
          name="account_type"
          value={paymentData.account_type}
          onChange={handleChange}
          error={errors.account_type}
          className="mb-2"
        />
      </div>
     </div>

      {error && <p className="text-red-500">{error}</p>}

      <button
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
        onClick={handleSave}
      >
        Save Payment
      </button>
    </div>
  );
}
