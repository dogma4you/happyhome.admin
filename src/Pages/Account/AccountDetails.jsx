import { useState, useEffect } from "react";
import Input from "../../Components/Input";
import PhoneInput from "react-phone-number-input/input";
import api from "../../api/api";
import useModal from "../../store/useModal";
import useUserSelf from "../../store/useUserSelf";


export default function AccountDetails() {
  const { user } = useUserSelf();
  const { setModalDetails, resetModalDetails } = useModal();
  
  const [credentials, setCredentials] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: ""
  });

  useEffect(() => {
    if (user) {
      setCredentials({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone: user.phone || "",
        password: ""
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api.put("/admin/profile", credentials)
      .then(() => {
        setModalDetails({
          isVisible: true,
          image: "success",
          onClose: () => {
            resetModalDetails();
          },
        });
      })
      .catch((err) => {
        console.log("🚀 ~ AccountDetails ~ err:", err);
      });
  };

  return (
  <div className="flex flex-col justify-center items-center mt-4">
      <form
      onSubmit={handleSubmit}
      className="w-full flex justify-center items-center gap-4 flex-col max-w-sm bg-white p-8 rounded-lg shadow-md"
    >
    <h3 className="text-xl font-medium mb-4">Account Details</h3>
      <Input
        label="First Name"
        type="text"
        name="first_name"
        value={credentials.first_name}
        onChange={handleChange}
      />
      <Input
        label="Last Name"
        type="text"
        name="last_name"
        value={credentials.last_name}
        onChange={handleChange}
      />
      <Input
        label="Email"
        type="text"
        name="email"
        value={credentials.email}
        onChange={handleChange}
      />
      <div className="w-full max-w-80">
        <label className="text-gray-700 font-medium mb-1 text-sm block">
          Phone Number
        </label>
        <PhoneInput
          value={credentials.phone}
          onChange={(value) => setCredentials(prev => ({ ...prev, phone: value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      
      <Input
        label="Password"
        type="password"
        name="password"
        value={credentials.password}
        onChange={handleChange}
      />
      <button
        type="submit"
        className="w-3/5 bg-amber-600 text-white py-2 px-4 rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 mt-2"
      >
        Update
      </button>
    </form>
  </div>
  );
}