import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import Button from "./Button";

export default function ProofsModal({ isOpen, onClose, onSubmit }) {
  const [dateTimeValue, setDateTimeValue] = useState(null);
  const [expireDate, setExpireDate] = useState(null);

  useEffect(() => {
    if (isOpen) {
      // Set the dateTimeValue to 30 days from the current date when the modal opens
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 30);
      setDateTimeValue(defaultDate);
    }
  }, [isOpen]); // Re-run when modal is opened or closed

  useEffect(() => {
    if (dateTimeValue) {
      // Calculate expiration date as 30 days after the selected date
      const expiration = new Date(dateTimeValue.getTime() + 30 * 24 * 60 * 60 * 1000);
      setExpireDate(expiration.toISOString().substring(0, 16));
    }
  }, [dateTimeValue]);

  const handleDateChange = (date) => {
    setDateTimeValue(date);
  };

  const handleSubmit = () => {
    onSubmit({ dateTimeValue, expireDate });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-bold mb-4">Submit Proof of Funds</h2>

        <label
          htmlFor="expireDate"
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          Expire Date and Time
        </label>
        <DatePicker
          placeholderText="Select Expire Date"
          selected={dateTimeValue}
          onChange={handleDateChange}
          minDate={new Date()}
          showTimeSelect
          dateFormat="Pp"
          className="border border-gray-300 p-3 rounded-lg w-full"
        />

        <div className="flex gap-4 justify-between mt-4">
          <Button color="bg-red-500" text="Cancel" onClick={onClose} />

          <Button color="bg-green-500" text="Submit" onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
}

ProofsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
