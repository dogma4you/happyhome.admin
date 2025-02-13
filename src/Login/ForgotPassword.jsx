import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../Components/Input";
import api from "../api/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api
      .get(`/auth/resend_verification_code=${email}`)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-3 bg-gray-100">
      <h2 className="text-2xl font-semibold mb-2">Forgot Password</h2>
      <p className="text-gray-600 mb-6">
        Enter your email to reset your password
      </p>
      <form
        onSubmit={handleSubmit}
        className="w-full flex items-center gap-4 flex-col max-w-sm bg-white p-8 rounded-lg shadow-md"
      >
        <Input
          label="Email"
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="w-3/5 bg-amber-600 text-white py-2 px-4 rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 mt-2"
        >
          Reset Password
        </button>
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="text-cyan-400 hover:underline"
        >
          Back to Login
        </button>
      </form>
    </div>
  );
}
