import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@material-tailwind/react";
import Input from "../Components/Input";
import useAuthStore from "../store/useAuthStore";

export default function Login() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const { login, loginError, clearLoginError } = useAuthStore();

  useEffect(() => {
    return () => clearLoginError();
  }, [credentials, clearLoginError]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(credentials);
    if (success) {
      navigate("/");
    }
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-3 bg-gray-100">
      <h2 className="text-2xl font-semibold mb-2">Sign in to HHI</h2>
      <p className="text-gray-600 mb-6">Enter your details below</p>
      {loginError && <p className="text-red-500 mb-4">{loginError}</p>}
      <form
        onSubmit={handleSubmit}
        className="w-full flex items-center gap-4 flex-col max-w-sm bg-white p-8 rounded-lg shadow-md"
      >
        <Input
          label="Email"
          type="email"
          name="email"
          value={credentials.email}
          onChange={handleChange}
        />
        <Input
          label="Password"
          label2="Forgot Password?"
          label2Link="/forgot-password"
          type="password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
        />
        <div className="w-full">
          <Checkbox
            className="p-0 gap-3 flex items-center"
            label={<span className="ml-2">Keep me logged in</span>}
            name="keepLoggedIn"
            containerProps={{
              className: "p-0",
            }}
          />
        </div>
        <button
          type="submit"
          className="w-3/5 bg-amber-600 text-white py-2 px-4 rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 mt-2"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
