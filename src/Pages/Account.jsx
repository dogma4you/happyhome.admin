import { useState } from "react";
import Input from "../Components/Input";

export default function Account() {
  const [credentials, setCredentials] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('credentials', credentials)
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex items-center gap-4 flex-col bg-white p-8">
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
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
        </div>
        <div className="flex gap-4">
          <Input
            label="Email"
            type="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
          />
          <Input
            label="Password"
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
          />
        </div>
      </div>
      <button
        type="submit"
        className="max-w-xs bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-2 mt-2"
      >
        Save Changes
      </button>
    </form>
  );
}