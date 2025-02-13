import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Input({
  label,
  label2,
  type,
  label2Link,
  name,
  value,
  onChange = () => {},
  placeholder,
  error,
  required = false,
  allowNumbers = false,
  disabled = false,
}) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleLabel2Click = () => {
    if (label2Link) {
      navigate(label2Link);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e) => {
    if (allowNumbers) {
      const regex = /^[0-9\b]+$/;
      if (e.target.value === "" || regex.test(e.target.value)) {
        onChange(e);
      }
    } else {
      onChange(e);
    }
  };

  return (
    <div className="w-full max-w-80">
      <div className="flex items-center justify-between mb-1 text-sm font-medium">
        <label className="text-gray-700 font-medium">{label}</label>
        {label2 && (
          <span
            className="text-cyan-400 font-medium cursor-pointer"
            onClick={handleLabel2Click}
          >
            {label2}
          </span>
        )}
      </div>
      <div className="relative">
        <input
          disabled={disabled}
          type={type === "password" && showPassword ? "text" : type}
          name={name}
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {type === "password" && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <FaEyeSlash className="text-gray-400" />
            ) : (
              <FaEye className="text-gray-400" />
            )}
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
