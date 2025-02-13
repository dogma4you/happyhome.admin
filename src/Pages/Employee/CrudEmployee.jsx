import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Button from "../../Components/Button";
import Input from "../../Components/Input";
import api from "../../api/api";
import useModal from "../../store/useModal";
import PhoneInput from "react-phone-number-input/input";

export default function CrudEmployee() {
  const navigate = useNavigate();
  const { id } = useParams();
  let editMode = id ? true : false;
  const { setModalDetails, resetModalDetails } = useModal();

  const location = useLocation();
  const { item } = location.state || {};

  useEffect(() => {
    if (editMode) {
      setCredentials(item);
    }
  }, [editMode]);

  const [credentials, setCredentials] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: name === "status" ? Number(value) : value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!credentials.first_name) newErrors.first_name = "First name is required";
    if (!credentials.last_name) newErrors.last_name = "Last name is required";
    if (!credentials.email) newErrors.email = "Email is required";
    if (!credentials.phone) newErrors.phone = "Phone number is required";
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
        await api.put(`/admin/employee/${id}`, credentials);
      } else {
        await api.post("/admin/employee", credentials);
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
      className="w-full flex justify-center items-center gap-4 flex-col max-w-sm bg-white p-8 rounded-lg shadow-md"
      onSubmit={handleSubmit}
    >
      <div className="w-full">
        <Input
          label="First Name"
          type="text"
          name="first_name"
          value={credentials.first_name}
          onChange={handleChange}
          error={errors.first_name}
        />
      </div>
      <div className="w-full">
        <Input
          label="Last Name"
          type="text"
          name="last_name"
          value={credentials.last_name}
          onChange={handleChange}
          error={errors.last_name}
        />
      </div>
      <div className="w-full">
        <Input
          label="Email"
          type="email"
          name="email"
          value={credentials.email}
          onChange={handleChange}
          error={errors.email}
        />
      </div>
      <div className="w-full max-w-80">
        <label className="text-gray-700 font-medium mb-1 text-sm block">
          Phone Number
        </label>
        <PhoneInput
          value={credentials.phone}
          onChange={(value) => {
            setCredentials((prev) => ({ ...prev, phone: value }));
            setErrors((prev) => ({ ...prev, phone: "" })); // Clear phone error
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {errors.phone && (
          <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
        )}
      </div>
      {editMode && (
        <div className="w-full max-w-80">
          <label className="text-gray-700 font-medium mb-1 text-sm block">
            Employee Type
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            name="status"
            value={credentials.status}
            onChange={handleChange}
          >
            <option value={7}>HH Employee</option>
            <option value={11}>Inactive Employee</option>
            <option value={12}>Banned Employee</option>
          </select>
        </div>
      )}

      <Button
        color="bg-blue-500"
        text={editMode ? "Update Employee" : "Add Employee"}
      />
    </form>
  );
}
